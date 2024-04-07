const User = require('../models/User')
const auth = require('../middleware/auth.middleware');
const UserDTO = require('../requestPayload/user-request.payload');
const JWT_SECRET = "my_secret";
const jwt = require('jsonwebtoken');

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

        const newUser = await User.register(userRequestPayload?.name, userRequestPayload?.useremail, userRequestPayload?.password);

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

        if (user.password !== password ) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const authToken = jwt.sign({ useremail }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({authToken});

    } catch (error) {
        console.log('Error logging user: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};  

module.exports = { registerUser, loginUser };