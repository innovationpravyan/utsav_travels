'use server';

import {z} from 'zod';

// Enhanced validation schemas
z.object({
    name: z.string()
        .min(2, {message: 'Name must be at least 2 characters.'})
        .max(50, {message: 'Name must not exceed 50 characters.'})
        .regex(/^[a-zA-Z\s.'-]+$/, {message: 'Name contains invalid characters.'})
        .trim(),
    phone: z.string()
        .min(10, {message: 'Phone number must be at least 10 digits.'})
        .max(15, {message: 'Phone number must not exceed 15 digits.'})
        .regex(/^[+]?[1-9]\d{0,15}$/, {message: 'Invalid phone number format.'})
        .trim(),
    email: z.string()
        .email({message: 'Invalid email address.'})
        .max(100, {message: 'Email must not exceed 100 characters.'})
        .optional(),
    message: z.string()
        .max(500, {message: 'Message must not exceed 500 characters.'})
        .optional(),
    preferredTime: z.enum(['morning', 'afternoon', 'evening'], {
        errorMap: () => ({message: 'Invalid preferred time.'})
    }).optional(),
    source: z.string().max(50).optional()
});
z.object({
    name: z.string()
        .min(2, {message: 'Name must be at least 2 characters.'})
        .max(50, {message: 'Name must not exceed 50 characters.'})
        .regex(/^[a-zA-Z\s.'-]+$/, {message: 'Name contains invalid characters.'})
        .trim(),
    email: z.string()
        .email({message: 'Invalid email address.'})
        .max(100, {message: 'Email must not exceed 100 characters.'})
        .trim(),
    phone: z.string()
        .min(10, {message: 'Phone number must be at least 10 digits.'})
        .max(15, {message: 'Phone number must not exceed 15 digits.'})
        .regex(/^[+]?[1-9]\d{0,15}$/, {message: 'Invalid phone number format.'})
        .trim(),
    subject: z.string()
        .min(5, {message: 'Subject must be at least 5 characters.'})
        .max(100, {message: 'Subject must not exceed 100 characters.'})
        .trim(),
    message: z.string()
        .min(10, {message: 'Message must be at least 10 characters.'})
        .max(1000, {message: 'Message must not exceed 1000 characters.'})
        .trim()
});
