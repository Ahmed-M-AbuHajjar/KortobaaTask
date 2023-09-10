// Importing necessary modules and dependencies
import { database } from './../connection';
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { User } from './user.model';

// Defining the Product model, extending the Sequelize Model class
class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  public title!: string;
  public image!: string;
  public price!: number;
  public userId!:number;
}
// Initializing the Product model with attribute definitions and validations
Product.init(
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
        validate: {
          isNumeric: {
            msg: 'Price must be a number',
          },
      },
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
  },
  {
    sequelize: database.sequelize,
    modelName: 'Product',
  }
);
// Exporting the Product model
export { Product };