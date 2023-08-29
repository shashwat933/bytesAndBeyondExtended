const Blog = require('../model/blog');
const User = require('../model/user');
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('user');

        if (!blogs) {
            return res.status(200).send({
                success: false,
                message: 'No blogs found'
            })
        }

        return res.status(200).send({
            success: true,
            count: blogs.length,
            message: 'Blogs list',
            blogs
        })



    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting blogs",
            error
        })
    }
}

exports.getBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const blog =await Blog.findById(id);
        if (!blog) {
            return res.status(404).send({
                success: false,
                message: 'Blogs not found with this id'
            })
        }
        if (blog) {
            return res.status(200).send({
                success: true,
                message: "Blog found successfully",
                blog
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(404).send({
            success: false,
            message: "Error in getting blog"
        })
    }
}

exports.getUserBlogs = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).populate('blogs');
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "No such user found"
            })
        }
        if (user) {
            return res.status(200).send({
                success: true,
                message: "User blogs fetched successfully",
                userBlog: user
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(404).send({
            success: false,
            message: "Error in getting user blogs"
        })
    }

}

exports.createBlog = async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const image = req.body.image;
        const user = req.body.user;
        console.log(req.body);
        if (!title || !description || !image || !user) {
             
            return res.status(400).send({
                message: "Please fill all the details correctly",
                success: false
            })
        }

        const existingUser =await User.findById(user);
        if (!existingUser) {
            return res.status(404).send({
                message: "User not found",
                success: false
            })
        }
        const blog = new Blog({title, description, image, user});
        //check for this also
        // const blog=new Blog(req.body)

        await blog.save();
         existingUser.blogs.push(blog);
        await existingUser.save();
        return res.status(201).send({
            message: "Blog Created",
            success: true
        })


    } catch (error) {
        console.log(error);
        return res.status(404).send({
            success: false,
            message: "Error in creating blog"
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;

        const blog = await Blog.findByIdAndRemove(id).populate('user')
        await blog?.user?.blogs.pull(blog);
        await blog?.user?.save();
        return res.status(200).send({
            success: true,
            message: "Blog deleted",

        })
        

    } catch (error) {
        console.log(error);
        return res.status(404).send({
            success: false,
            message: "Error in deleting blog"
        })
    }

}


exports.updateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).send({
            success: true,
            message: "Blog updated",
            blog
        })

    } catch (error) {
        console.log(error);
        return res.status(404).send({
            success: false,
            message: "Error in updating blog"
        })
    }
}