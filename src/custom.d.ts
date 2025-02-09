import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      roles?: any[]; // Replace `any[]` with your specific type if available
      user?: Document | any; // Adjust this to match your User type if needed
    }
  }
}

export {}
