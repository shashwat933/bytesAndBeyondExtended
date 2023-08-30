const express = require('express');
const blogController = require('../controller/blogController')

const router = express.Router();

//getting all the blogs
router.get('/all-blog', blogController.getBlogs);

//getting a blog on the basis of id of the blog
router.get('/get-blog/:id', blogController.getBlog);

//getting blogs for a particular user
router.get('/user-blog/:id', blogController.getUserBlogs)

//creating a blog
router.post('/create-blog', blogController.createBlog)

//deleting a blog
router.delete('/delete-blog/:id', blogController.deleteBlog);

//updating a blog
router.put('/update-blog/:id', blogController.updateBlog);














module.exports = router;