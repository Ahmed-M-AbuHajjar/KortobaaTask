import { Router } from 'express';
import userController from './controller/user.controller';

class UserRouter {
  public router: Router;

  constructor() {
    // Create a new instance of the Express Router
    this.router = Router();
    // Initialize the routes
    this.initRoutes();
  }
  private initRoutes(): void {
    // signup Api
    this.router.post('/signup', userController.signUp);
    // Signin Api
    this.router.post('/signin',userController.signIn);
  }
};
// Export an instance of the UserRouter's router property
export default new UserRouter().router;