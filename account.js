const router = require('express').Router()

router.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  db.select('*').from('users').where({ email })
    .then(user => {
      if (user[0].id) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
        console.log(user)
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

module.exports = Profile;