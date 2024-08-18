import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction} from 'express';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)
    const {userId,email,password} = req.body;

        // Password validation function
        const isStrongPassword = (password: string): boolean => {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return passwordRegex.test(password);
        };
    
         // Email validation function
        const isEmailValid = (email: string): boolean => {
          const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
          return emailRegex.test(email);
        };

        // UserId validation function
        const isUserIdValid = (userId: string): boolean => {
          return userId.length >= 3; 
        };

        if (!isEmailValid(email)) {
          return res.status(400).json({ 
            message: 'Invalid email format' });
        }

        if (!isUserIdValid(userId)) {
          return res.status(400).json({ 
            message: 'UserId must be at least 3 characters long' });
        }

        if (!isStrongPassword(password)) {
          return res.status(400).json({
            message: 'Password must be 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
          });
        }
        
    // Continue with the middleware or pass it to the controller
    next();
  }
}
