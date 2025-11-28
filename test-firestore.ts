// Test Firebase connection
import { db } from './lib/firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

async function testFirestore() {
    console.log('=== Testing Firestore Connection ===');

    try {
        console.log('1. Firestore db object:', db);

        console.log('2. Attempting to read packages collection...');
        const snapshot = await getDocs(collection(db, 'packages'));
        console.log('Packages count:', snapshot.size);

        console.log('3. Attempting to write a test document...');
        const docRef = await addDoc(collection(db, 'test'), {
            message: 'Hello Firestore!',
            timestamp: new Date(),
        });
        console.log('Test document created with ID:', docRef.id);

        console.log('✅ Firestore is working!');
    } catch (error) {
        console.error('❌ Firestore test failed:', error);
        console.error('Error details:', error);
    }
}

testFirestore();
