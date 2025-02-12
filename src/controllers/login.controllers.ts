import { Request, Response, NextFunction } from 'express';
import { loginService } from '../services/login.service';
import { IResult, IUserDoc } from '../utils/interface.utils';
import asyncHandler from '../middleware/aysnc.mw';
import { UserType } from '../utils/enums.utils';

export const login = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
  let result: IResult = { error: false, message: "", code: 200, data: {} };

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      result.error = true;
      result.message = "Enter Credentials";
      result.code = 400;
      return res.status(400).json(result);
    }

    const loginResult = await loginService(email, password);

    if ('code' in loginResult) {
      return res.status(loginResult.code).json(loginResult); 
    }

    const { user, token } = loginResult as { user: IUserDoc; token: string };

    // Send successful response
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
    next(error); 
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
    token: null, // Invalidate token (Client should remove it from storage)
  });
};
