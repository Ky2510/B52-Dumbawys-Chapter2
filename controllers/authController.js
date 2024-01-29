const bcrypt = require('bcrypt')
const { User } = require('../models')

const register = (req, res) => {
    if (req.session.loginPOST === true) {
        res.redirect('/')
    } else {
    res.render('register', { title: 'Register' })
    }
}
        
const registerPOST = async (req, res) => {
    const { email, name, password } = req.body
    const salt = 10
    try {
        bcrypt.hash(password, salt, async function(err, hashPass) {
        await User.create({
            name,
            email,
            password: hashPass,
            createdAt: new Date(),
            updatedAt: new Date()
            })
        })
        res.redirect('/login')
    } catch (error) {
        console.error('data failed save to the database:', error)
    }
}

const login = async (req, res) => {
    if (req.session.loginPOST === true) {
        res.redirect('/')
    }else{
        res.render('login', { title: 'Login' })
    }
}

const loginPOST = async (req, res) => {
    const { email, password} = req.body
    const emailCheck = await User.findOne({ where: {email: email } })
  
    if (!emailCheck) {
        req.flash('error', `${email} is not registered`)
        return res.redirect('/login')
    }
  
    const passwordInDatabase = emailCheck.dataValues.password
  
    bcrypt.compare(password, passwordInDatabase, function(err, result){
      if (result) {
            // Jika login berhasil, set session loginPOST ke true
            req.session.loginPOST = true
            req.session.user = emailCheck.dataValues.name
            req.session.idUser = emailCheck.id
            req.flash('success', 'Welcome to my App');
            res.redirect('/')
      } else {
          req.flash('error', 'Invalid password')
          res.redirect('/login')
      }
    })
}

const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}

module.exports = { register, loginPOST, registerPOST, login, logout }
