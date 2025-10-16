
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// --- Configuration ---
// 1. Download your Firebase service account key JSON file from:
//    Project settings > Service accounts > Generate new private key
// 2. Save it as 'serviceAccountKey.json' in the root of your project.
//    IMPORTANT: Add 'serviceAccountKey.json' to your .gitignore file to keep it private!
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

// The name of the collection you want to import data into.
const COLLECTION_NAME = 'students';

// The path to your local JSON data file.
const JSON_DATA_FILE = './students.json';
// -------------------

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const studentsCollection = db.collection(COLLECTION_NAME);

// Function to normalize mobile numbers
const normalizeMobile = (num) => {
  const str = String(num || '').trim();
  return str.startsWith('0') ? str.substring(1) : str;
};

// Function to process and import the data
const importData = async () => {
  console.log(`Starting data import from ${JSON_DATA_FILE} to Firestore collection '${COLLECTION_NAME}'...`);

  try {
    // Read the JSON file
    const dataString = readFileSync(JSON_DATA_FILE, 'utf8');
    const students = JSON.parse(dataString);

    if (!Array.isArray(students)) {
      throw new Error('JSON data is not an array.');
    }

    console.log(`Found ${students.length} records to import.`);

    // Use a batch write for efficiency
    let batch = db.batch();
    let operationsCount = 0;
    const MAX_OPERATIONS_PER_BATCH = 499; // Firestore batch limit is 500

    for (const [index, student] of students.entries()) {
      // Skip incomplete records
      if (!student.code || !student.name || !student.mobileNumber) {
          console.warn(`Skipping record at index ${index} due to missing code, name, or mobile number.`);
          continue;
      }

      // Create a new document reference for each record
      const docRef = studentsCollection.doc();

      // Clean and structure the data to match the app's 'StudentResult' type
      const processedStudent = {
        code: String(student.code).trim(),
        name: String(student.name).trim(),
        mobileNumber: normalizeMobile(student.mobileNumber),
        service: String(student.service || 'غير محدد').trim(),
        score: student.score === 'غائب' ? 'غائب' : Number(student.score) || 0,
        attendance: Math.round((Number(student.attendance) || 0) * 100),
      };
      
      batch.set(docRef, processedStudent);
      operationsCount++;

      // Commit the batch when it's full and create a new one
      if (operationsCount === MAX_OPERATIONS_PER_BATCH) {
        console.log(`Committing batch of ${operationsCount} records...`);
        await batch.commit();
        batch = db.batch();
        operationsCount = 0;
      }
    }

    // Commit any remaining operations in the last batch
    if (operationsCount > 0) {
      console.log(`Committing the final batch of ${operationsCount} records...`);
      await batch.commit();
    }

    console.log('✅ Data import completed successfully!');

  } catch (error) {
    console.error('❌ Error during data import:', error);
    process.exit(1);
  }
};

// Run the import function
importData();
