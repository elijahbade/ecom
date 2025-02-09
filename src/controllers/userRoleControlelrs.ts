import { Request, Response } from 'express';
import asyncHandler from '../middleware/aysnc.mw';
import User from '../models/User.model';
import Role from '../models/Role.models';
import ErrorResponse from '../utils/error.utils';


export const updateUserType = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { userType } = req.body;

  // Validate userType
  const validUserTypes = ["admin", "user", "business"]; // Add more if needed
  if (!validUserTypes.includes(userType)) {
    return res.status(400).json({
      success: false,
      message: `Invalid userType. Must be one of: ${validUserTypes.join(", ")}`
    });
  }

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // Update userType
  user.userType = userType;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "User type updated successfully",
    data: {
      userId: user._id,
      email: user.email,
      userType: user.userType
    }
  });
});


export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { userType } = req.body;

  // Validate role
  if (!['admin', 'user'].includes(userType)) {
    return res.status(400).json({
      success: false,
      message: 'User Type must either be "admin" or "user"'
    });
  }

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Find or create the UserType
  let roleDoc = await userType.findOne({ name: userType });
  if (!roleDoc) {
    roleDoc = await Role.create({
      name: userType,
      description: `${userType} userType`,
    });
  }

  // Update user's roles
  user.roles = [roleDoc._id];
  await user.save();

  // Update role's users array
  await User.updateMany(
    { _id: { $ne: roleDoc._id } },
    { $pull: { users: user._id } }
  );
  
  await Role.findByIdAndUpdate(
    roleDoc._id,
    { $addToSet: { users: user._id } }
  );

  return res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      userId: user._id,
      email: user.email,
      userType: userType
    }
  });
});