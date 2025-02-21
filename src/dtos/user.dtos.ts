export interface CreateUserDTO{
    firstName?: string,
    lastName?: string,
    username?: string,
    userType: string
    phoneCode?: string,
    phoneNumber?: string,
    email: string,
    password: string,
    googleId?: string,
    avatar: string;
    isEmailVerified?: boolean;
}