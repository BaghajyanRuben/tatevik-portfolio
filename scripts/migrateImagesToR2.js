/**
 * Migration Script: Local Images to Cloudflare R2
 * 
 * This script uploads existing images from public/images/projects/ to Cloudflare R2
 * and updates Firestore with the new R2 URLs.
 * 
 * Usage: node scripts/migrateImagesToR2.js
 * 
 * Prerequisites:
 * - npm install @aws-sdk/client-s3 firebase-admin dotenv
 * - R2 credentials in .env.local
 * - Firebase service account key
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: '.env.local' });

// Initialize Firebase Admin
let serviceAccount;
try {
  const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
  const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountData);
} catch (error) {
  console.error('Error: firebase-service-account.json not found!');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Initialize R2 Client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_R2_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.VITE_R2_BUCKET_NAME;
const publicUrl = process.env.VITE_R2_PUBLIC_URL;

// Upload file to R2
async function uploadFileToR2(localPath, r2Key) {
  try {
    const fullLocalPath = path.join(__dirname, '..', localPath);
    
    if (!fs.existsSync(fullLocalPath)) {
      console.warn(`  ⚠ File not found: ${localPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(fullLocalPath);
    const contentType = getContentType(localPath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await r2Client.send(command);
    
    const r2Url = `${publicUrl}/${r2Key}`;
    console.log(`  ✓ Uploaded: ${localPath} -> ${r2Key}`);
    
    return r2Url;
  } catch (error) {
    console.error(`  ✗ Error uploading ${localPath}:`, error.message);
    return null;
  }
}

// Get content type from file extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return types[ext] || 'application/octet-stream';
}

// Process image path and upload to R2
async function processImagePath(imagePath, projectId, folder) {
  if (!imagePath) return '';
  
  // If already an R2 URL, keep it
  if (imagePath.includes('r2.dev') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Convert local path to file system path
  const localPath = imagePath.startsWith('/') ? `public${imagePath}` : imagePath;
  const fileName = path.basename(imagePath);
  const r2Key = `images/projects/${projectId}/${folder}/${fileName}`;
  
  const r2Url = await uploadFileToR2(localPath, r2Key);
  return r2Url || imagePath;
}

// Main migration function
async function migrateImagesToR2() {
  console.log('🚀 Starting image migration to Cloudflare R2...\n');

  // Verify R2 credentials
  if (!process.env.VITE_R2_ACCOUNT_ID || !process.env.VITE_R2_ACCESS_KEY_ID) {
    console.error('❌ R2 credentials not found in .env.local');
    console.error('Please add R2 credentials (see R2_SETUP_INSTRUCTIONS.md)');
    process.exit(1);
  }

  console.log(`✓ R2 Bucket: ${bucketName}`);
  console.log(`✓ Public URL: ${publicUrl}\n`);

  try {
    // Get all projects from Firestore
    const projectsSnapshot = await db.collection('projects').get();
    
    if (projectsSnapshot.empty) {
      console.log('No projects found in Firestore');
      return;
    }

    console.log(`Found ${projectsSnapshot.size} projects to process\n`);

    const results = {
      success: [],
      failed: [],
      imagesUploaded: 0,
    };

    // Process each project
    let projectIndex = 0;
    for (const docSnapshot of projectsSnapshot.docs) {
      projectIndex++;
      const projectData = docSnapshot.data();
      const docId = docSnapshot.id;
      
      console.log(`\n[${projectIndex}/${projectsSnapshot.size}] Processing: ${projectData.title}`);

      try {
        const updates = {};
        let uploadCount = 0;

        // Upload thumbnail
        if (projectData.thumbnail && !projectData.thumbnail.includes('r2.dev')) {
          console.log('  Uploading thumbnail...');
          const url = await processImagePath(projectData.thumbnail, projectData.id, 'thumbnail');
          if (url && url !== projectData.thumbnail) {
            updates.thumbnail = url;
            uploadCount++;
          }
        }

        // Upload hero image
        if (projectData.heroImage && !projectData.heroImage.includes('r2.dev')) {
          console.log('  Uploading hero image...');
          const url = await processImagePath(projectData.heroImage, projectData.id, 'hero');
          if (url && url !== projectData.heroImage) {
            updates.heroImage = url;
            uploadCount++;
          }
        }

        // Upload hero mockups
        if (projectData.heroMockups && Array.isArray(projectData.heroMockups)) {
          console.log('  Uploading hero mockups...');
          const newMockups = [];
          for (let i = 0; i < projectData.heroMockups.length; i++) {
            const mockup = projectData.heroMockups[i];
            if (mockup && !mockup.includes('r2.dev')) {
              const url = await processImagePath(mockup, projectData.id, 'heroMockups');
              newMockups.push(url);
              if (url !== mockup) uploadCount++;
            } else {
              newMockups.push(mockup);
            }
          }
          if (JSON.stringify(newMockups) !== JSON.stringify(projectData.heroMockups)) {
            updates.heroMockups = newMockups;
          }
        }

        // Upload info section images
        if (projectData.infoSections && Array.isArray(projectData.infoSections)) {
          console.log('  Uploading info section images...');
          const newInfoSections = [];
          
          for (let i = 0; i < projectData.infoSections.length; i++) {
            const section = { ...projectData.infoSections[i] };
            
            if (section.topImage && !section.topImage.includes('r2.dev')) {
              const url = await processImagePath(section.topImage, projectData.id, 'infoSections');
              if (url !== section.topImage) {
                section.topImage = url;
                uploadCount++;
              }
            }
            
            if (section.bottomImage && !section.bottomImage.includes('r2.dev')) {
              const url = await processImagePath(section.bottomImage, projectData.id, 'infoSections');
              if (url !== section.bottomImage) {
                section.bottomImage = url;
                uploadCount++;
              }
            }
            
            newInfoSections.push(section);
          }
          
          if (JSON.stringify(newInfoSections) !== JSON.stringify(projectData.infoSections)) {
            updates.infoSections = newInfoSections;
          }
        }

        // Upload gallery images
        if (projectData.gallery?.images && Array.isArray(projectData.gallery.images)) {
          console.log('  Uploading gallery images...');
          const newGallery = [];
          for (let i = 0; i < projectData.gallery.images.length; i++) {
            const image = projectData.gallery.images[i];
            if (image && !image.includes('r2.dev')) {
              const url = await processImagePath(image, projectData.id, 'gallery');
              newGallery.push(url);
              if (url !== image) uploadCount++;
            } else {
              newGallery.push(image);
            }
          }
          if (JSON.stringify(newGallery) !== JSON.stringify(projectData.gallery.images)) {
            updates.gallery = { images: newGallery };
          }
        }

        // Update Firestore if there are changes
        if (Object.keys(updates).length > 0) {
          updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
          updates.updatedBy = 'r2-migration-script';
          
          await db.collection('projects').doc(docId).update(updates);
          console.log(`  ✓ Updated Firestore (${uploadCount} images uploaded)`);
          results.imagesUploaded += uploadCount;
        } else {
          console.log('  ✓ No changes needed (already using R2)');
        }

        results.success.push(projectData.id);

      } catch (error) {
        console.error(`  ✗ Failed:`, error.message);
        results.failed.push({ id: projectData.id, error: error.message });
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✓ Successful: ${results.success.length}`);
    console.log(`✗ Failed: ${results.failed.length}`);
    console.log(`📤 Images Uploaded: ${results.imagesUploaded}`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed projects:');
      results.failed.forEach(f => {
        console.log(`  - ${f.id}: ${f.error}`);
      });
    }
    
    console.log('\n✓ Migration to R2 completed!');
    console.log(`\n💡 Your images are now in R2 at: ${publicUrl}`);

  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateImagesToR2()
  .then(() => {
    console.log('\nExiting...');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
