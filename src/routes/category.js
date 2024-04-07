const express = require('express');
const router = express.Router();
const db = require('../db');
const { getCategories, saveUserCategories, fetchUserSelectedCategories } = require('../controller/category.controller');
const { verifyAuthToken } = require('../middleware/auth.middleware');


router.get('', verifyAuthToken, getCategories);

router.get('/user/selected', verifyAuthToken, fetchUserSelectedCategories)

router.post('', verifyAuthToken, saveUserCategories);

module.exports = router;