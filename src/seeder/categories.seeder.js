const { faker } = require('@faker-js/faker');
const db = require('../db');


const generateDummyCategories = () => {
    const categories = [];
    for (let i = 0; i < 100; i++) {
        const category = {
            name: faker.commerce.department()
        };
        categories.push(category);
    }
    return categories;
};

const checkCategoriesExist = async () => {
    try {
        const query = 'SELECT COUNT(*) FROM categories';
        const { rows } = await db.query(query);
        return parseInt(rows[0].count) >= 100;
    } catch (error) {
        throw error;
    }
};

const insertCategories = async (categories) => {
    try {
        for(const category of categories) {
            const query = 'INSERT INTO categories (name) VALUES ($1)';
            const value = [category?.name];
            await db.query(query, value);
        }
        console.log('Categories inserted successfully');
    } catch (error) {
        throw error;
    }
};

const initializeCategories = async () => {
    try {
        const categoriesExist = await checkCategoriesExist();
        if (!categoriesExist) {
            const dummyCategories = generateDummyCategories();
            await insertCategories(dummyCategories);
        } else {
            console.log('Categories already exist in the database');
        }
    } catch (error) {
        console.error('Error generating or inserting categories:', error);
    } 
};

module.exports = initializeCategories;
