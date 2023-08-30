const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.postRegister = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const blogs = req.body.blogs;

        if (!username || !password || !email) {
            res.status(400).send({
                success: false,
                message: "Please enter the details of all the user"
            })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send({
                success: 'false',
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ username, password: hashedPassword, email, blogs });
        await user.save();
        return res.status(201).send({
            success: true,
            message: "Successfully registered"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error, message: "Error in registering the user"
        })

    }
}

exports.postLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please enter the details of all the user"
            })
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).send({
                success: false,
                message: 'Please register first'
            })
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Please enter correct email/password'
            })

        }
        const id = existingUser._id;
        const token = await jwt.sign({ id }, process.env.SECRET_KEY);



        return res.status(200).send({
            success: true,
            user: existingUser,
            message: "Successfully Logged In", token
        })



    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error, message: "Error in logging the user"
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).send(
                {
                    success: false,
                    message: 'No such user found'
                }
            )
        }

        return res.status(200).send({
            message: "User found",
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error, message: "Error in fetching the user"
        })
    }
}