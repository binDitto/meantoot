const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

// TITLE VALIDATIONS

let titleLengthChecker = (title) => {
    if (!title) { return false; }
    if (title.length < 5 || title.length > 50) {
        return false;
    } else {
        return true;
    }
};

let alphaNumericTitleChecker = (title) => {
    if (!title) { return false; }
    // can include a-z lowercase or A-Z uppercase, numbers and spaces
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    console.log('Valid title Regex: ' + regExp.test(title));
    return regExp.test(title);
};

const titleValidators = [
    {
        validator: titleLengthChecker,
        message: 'title must be at least 5 characters long but no more than 50'
    },
    {
        validator: alphaNumericTitleChecker,
        message: 'Title must be alphanumeric'
    }
];

// BODY VALIDATIONS

let bodyLengthChecker = (body) => {
    if (!body) { return false; }
    if (body.length < 5 || body.length > 500) {
        return false;
    } else {
        return true;
    }
};


const bodyValidators = [
    {
        validator: bodyLengthChecker,
        message: 'body must be at least 5 characters long and less than 500 characters in length'
    }
];

// COMMENT VALIDATIONS

let commentLengthChecker = (comment) => {
    if (!comment[0]) { return false; }
    if (comment[0].length < 1 || comment[0].length > 200) {
        return false;
    } else {
        return true;
    }
};

const commentValidators = [
    {
        validator: commentLengthChecker,
        message: 'Comment must not exceed 200 characters'
    }
];

// SCHEMA
const blogSchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    body: { type: String, required: true, validate: bodyValidators},
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    comments: [
        {
            comment: { type: String, validate: commentValidators },
            commentator: { type: String }
        }
    ]
});


// EXPORT SCHEMA FOR USAGE

module.exports = mongoose.model('Blog', blogSchema);
