const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "parool", // add your password
    database: "testWad",
    host: "localhost",
    port: "5432"
});

const execute = async (query) => {
    try {
        await pool.connect(); // create a connection
        await pool.query(query); // executes a query
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

// Create "users" table
const createUsersTblQuery = `
    CREATE TABLE IF NOT EXISTS "users" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(200) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL 
    );`;

// Create "posts" table
const createPostsTblQuery = `
    CREATE TABLE IF NOT EXISTS "posts" (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id uuid REFERENCES "users"(id) ON DELETE CASCADE
    );`;

// Create tables asynchronously
(async () => {
    try {
        const createUsersResult = await execute(createUsersTblQuery);
        if (createUsersResult) {
            console.log('Table "users" is created');
        }

        const createPostsResult = await execute(createPostsTblQuery);
        if (createPostsResult) {
            console.log('Table "posts" is created');
        }
    } catch (error) {
        console.error('Error during table creation:', error);
    }
})();

module.exports = pool;