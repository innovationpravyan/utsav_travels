'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RequestCallSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
});

export async function requestCallBack(prevState: any, formData: FormData) {
  const validatedFields = RequestCallSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data. Please check your inputs.',
      success: false,
    };
  }
  
  try {
    const { name, phone } = validatedFields.data;
    await addDoc(collection(db, 'callRequests'), {
      name,
      phone,
      createdAt: serverTimestamp(),
      status: 'pending',
    });
    return { message: 'Success! We will call you back shortly.', errors: {}, success: true };
  } catch (error) {
    console.error('Error requesting call back:', error);
    return { message: 'An unexpected error occurred. Please try again.', errors: {}, success: false };
  }
}
