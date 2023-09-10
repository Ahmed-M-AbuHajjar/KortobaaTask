import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../DB/models/user.model';

interface CustomRequest extends Request {
  user?: User;
}

class AuthMiddleware {
  public auth = () => {
    try {
      // Returns an asynchronous middleware function to handle authentication
      return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const { authorization } = req.headers;
        // Check if authorization header exists and starts with 'Bearer'
        if (authorization && authorization.startsWith('Bearer')) {
          const token = authorization.split(' ')[1];
          try {
            const jwtKey: string = 'KortobaaTask';
            // Verify the token using the JWT key
            if(jwtKey){
                const verified = jwt.verify(token, jwtKey) as { id: string };
                // Find the user associated with the token's ID
                const user = await User.findByPk(verified.id);
                if (user) {
                  // Set the user object on the request for further processing
                  req.user = user;
                  next();
                } else {
                  res.status(401).json({ message: 'Invalid user' });
                }
            } else {
                throw new Error('Undefined jwt Key');
            }
            
            
          } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
          }
        } else {
          res.status(401).json({ message: 'Invalid token or not sent' });
        }
      };
    } catch (error) {
      return (req: Request, res: Response): void => {
        res.status(500).json({ message: 'Error', error });
      };
    }
  };
}
// Exporting auth function to be used in endpoints
export default new AuthMiddleware().auth;