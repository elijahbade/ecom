import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User.model';
import ErrorResponse from '../utils/error.utils';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      roles?: any[];
      user?: Document | any;
    }
  }
}

// export const protect = async (req: Request, res: Response, next: NextFunction) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return next(new ErrorResponse('Not authorized to access this route', 401, [' An error occured']));
//   }

//   try {

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//     req.userId = decoded.id;
    
    
//     req.roles = decoded.roles;

//     console.log("The  role of the user is", decoded.roles)


//     const user = await User.findOne({ _id: decoded.id }).select('-password');

//     if (!req.user) {
//       return next(new ErrorResponse('User not found', 404, [' An error occured']));
//     }
    
    
//     req.user = {
//       id: user._id.toString(),
//       userType: user.userType,
//     };
    
//     next();
//   } catch (error) {
//     console.log('catch the error', error)
//     return next(new ErrorResponse('Invalid token', 401, [' An error occured']));
//   }
// };

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401, ['An error occurred']));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    req.userId = decoded.id;
    req.roles = decoded.roles;
    
    console.log("The role of the user is", decoded.roles);

    const user = await User.findOne({ _id: decoded.id }).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404, ['An error occurred']));
    }

    req.user = {
      id: user._id.toString(),
      userType: user.userType,
    };

    next();
  } catch (error) {
    console.log('catch the error', error);
    return next(new ErrorResponse('Invalid token', 401, ['An error occurred']));
  }
};


export const rbac = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorResponse("Not authenticated", 401, ['Contact Admin!']));
    }
    if (!allowedRoles.includes(req.user.userType)) {
      return next(new ErrorResponse("Not authorized to access this route", 403, ['Access Denied']));
    }

    next();
  };
};