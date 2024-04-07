const User = require('../models/User')
const auth = require('../middleware/auth.middleware');
const UserDTO = require('../requestPayload/user-request.payload');
const JWT_SECRET = "my_secret";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async ( req, res ) => {
    try {
        const userRequestPayload = UserDTO.fromRequest(req);

        if (!userRequestPayload.isValid()) {
            return res.status(400).json({ message: 'Name, Useremail, and Password are required.' });
        }

        const existingUser = await User.findByEmail(userRequestPayload?.useremail);
        if (existingUser !== "User not found") {
            return res.status(400).json({ message: 'User email already exist' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userRequestPayload.password, saltRounds);
        const newUser = await User.register(userRequestPayload?.name, userRequestPayload?.useremail, hashedPassword);

        res.status(201).json({newUser});
        
    } catch (error) {
        console.log('Error registering user: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const loginUser = async ( req, res ) => {
    try {
        const { useremail, password } = req.body;

        if(!useremail || !password) {
            res.status(400).json({message: 'Please provide useremail and password'});
        }

        const user = await User.findByEmail(useremail);

        if(user === "User not found") {
            res.status(400).json({message: "User email doesn't exist"});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const authToken = jwt.sign({ useremail }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({authToken});

    } catch (error) {
        console.log('Error logging user: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};  

const userEmailVerication = async ( req, res ) => {
    try {
        const { otp } = req.body;

        if(!otp) {
            res.status(400).json({message: 'Please provide otp'});
        }

        if(otp === '12345')
            res.status(201).json({message: "Email verified"});
        else
            res.status(400).json({message: "Wrong otp send"});

    } catch (error) {
        console.log('Error logging user: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};  

module.exports = { registerUser, loginUser, userEmailVerication };