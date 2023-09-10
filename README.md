# KortobaaTask

Node.js CRUD App with MySQL
This is a Node.js application that uses TypeScript and OOP concepts to create a CRUD (Create, Read, Update, Delete) app that interacts with a MySQL database. The app has two tables: users and products. Each user can only add, edit, or delete their own products.

# Getting Started
Clone the repository and install the dependencies:
git clone https://https://github.com/Ahmed-M-AbuHajjar/KortobaaTask.git
cd KortobaaTask
npm install


2. Update the database configurations in `DB/connection.ts`:
   this.sequelize = new Sequelize('database name','database user' , 'database password', {
      host: 'localhost',
      dialect: 'mysql'
    });
  }

3. Start the app:

npm run dev

The app will be available at http://localhost:8080.

# Features
Create, read, update, and delete users and products.
Each user can only add, edit, or delete their own products.
Uses TypeScript and OOP concepts.
Integrated with MySQL database.
