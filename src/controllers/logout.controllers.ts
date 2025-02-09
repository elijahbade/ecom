import { Request, Response } from 'express';

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
    token: null, // Invalidate token (Client should remove it from storage)
  });
};
