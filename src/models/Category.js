const db = require('../db');

class Category {
  static async getAll() {
    try {
      const query = 'SELECT * FROM categories';
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category;