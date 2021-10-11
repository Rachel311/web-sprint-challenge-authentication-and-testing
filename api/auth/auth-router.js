const router = require('express').Router();
const User = require('./auth-model');
const bcrypt = require('bcryptjs');
const buildToken = require('./token-builder');
const { checkUsernameExists, checkBodyValidation, validateUserExist } = require('./middleware')


  router.post('/register', checkUsernameExists, checkBodyValidation, (req, res, next) => {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)

    User.add({username, password:hash})
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(next)
});

// router.post("/register",  (req, res) => {
//   // implement registration
//   let userData = req.body;
//   const hash = bcrypt.hashSync(userData.password, 8);
//   userData.password = hash;
//   User.add(userData)
//     .then((user) => {
//       const token = buildToken(user);
//       res.status(201).json({
//         message: `Thanks for registering, ${userData.username}!`,
//         user,
//         token: token,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ Error: "failed to retrieve database", err });
//     });
// });

router.post('/login', checkBodyValidation, validateUserExist, (req, res, next) => {
  if(bcrypt.compareSync(req.body.password, req.user.password)){
    const token = buildToken(req.user)
    res.json({
      message: `${req.user.username} is back!`,
      token,
    })
  } else {
    next({
      status: 401,
      message: 'Invalid credentials!'
    })
  }
  
});

module.exports = router;
