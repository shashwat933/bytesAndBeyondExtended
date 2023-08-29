const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt=require('jsonwebtoken')
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// //user middleware
app.use('/user', userRoutes);

//blog routes
app.use('/blog',tokenVerifier, blogRoutes);

//root url
app.get('/', (req, res) => {
    return res.status(200).send({
        message: "Running successfully"
    })
})


//connecting the database 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database");

    } catch (error) {
        console.log(error);
        console.log("MONGO connection error");
    }
}
connectDB();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
})




function tokenVerifier(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, valid) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Please add valid token with the request"
                })

            }
            else {
                next();
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: "Please add token with the request"
        })
    }



   
}