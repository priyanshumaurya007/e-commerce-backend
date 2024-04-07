const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db');
const initializeCategories = require('./seeder/categories.seeder')

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.send('Hello world');
})

const connectToDatabase = async () => {
    try {
        await db.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

const startServer = async () => {
    try {
        await initializeCategories();
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
