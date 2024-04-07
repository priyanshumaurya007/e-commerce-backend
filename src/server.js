const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db');
const path = require('path');
const initializeCategories = require('./seeder/categories.seeder')

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/user/signup', (req, res) => {
    res.render('register');
});
app.get('/user/login', (req, res) => {
    res.render('login');
});
app.get('/user/email/verification', (req, res) => {
    res.render('emailVerification');
})
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
