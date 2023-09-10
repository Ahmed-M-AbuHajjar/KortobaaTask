import { Router } from 'express';
import productController from './controller/product.controller';
import {HME,myMulter,validationTypes} from '../../services/multer';
import auth from '../../middleware/auth';


class ProductRouter{
    public router:Router;
    constructor(){
        // Create a new instance of the Express Router
        this.router = Router();
        // Initialize the routes
        this.initRoutes();
    }
    private initRoutes(): void {
        // Add Product Api, passing auth for authorization. mymulter - handle multer error function for image upload and validation
        this.router.post('/add',auth(),myMulter(validationTypes.image).single('image'), HME, productController.addProduct);
        // Update Product Api, takes id of product, passing auth for authorization. mymulter - handle multer error function for image upload and validation (if there's an updated image)
        this.router.put('/update/:productId',auth(),myMulter(validationTypes.image).single('image'), HME, productController.updateProduct);
       // Delete Product Api, takes id of product, passing auth for authorization
        this.router.delete('/delete/:productId',auth(),productController.deleteProduct);  
    }
};
// Export an instance of the ProductRouter's router property
export default new ProductRouter().router;