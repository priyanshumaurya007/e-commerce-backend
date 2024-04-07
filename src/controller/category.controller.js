// categoryController.js

const db = require('../db');
const User = require('../models/User');

// Controller function to retrieve categories in a paginated form
const getCategories = async (req, res) => {
    try {
        // Pagination parameters (page number and limit)
        const page = req.query.page || 1;
        const limit = 6;
        const offset = (page - 1) * limit;

        // Query to retrieve categories with pagination
        const query = 'SELECT * FROM categories LIMIT $1 OFFSET $2';
        const values = [limit, offset];
        const { rows } = await db.query(query, values);

        // Return categories
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Controller function to save selected categories for a particular user
const saveUserCategories = async (req, res) => {
    try {
        let { categories } = req.body;

        // Validate user ID and categories
        if (!categories) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Update user's categories in the database
        const useremail = req.user;
        categories = JSON.stringify(categories);
        await User.updateUserCategories(useremail, categories);

        // Return success message
        res.json({ message: 'User categories updated successfully' });
    } catch (error) {
        console.error('Error saving user categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const fetchUserSelectedCategories = async (req, res) => {
    try {
        const useremail = req.user;
        const user = await User.findByEmail(useremail);
        res.status(200).json({message: user});
    } catch (error) {
        console.error('Error fetching user selected categories:', error);
        throw new Error('Failed to fetch user selected categories');
    }
};

module.exports = {
    getCategories,
    saveUserCategories,
    fetchUserSelectedCategories
};
