const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')

router.get('/signup', (req,res,next) => {
    res.render('auth/signup',{})
});

const salt = bcryptjs.genSaltSync(11)

router.post('/signup',(req,res,next)=> {
console.log('valeur',req.body);

const plainPassword = req.body.password;
const hashed = bcryptjs.hashSync(plainPassword,salt)
console.log("hashed =",hashed)

User.create({
    username: req.body.username,
    passwordHash:hashed 
    })
    .then(userFromDB =>{
        res.send('User créée')
    })
    .catch(err =>{
        next(err)})
})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    const {username, password} = req.body

    //Validation
    if (!email || !password) {
        res.render('auth/login', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return; // STOP
    }

    User.findOne({email: email})
    .then(user => {
        console.log(user);
    })
    .catch(err => next(err))
})

module.exports = router;