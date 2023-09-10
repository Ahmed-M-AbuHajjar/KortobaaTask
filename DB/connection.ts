// Importing Sequelize
import { Sequelize } from 'sequelize';
// Setting the Database class
class Database {
  // Making sequelize as public to be used in models
  public sequelize: Sequelize;
  constructor() {
    // Database configurations
    // Creating a new instance of Sequelize for database connection
    this.sequelize = new Sequelize('test kortobaa','root' , '', {
      host: 'localhost',
      dialect: 'mysql'
    });
  }
  public async createTable(): Promise<void> {
    // Syncing sequelize models with database
    return this.sequelize.sync({ alter: true })
      .then(() => {
        console.log('Connection success');
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
}
// Creating an instance of Database class and exporting it to be used in app / models
export const database = new Database();
