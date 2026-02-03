// Quick Firebase test - paste this in browser console to verify Firebase is working

import { auth, db } from './src/firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

console.log('Firebase Auth:', auth);
console.log('Firebase initialized:', auth ? '✅ Yes' : '❌ No');
console.log('Auth Domain:', auth.config.authDomain);

// Test creating a user (run this in console after importing)
// createUserWithEmailAndPassword(auth, 'test@test.com', 'Test123!')
//   .then(result => console.log('✅ Test user created:', result.user.uid))
//   .catch(err => console.error('❌ Error:', err.code, err.message));
