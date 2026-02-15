#!/usr/bin/env node

/**
 * Fix Missing Order Field Script
 * 
 * This script adds the 'order' field to all projects in Firestore
 * that don't have it. This ensures all projects appear in lists.
 * 
 * Usage: node scripts/fixMissingOrderField.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for service account key
const serviceAccountPath = join(dirname(__dirname), 'firebase-service-account.json');
let serviceAccount;

try {
  const serviceAccountData = readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountData);
  console.log('✓ Service account key loaded');
} catch (error) {
  console.error('❌ Error: firebase-service-account.json not found!');
  console.error('Please download your service account key from Firebase Console:');
  console.error('Project Settings > Service Accounts > Generate New Private Key');
  console.error('Save it as firebase-service-account.json in the project root');
  process.exit(1);
}

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function fixMissingOrderField() {
  console.log('\n🔧 Fixing missing order field in projects...\n');

  try {
    // Get all projects
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.get();

    if (snapshot.empty) {
      console.log('⚠️  No projects found in Firestore.');
      return;
    }

    console.log(`📊 Found ${snapshot.size} projects in Firestore\n`);

    // Get all projects and sort them
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by createdAt (oldest first) to maintain chronological order
    projects.sort((a, b) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return aTime - bTime;
    });

    let fixed = 0;
    let skipped = 0;

    // Update projects with order field
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const orderValue = i + 1;

      if (project.order === undefined || project.order === null) {
        console.log(`📝 Adding order field to: ${project.title || project.id}`);
        console.log(`   Order: ${orderValue}`);
        
        await projectsRef.doc(project.id).update({
          order: orderValue,
          updatedAt: new Date()
        });
        
        fixed++;
      } else {
        console.log(`✓ Project already has order: ${project.title || project.id} (order: ${project.order})`);
        skipped++;
      }
    }

    console.log('\n✅ Fix completed!');
    console.log(`   Fixed: ${fixed} projects`);
    console.log(`   Skipped: ${skipped} projects (already had order field)`);
    console.log(`   Total: ${snapshot.size} projects\n`);

  } catch (error) {
    console.error('❌ Error fixing order field:', error);
    process.exit(1);
  }
}

// Run the script
fixMissingOrderField()
  .then(() => {
    console.log('✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
