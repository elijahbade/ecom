import { IResult, IUserDoc } from '../utils/interface.utils';
import User from '../models/User.model';
import ErrorResponse from '../utils/error.utils'; // Custom error handling utility
import jwt from 'jsonwebtoken';

export const loginService = async (email: string, password: string) => {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
  
    
    const user: IUserDoc | null = await User.findOne({ email }).select('+password');
    if (!user) {
        result.error = true;
        result.message = "Invalid Credentials";
        result.code = 400;
        return result;     
    }
  
  
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        result.error = true;
        result.message = "Invalid Credentials";
        result.code = 400;
        return result; 
    }
  
   
    const token = await user.getAuthToken();
  
    return { user, token };
  };
  
