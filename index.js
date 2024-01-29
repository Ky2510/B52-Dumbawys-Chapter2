const express = require('express')
const flash = require('express-flash')
const session = require('express-session')

const app = express()
const port = 3000

const router = require('./routes/index')

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: false }))
app.use('/assets', express.static('public/assets'))
app.use('/uploadImages', express.static('public/assets/image'))
app.use(session({
  secret: 'passwordMySession',
  cookie: { secure: false }
}))
app.use(flash())
app.use(router)

app.get('/contact', contact)

function contact(req, res) {
  res.render('contact', {
    title : "Contact",
    user: req.session.user, 
    successLogin: req.session.loginPOST,
  })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

