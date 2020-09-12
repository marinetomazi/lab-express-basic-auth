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
    const {email, password} = req.body

    //Validation
    if (!email || !password) {
        res.render('auth/login', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return; // STOP
    }

    User.findOne({username: email})
    .then(user => {
        if (!user) {
          res.render('auth/login', {errorMessage: ' Incorrect email/password'})
          return; // STOP
        }
  
        // comparer le password fourni avec le password (hashé) en base
        if (bcryptjs.compareSync(password, user.passwordHash)) {
            req.session.user = user
          res.redirect('/profil')
        } else {
          res.render('auth/login', {errorMessage: ' Incorrect email/password'})
        }
      })
    .catch(err => next(err))
})

router.get('/profil', (req, res, next) =>{
    if(!req.session.user){
        res.redirect('/login')
    }
    res.render('users/userProfil',{user: req.session.user})
}
)

router.get('/main', (req, res, next) => {

    if (!req.session.user) {
      res.redirect('/login'); // can't access the page, so go and log in
      return;
    }
  
    // ok, req.user is defined
    res.render('users/main', { user: req.session.user });
  });

  router.get('/private', (req, res, next) => {

    if (!req.session.user) {
      res.redirect('/login'); // can't access the page, so go and log in
      return;
    }
  
    // ok, req.user is defined
    res.render('users/private', { user: req.session.user });
  });

module.exports = router;