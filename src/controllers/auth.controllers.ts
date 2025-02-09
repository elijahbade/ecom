import { Request, Response, NextFunction } from 'express'
import asyncHandler from "../middleware/aysnc.mw";
import { LoginDTO, RegisterDTO } from '../dtos/auth.dtos';
import Role from '../models/Role.models';
import { AppChannel, UserType } from '../utils/enums.utils';
import ErrorResponse from '../utils/error.utils';
import User from '../models/User.model';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service'
import AuthMapper from '../mappers/auth.mappers';


/**
 * @name register
 * @description Registers a new user for the application
 * @route POST /auth/register
 * @access everyone
 */

export const register = asyncHandler ( async (req: Request, res: Response, next: NextFunction) => {
    
    const { email, password, username, firstName, avatar } = req.body as RegisterDTO;
    console.log('Full Request Body:', req.body);
    console.log('Destructured Avatar:', avatar);
    console.log('Entire Payload:', JSON.stringify(req.body, null, 2));
    
    const validate = await AuthService.validateRegister(req.body)
   
    if (validate.error) {
        return next(new ErrorResponse('Error', validate.code!, [validate.message]))
    }
   
    //validate existing email
    const existUser = await User.findOne({email: email});

    if (existUser) {
        return next(new ErrorResponse('Error', 403, ["user already exists, use another email"]))
    }
    //create the user
    const user = await UserService.createUser({
        avatar: avatar,
        email: email,
        password: password,
        username: username,
        firstName: firstName,
        
        userType: UserType.BUSINESS
    });

    //map data
    const mapped = await AuthMapper.mapRegisteredUser(user)

    res.status(200).json({
        error: false,
        errors: [],
        data: mapped,
        message: 'successful',
        status: 200
    })
})

