const db = require('../db');
const User = require('../models/User');

const getCategories = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 6;
        const offset = (page - 1) * limit;

        const query = 'SELECT * FROM categories LIMIT $1 OFFSET $2';
        const values = [limit, offset];
        const { rows } = await db.query(query, values);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const saveUserCategories = async (req, res) => {
    try {
        let { categories } = req.body;

        if (!categories) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        const useremail = req.user;
        categories = JSON.stringify(categories);
        await User.updateUserCategories(useremail, categories);

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
