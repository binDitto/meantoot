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

    return router;
}