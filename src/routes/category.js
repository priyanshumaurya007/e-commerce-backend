const express = require('express');
const router = express.Router();
const db = require('../db');
const { getCategories, saveUserCategories } = require('../controller/category.controller');
const { verifyAuthToken } = require('../middleware/auth.middleware');


router.get('', verifyAuthToken, getCategories);

router.post('', verifyAuthToken, saveUserCategories);

module.exports = router;