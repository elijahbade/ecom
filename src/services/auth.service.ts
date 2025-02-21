import { RegisterDTO } from "../dtos/auth.dtos";
import { IResult, IUserDoc } from "../utils/interface.utils";
import UserService from "./user.service";
import { LoginDTO } from "../dtos/auth.dtos";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import axios from 'axios';
import{client} from './googleClient.service';




class AuthService {

    constructor(){}

      /**
     * @name validateRegister
     * @param data 
     * @returns { IResult } - see IResult
     */

      public async validateRegister(data: RegisterDTO): Promise<IResult>{

        let result: IResult = { error: false, message: "", code: 200, data: {} }

            const { email, password } = data;

            if (!email) {
                result.error = true;
                result.message = 'email is required'
                result.code = 400;
            } else if(!password){
                result.error = true;
                result.message = 'Password is required'
                result.code = 400;
            } else if(!UserService.checkEmail(email)){
                result.error = true;
                result.message = 'Invalid email supplied'
                result.code = 400;
            } else if(!UserService.checkPassword(password)){
                result.error = true;
                result.message = 'password length must be greater or equal to 8 and must contain 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number'
                result.code = 400;
            } else{
                result.error = false;
                result.message = "";
                result.code = 200;
            }
            return result
    } 

      // public async sendVerificationEmail(user: IUserDoc): Promise<void> {
      //   const verificationToken = crypto.randomBytes(32).toString('hex');
    
      //   // Save verification token to user
      //   user.emailVerificationToken = verificationToken;
      //   user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      //   await user.save();
    
      //   const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
      //   // Send email using MailChimp's Mandrill API
      //   await this.sendMailChimpEmail(
      //     user.email,
      //     'Verify your email',
      //     `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
      //   );
      // }
    
      // public async verifyEmail(token: string): Promise<IResult> {
      //   const user = await User.findOne({
      //     emailVerificationToken: token,
      //     emailVerificationExpires: { $gt: Date.now() }
      //   });
    
      //   if (!user) {
      //     return {
      //       error: true,
      //       message: "Invalid or expired verification token",
      //       code: 400,
      //       data: {}
      //     };
      //   }
    
      //   user.isEmailVerified = true;
      //   user.emailVerificationToken = undefined;
      //   user.emailVerificationExpires = undefined;
      //   await user.save();
    
      //   return {
      //     error: false,
      //     message: "Email verified successfully",
      //     code: 200,
      //     data: {}
      //   };
      // }
    
      // // 2. Forgot Password Functionality
    
      // public async forgotPassword(email: string): Promise<IResult> {
      //   const user = await User.findOne({ email });
        
      //   if (!user) {
      //     return {
      //       error: true,
      //       message: "User not found",
      //       code: 404,
      //       data: {}
      //     };
      //   }
    
      //   const resetToken = crypto.randomBytes(32).toString('hex');
      //   user.resetPasswordToken = resetToken;
      //   user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      //   await user.save();
    
      //   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
      //   try {
      //     await this.sendMailChimpEmail(
      //       user.email,
      //       'Password Reset Request',
      //       `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`
      //     );
      //     return {
      //       error: false,
      //       message: "Password reset email sent",
      //       code: 200,
      //       data: {}
      //     };
      //   } catch (error) {
      //     user.resetPasswordToken = undefined;
      //     user.resetPasswordExpires = undefined;
      //     await user.save();
      //     return {
      //       error: true,
      //       message: "Email could not be sent",
      //       code: 500,
      //       data: {}
      //     };
      //   }
      // }
    
      // public async resetPassword(token: string, newPassword: string): Promise<IResult> {
      //   const user = await User.findOne({
      //     resetPasswordToken: token,
      //     resetPasswordExpires: { $gt: Date.now() }
      //   });
    
      //   if (!user) {
      //     return {
      //       error: true,
      //       message: "Invalid or expired reset token",
      //       code: 400,
      //       data: {}
      //     };
      //   }
    
      //   user.password = newPassword; // Consider hashing this password before saving
      //   user.resetPasswordToken = undefined;
      //   user.resetPasswordExpires = undefined;
      //   await user.save();
    
      //   return {
      //     error: false,
      //     message: "Password reset successful",
      //     code: 200,
      //     data: {}
      //   };
      // }
    
      // // 3. Google Sign-In
    
      // public async googleSignIn(googleToken: string): Promise<IResult> {
      //   try {
      //     const ticket = await client.verifyIdToken({
      //       idToken: googleToken,
      //       audience: process.env.GOOGLE_CLIENT_ID
      //     });
          
      //     const payload = ticket.getPayload();
      //     if (!payload) {
      //       return {
      //         error: true,
      //         message: "Invalid Google token",
      //         code: 400,
      //         data: {}
      //       };
      //     }
    
      //     let user: IUserDoc | null = await User.findOne({ email: payload.email });
      //     if (!user) {
      //       // Create new user if doesn't exist
      //       user = await UserService.createUser({
      //         email: payload.email!,
      //         firstName: payload.given_name!,
      //         lastName: payload.family_name!,
      //         isEmailVerified: true,
      //         googleId: payload.sub,
      //         userType: "user" 
      //         ,
      //         password: "",
      //         avatar: ""
      //       });
      //     }
    
      //     const token = await user.getAuthToken();
      //     return {
      //       error: false,
      //       message: "Google sign-in successful",
      //       code: 200,
      //       data: { user, token }
      //     };
      //   } catch (error) {
      //     return {
      //       error: true,
      //       message: "Google authentication failed",
      //       code: 400,
      //       data: {}
      //     };
      //   }
      // }
    
      // // Utility function to send emails via MailChimp (Mandrill)
      // private async sendMailChimpEmail(to: string, subject: string, htmlContent: string): Promise<any> {
      //   const apiKey = process.env.MAILCHIMP_API_KEY;
      //   const fromEmail = process.env.MAILCHIMP_FROM_EMAIL;
      //   const url = 'https://mandrillapp.com/api/1.0/messages/send.json';
    
      //   const payload = {
      //     key: apiKey,
      //     message: {
      //       from_email: fromEmail,
      //       to: [{ email: to, type: 'to' }],
      //       subject: subject,
      //       html: htmlContent
      //     }
      //   };
    
      //   const response = await axios.post(url, payload, {
      //     headers: { 'Content-Type': 'application/json' }
      //   });
      //   return response.data;
      // }
    
    
    
    }

export default new AuthService()