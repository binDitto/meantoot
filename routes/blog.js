const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Blog = require('../models/blog');

module.exports = (router) => {

// NEW BLOG
    router.post('/newblog', (req, res) => {
        // res.send('test');
        if (!req.body.title) {
            return res.json({ success: false, message: 'Blog title is required.'});
        }
        if (!req.body.body) {
            return res.json({ success: false, message: 'Blog body is required.'});
        }
        if (!req.body.createdBy) {
            return res.json({ success: false, message: 'Blog creator is required.'})
        }
        // ALL FIELDS FILLED
        const blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.body.createdBy
        });
        blog.save((err, blog) => {
            if (err) {
                if (err.errors) {
                    if (err.errors.title) {
                        return res.json({ success: false, message: err.errors.title.message });
                    } else if (err.errors.body) {
                        return res.json({ success: false, message: err.errors.body.message });
                    } else {
                        return res.json({ success: false, message: err.msg });
                    }
                } else {
                    return res.json({ success: false, message: err });
                }
            }
            return res.json({ success: true, message: 'Blog saved!', data: blog});
        });
    });

// GET BLOGS
    router.get('/allBlogs', (req,res)=> {
        Blog.find({}, (err, blogs) => {
            if (err) {
                return res.json({success: false, message: 'Error retrieving blogs', err});
            }
            if (!blogs) {
                return res.json({ success: false, message: 'No blogs found.'});
            }

            return res.json({ success: true, message: 'Blogs retrieved', blogs: blogs });
        }).sort({'_id': -1}); // sort in descending order, so newest ones first -1
    });

// GET BLOG
    router.get('/singleBlog/:id', (req, res) => {
        if ( !req.params.id ) {
            return res.json({ success: false, message: 'No Blog Id was provided'});
        }
        // res.send('test');
        Blog.findOne({ _id: req.params.id }, (err, blog) => {
            if (err) {
                return res.json({ success: false, message: 'Error', error: err });
            }
            if (!blog) {
                return res.json({ success: false, message: 'Blog not found.'});
            }
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
                return res.json({ success: false, message: err});
            }
            if (!user) {
                return res.json({ success: false, message: 'unable to authenticate user'});
            }
            if (user.username !== blog.createdBy) {
                return res.json({ success: false, message: 'You are not authorized to edit this blog.'});
            }
            return res.json({ success: true, blog: blog});
        });
        });
    });

// PUT BLOG (Update)
    router.put('/updateBlog', (req, res) => {
        // res.send('test');
        if (!req.body._id) {
            return res.json({ success: false, message: 'No blog id provided'});
        }
        Blog.findOne({ _id: req.body._id }, (err, blog) => {
            if (err) {
                return res.json({success: false, message: 'Not a valid blog id'});
            }
            if (!blog) {
                return res.json({ success: false, message: 'Blog id was not found'});
            }
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                if ( err ) {
                    return res.json({ success: false, message: err });
                }
                if (!user) {
                    return res.json({ success: false, message: 'Unable to authenticate user.'});
                }
                if (user.username !== blog.createdBy) {
                    return res.json({ success: false, message: 'You are not authroized to edit this blog post.'});
                }
                blog.title = req.body.title;
                blog.body = req.body.body;
                blog.save((err, updatedBlog) => {
                    if (err) {
                        return res.json({ success: false, message: err });
                    }
                    if (!updatedBlog) {
                        return res.json({ success: false, message: 'Unable to update blog post'});
                    }
                    // The FINAL response we are looking for
                    return res.json({ success: true, message: 'Blog successfully updated', updatedBlog: updatedBlog});
                });
            });
        });
    });

    return router;
}