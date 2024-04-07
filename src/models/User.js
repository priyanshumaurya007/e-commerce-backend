const db = require('../db');

class User {
    constructor(name, useremail, password) {
        this.name = name;
        this.useremail = useremail;
        this.password = password;
    }

    static async register(name, useremail, password) {
        try {
            const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
            const values = [ name, useremail, password]
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async login(useremail, password) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
            const values = [useremail, password];
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail( useremail ) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const values = [useremail];
            const { rows } = await db.query(query, values);

            if(rows.length < 1) {
            return "User not found";
            }

            return rows[0];
        } catch (error) {
            throw error;
        }
        }

    static async updateUserCategories(useremail, categories) {
        try {
            const query = 'UPDATE users SET categories = $1 WHERE email = $2 RETURNING *';
            const values = [categories, useremail];
            const { rows } = await db.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async hashPassword() {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            throw new Error('Error hashing password');
        }
    }

    async comparePassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw new Error('Error comparing passwords');
        }
    }
}

module.exports = User;