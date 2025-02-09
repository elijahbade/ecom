import { Request, Response, NextFunction, query } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.model';
import asyncHandler from '../middleware/aysnc.mw';
import ErrorResponse from '../utils/error.utils';

// Function to get all users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}); // Use find() to get all users
    res.status(200).json({ success: true, data: users }); // Send the users as a response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default getAllUsers; 


export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query; 
  
  const users = await User.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } }
    ]
  });
  
  if (!users) {
    return res.status(404).json({ message: 'No users found' });
  }
  
  res.status(200).json(users);
});


export const getUserById = asyncHandler( async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log("User ID:", userId);

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "An error occurred",
    });
  }
});
