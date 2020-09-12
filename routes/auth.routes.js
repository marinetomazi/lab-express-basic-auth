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

module.exports = router;