const express = require('express');
const router = express.Router();
const { getAllPosts, addPost, getPostById, updatePostById, deletePostById } = require("../controllers/postsController.js");
// GET /posts - Fetch all blog posts.
router.get('/', getAllPosts);

// POST /posts - Create a new blog post.
router.post('/', addPost);

// GET /posts/:id - Fetch a single blog post by ID.
router.get('/:id', getPostById);

// PUT /posts/:id - Update a blog post by ID.
router.put('/:id', updatePostById);

// DELETE /posts/:id - Delete a blog post by ID.
router.delete('/:id', deletePostById);

module.exports = router;