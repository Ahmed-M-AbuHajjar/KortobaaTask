import { Request, Response } from 'express';
import { Product } from '../../../DB/models/product.model';
import path from 'path';
import fs from 'fs';

// Define a custom interface by extending the Request interface to include a user property
interface CustomRequest extends Request {
    user?: any;
}


class ProductController{
    public addProduct = async (req:CustomRequest, res:Response): Promise<void> => {
       try {
        // Check if a file is uploaded
        if(!req.file){
       
            res.status(400).json({message:'ERROR: Please upload image!'});
        } else {
            // Extract the title and price from the request body
            const {title,price} = req.body;
            // Get the image path of the uploaded file
            const imagePath = path.join(req.file.filename);
            // Create a new product in the database with the provided details
            const newProduct = await Product.create({title,image:imagePath,price,userId:req.user.id});
            res.status(201).json({message:'Product added successfully!',newProduct});
          
        }
       } catch (error:any) {
        // Handle any errors that occurred during the product creation process
        res.status(400).json({message:'ERROR',error: error.message});
       }
    };
    public updateProduct = async (req:CustomRequest, res:Response): Promise<void> => {
        try {
            // Extract the title and price from the request body
            const{title,price} = req.body;
            // Extract the productId from the request parameters
            const{productId} = req.params;
            
            // Find the product in the database based on the productId    
            const product:Product | null = await Product.findByPk(productId);
            
                
                if(product){
                    // Check if the product belongs to the authenticated user
                        if(product.userId == req.user.id){
                            if(req.file){
                                // Delete the old image file
                                const oldImagePath = path.join('uploads', product.image);
                                fs.unlinkSync(oldImagePath);
                                // Get the new image path of the uploaded file
                                const imagePath = path.join(req.file.filename);
                                // Update the product with the new details and image path
                                const updatedProduct = await product.update({title,image:imagePath,price});
                                   res.status(200).json({message:'Product Updated Successfully',updatedProduct});
                            } else {
                               // Update the product with the new details, excluding the image
                               const updatedProduct = await product.update({title,price});
                               res.status(200).json({message:'Product Updated Successfully',updatedProduct});
                            }
                               
                        } else {
                            // Send an error response if the user is not authorized to update the product
                            res.status(401).json({message:'ERROR: User not Authorized!'});
                        }
                } else {
                    // Send an error response if the product is not found in the database
                    res.status(404).json({message:'ERROR: Product not Found!'});
                }
            
        } catch (error:any) {
            // Handle any errors that occurred during the product update process
            res.status(400).json({message:'ERROR',error:error.message});
        }
    };

    public deleteProduct = async (req:CustomRequest, res:Response): Promise<void> => {
        try {
            // Extract the productId from the request parameters
            const {productId} = req.params;
            // Find the product in the database based on the productId
            const product = await Product.findByPk(productId);
            if(product){
                // Check if the product belongs to the authenticated user
                if(product.userId == req.user.id){
                    // Delete the image file associated with the product
                    const imagePath = path.join('uploads', product.image);
                    fs.unlinkSync(imagePath);
                    // Delete the product from the database
                    await product.destroy();
                    res.status(200).json({message:'Product Deleted Successfully'});
                } else {
                    // Send an error response if the user is not authorized to delete the product
                    res.status(401).json({message:'ERROR: User not Authorized!'});
                }
            } else {
                // Send an error response if the product is not found in the database
                res.status(404).json({message:'ERROR: Product not Found!'});
            }

        } catch (error:any) {
            // Handle any errors that occurred during the product deletion process
            res.status(400).json({message:'ERROR',error:error.message});
        }
    };
};
// Export ProductController to extract it's functions in product router
export default new ProductController;