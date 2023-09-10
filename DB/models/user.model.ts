// Importing necessary modules and dependencies
import { database } from './../connection';
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

// Defining the User model, extending the Sequelize Model class
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  public userName!: string;
  public email!: string;
  public password!: string;
}

// Initializing the User model with attribute definitions and validations
User.init(
  {
    userName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isString(value: string) {
          if (typeof value !== 'string') {
            throw new Error('userName must be a string');
          }
        },
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isString(value: string) {
          if (typeof value !== 'string') {
            throw new Error('Email must be a string');
          }
        },
        isRegexMatch(value: string) {
          const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!regexPattern.test(value)) {
            throw new Error('Invalid email format');
          }
        },
      },
    },
    password:{
        type:DataTypes.TEXT,
        allowNull:false,
      },
    
  },
  {
    sequelize: database.sequelize,
    modelName: 'User',
  }
);
// Exporting the User model
export { User };