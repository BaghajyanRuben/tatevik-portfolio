/**
 * Migration Script: Projects JSON to Firestore
 * 
 * This script migrates projects from the local JSON file to Firestore:
 * 1. Reads projects.json
 * 2. Verifies local images exist in /public/images/projects/
 * 3. Saves project data with local paths to Firestore
 * 
 * Note: Files remain in public/images/ - no uploads to Firebase Storage
 * 
 * Usage: node scripts/migrateProjectsToFirebase.js
 * 
 * Prerequisites:
 * - npm install firebase-admin dotenv
 * - Create a Firebase service account key and save as firebase-service-account.json
 * - Add FIREBASE_PROJECT_ID to .env.local
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: '.env.local' });

// Initialize Firebase Admin
let serviceAccount;
try {
  const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
  const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountData);
} catch (error) {
  console.error('Error: firebase-service-account.json not found!');
  console.error('Please download your service account key from Firebase Console:');
  console.error('Project Settings > Service Accounts > Generate New Private Key');
  console.error('Save it as firebase-service-account.json in the project root');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper: Verify local file exists
function verifyFile(imagePath) {
  if (!imagePath) return { exists: false, path: '' };
  
  // If already a URL, assume it exists
  if (imagePath.startsWith('http')) {
    return { exists: true, path: imagePath };
  }
  
  // Convert local path to file system path
  const localPath = imagePath.startsWith('/') ? `public${imagePath}` : imagePath;
  const fullLocalPath = path.join(__dirname, '..', localPath);
  
  const exists = fs.existsSync(fullLocalPath);
  
  if (!exists) {
    console.warn(`  ⚠ File not found: ${imagePath}`);
  }
  
  return { exists, path: imagePath };
}

// Helper: Process image path (verify only, no upload)
function processImagePath(imagePath) {
  const result = verifyFile(imagePath);
  return result.path;
}

// Main migration function
async function migrateProjects() {
  console.log('🚀 Starting project migration to Firebase...\n');

  try {
    // Read projects.json
    const projectsPath = path.join(__dirname, '..', 'src', 'data', 'projects.json');
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    console.log(`Found ${projectsData.projects.length} projects to migrate\n`);

    // Create backup
    const backupPath = path.join(__dirname, '..', 'src', 'data', `projects.backup.${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(projectsData, null, 2));
    console.log(`✓ Backup created: ${backupPath}\n`);

    const results = {
      success: [],
      failed: []
    };

    // Process each project
    for (let i = 0; i < projectsData.projects.length; i++) {
      const project = projectsData.projects[i];
      console.log(`\n[${i + 1}/${projectsData.projects.length}] Migrating: ${project.title} (${project.id})`);

      try {
        const migratedProject = { ...project };
        let missingFiles = [];

        // Verify thumbnail
        console.log('  Verifying thumbnail...');
        if (project.thumbnail) {
          const result = verifyFile(project.thumbnail);
          migratedProject.thumbnail = result.path;
          if (!result.exists) missingFiles.push(project.thumbnail);
        }

        // Verify hero image
        console.log('  Verifying hero image...');
        if (project.heroImage) {
          const result = verifyFile(project.heroImage);
          migratedProject.heroImage = result.path;
          if (!result.exists) missingFiles.push(project.heroImage);
        }

        // Verify hero mockups
        console.log('  Verifying hero mockups...');
        if (project.heroMockups && Array.isArray(project.heroMockups)) {
          migratedProject.heroMockups = [];
          for (let j = 0; j < project.heroMockups.length; j++) {
            const result = verifyFile(project.heroMockups[j]);
            migratedProject.heroMockups.push(result.path);
            if (!result.exists) missingFiles.push(project.heroMockups[j]);
          }
        }

        // Verify info section images
        console.log('  Verifying info section images...');
        if (project.infoSections && Array.isArray(project.infoSections)) {
          for (let j = 0; j < project.infoSections.length; j++) {
            const section = project.infoSections[j];
            
            if (section.topImage) {
              const result = verifyFile(section.topImage);
              migratedProject.infoSections[j].topImage = result.path;
              if (!result.exists) missingFiles.push(section.topImage);
            }
            
            if (section.bottomImage) {
              const result = verifyFile(section.bottomImage);
              migratedProject.infoSections[j].bottomImage = result.path;
              if (!result.exists) missingFiles.push(section.bottomImage);
            }
          }
        }

        // Verify gallery images
        console.log('  Verifying gallery images...');
        if (project.gallery?.images && Array.isArray(project.gallery.images)) {
          migratedProject.gallery.images = [];
          for (let j = 0; j < project.gallery.images.length; j++) {
            const result = verifyFile(project.gallery.images[j]);
            migratedProject.gallery.images.push(result.path);
            if (!result.exists) missingFiles.push(project.gallery.images[j]);
          }
        }

        if (missingFiles.length > 0) {
          console.warn(`  ⚠ ${missingFiles.length} missing file(s) for ${project.title}`);
        }

        // Add metadata
        migratedProject.status = project.status || 'published';
        migratedProject.createdAt = admin.firestore.FieldValue.serverTimestamp();
        migratedProject.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        migratedProject.createdBy = 'migration-script';
        migratedProject.updatedBy = 'migration-script';

        // Save to Firestore
        console.log('  Saving to Firestore...');
        await db.collection('projects').add(migratedProject);
        
        if (missingFiles.length === 0) {
          console.log(`  ✓ Successfully migrated: ${project.title}`);
        } else {
          console.log(`  ✓ Migrated (with ${missingFiles.length} missing files): ${project.title}`);
        }
        results.success.push(project.id);

      } catch (error) {
        console.error(`  ✗ Failed to migrate ${project.id}:`, error.message);
        results.failed.push({ id: project.id, error: error.message });
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✓ Successful: ${results.success.length}`);
    console.log(`✗ Failed: ${results.failed.length}`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed projects:');
      results.failed.forEach(f => {
        console.log(`  - ${f.id}: ${f.error}`);
      });
    }
    
    console.log('\n✓ Migration completed!');
    console.log(`Backup saved to: ${backupPath}`);
    console.log('\nNote: Files remain in public/images/ directory (no Firebase Storage used)');

  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProjects()
  .then(() => {
    console.log('\nExiting...');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
