// Write your firebase services here!
import { db } from '../firebaseConfig'; // Adjust the import if necessary
import { collection, addDoc } from 'firebase/firestore';

type AddNotificationProp = {
    title: string;
    message: string;
};

const notificationService = async ({ title, message }: AddNotificationProp): Promise<void> => {
    console.log(title, message);
    try {
        const docRef = await addDoc(collection(db, 'notifications'), {
            title,
            message,
            createdAt: new Date().toString() // Corrected to call the method
        });
        // console.log('Notification added with ID: ', docRef);
    } catch (e) {
        console.error('Error adding notification: ', e);
    }
};

export default notificationService;

// To use notificationService you need to pass two info title and message in this format 
// 
