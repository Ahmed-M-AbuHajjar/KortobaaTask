import { database } from './DB/connection';
import express, { Express } from 'express';
import * as indexRouter from './modules/index.routers'
import { User } from './DB/models/user.model';
import { Product } from './DB/models/product.model';



// Create database tables
database.createTable()
// Define the association between User and Product models
User.hasMany(Product,{
  foreignKey:'userId',
  onDelete:'CASCADE',
  onUpdate:'CASCADE'
});
Product.belongsTo(User,{foreignKey: 'userId'});
// Create an instance of the Express application
const app:Express = express();
// Parse JSON request bodies
app.use(express.json());

const baseURL:string = '/api/v1'
// Mount the user and product routers at their respective base URLs
app.use(`${baseURL}/user`,indexRouter.UserRouter)
app.use(`${baseURL}/product`,indexRouter.productRouter)
// Start the server
const port:number = 8080
app.listen(port, ()=> {
    console.log(`server is running on http://localhost:${port}`);
})

