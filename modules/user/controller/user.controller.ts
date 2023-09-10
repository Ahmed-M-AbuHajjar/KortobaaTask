import { Request, Response } from 'express';
import { User } from '../../../DB/models/user.model';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

class UserController {
    public signUp = async (req: Request, res: Response): Promise<void> => {
      try {
        // Destructure the request body to extract userName, email, and password
        const { userName, email, password } = req.body; 
        // Define a regular expression pattern for password validation
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        // Check if the password matches the defined pattern
        if (!passwordPattern.test(password)) {
          throw new Error('Password must be at least 8 characters long and contain at least 1 letter and 1 number');
        }
        const saltRounds:string = "7";
        // Hash the password using bcryptjs and the specified salt rounds
        const hashedPassword = bcryptjs.hashSync(password,parseInt(saltRounds));
        const newUser = await User.create({ userName, email, password:hashedPassword });
        // Send a success response with the newly created user
        res.status(201).json({ message: "User Added Successfully", newUser });
      } catch (error:any) {
        // Handle any errors that occurred during the sign-up process
        if(error.parent && error.parent.errno == 1062){
            res.status(409).json({message:"ERROR: Email already exists!"});
      }  else {
        res.status(400).json({ Message:'ERROR',error: error.message });
      }
     }
    };
    public signIn = async (req: Request, res: Response): Promise<void> => {
      try {
        // Destructure the request body to extract email and password
        const { email, password } = req.body;
        // Find the user in the database based on the provided email
        const foundedUser:User | null = await User.findOne({ where:{email} });
        if (foundedUser) {
          // Compare the provided password with the hashed password stored in the database
          const matched = bcryptjs.compareSync(password,foundedUser.password);
   
            if (matched) {
              const jwtKey: string = 'KortobaaTask'
              if(jwtKey){
              const token = jwt.sign({ isLogin: true, id: (foundedUser as any).id }, jwtKey);
              // Send a success response with the user and the generated JWT token
              res.status(200).json({ message: 'Welcome', foundedUser, token });
              } else {
                throw new Error('Undefined jwt Key!');
              }
            } else {
              // Send an error response for an invalid password
              res.status(406).json({ message:'ERROR: Invalid password!' });
            }
        } else {
          // Send an error response if the user is not found in the database
          res.status(404).json({ message: 'ERROR: User not registered!' });
        }
      } catch (error:any) {
        // Handle any errors that occurred during the sign-in process
        res.status(400).json({ message: 'ERROR', error:error.message });
      }
    };
  };

// Export UserController to extract it's functions in user router
export default new UserController();