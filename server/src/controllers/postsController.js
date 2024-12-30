const Post = require('../models/postModel.js');

module.exports = { getAllPosts, getPostById, addPost, updatePostById, deletePostById }

// GET /posts - Fetch all blog posts.
async function getAllPosts(req, res, next){
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

// POST /posts - Create a new blog post.
async function addPost(req, res, next) {
    try {
        const { post } = req.body;
        const newPost = new Post({
            title: post.title,
            content: post.content
        });
        const result = await newPost.save();
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// GET /posts/:id - Fetch a single blog post by ID.
async function getPostById(req, res, next){
    try {
        const { id } = req.params;
        const posts = await Post.findOne({_id:id});
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

// PUT /posts/:id - Update a blog post by ID.
async function updatePostById(req, res, next) {
    try {
        const { id } = req.params;
        const { title, content } = req.body
        const result = await Post.findByIdAndUpdate(id, {
            title,
            content
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// DELETE /posts/:id - Delete a blog post by ID.
async function deletePostById(req, res, next) {
    try {
        const { id } = req.params;
        const result = await Post.findByIdAndDelete(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}