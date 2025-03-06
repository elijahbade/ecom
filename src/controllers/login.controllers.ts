import { Request, Response, NextFunction } from 'express';
import { loginService } from '../services/login.service';
import { IResult, IUserDoc } from '../utils/interface.utils';
import asyncHandler from '../middleware/aysnc.mw';import ErrorResponse from '../utils/error.utils';

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let result: IResult = { error: false, message: "", code: 200, data: {} };

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Error', 400, ["Enter Credentials"])); // Fixed error message
    }

    const loginResult = await loginService(email, password);

    if ('code' in loginResult) {
      return res.status(loginResult.code).json(loginResult);
    }

    const { user, token } = loginResult as { user: IUserDoc; token: string };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        },
        token,
      },
    });
  } catch (error) {
    return next(new ErrorResponse('Error', 500, ["Something went wrong"])); // Better generic error message
  }
});



export const checkUser = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {

  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    message: "User authenticated",
    userId: req.user.id, 
    userType: req.user.userType, 
  });
});

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
    token: null, 
  });
};