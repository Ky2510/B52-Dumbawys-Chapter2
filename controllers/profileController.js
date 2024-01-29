const moment = require('moment')
const { Profile } = require('../models')

const profile = async (req, res) => {
    if (req.session.loginPOST) {
        try {
            const userID = req.session.idUser
            if (userID) {
                const profile = await Profile.findOne({
                    where: { user_id: userID }
                })
                let profileID
                let profileFirstName
                let profileSecondName
                let profilePlaceBirthName
                let profileDateBirthName
                let profilePhoneNumber
                let profileAddress
                let profileDescription
                let profileRole
                let bool
                if (profile) {
                    profileID = profile.user_id
                    profileFirstName = profile.first_name
                    profileSecondName = profile.second_name
                    profilePlaceBirthName = profile.place_birth
                    profileDateBirthName = moment(profile.date_birth).format('DD MMMM YYYY')
                    profilePhoneNumber = profile.phone_number
                    profileAddress = profile.address
                    profileDescription = profile.description
                    profileRole = profile.role
                    bool =  profileID === userID
                }
                const descriptionBool = profileDescription === null
                const roleBool = profileRole === null
                res.render('profile', { 
                  title: "Profile",
                  user: req.session.user,
                  profileActive: bool, 
                  profileFirstName,
                  profileSecondName,
                  profilePlaceBirthName,
                  profileDateBirthName,
                  profilePhoneNumber,
                  profileAddress,
                  profileDescription,
                  descriptionBool,
                  profileRole,
                  roleBool,
                  successLogin: req.session.loginPOST,
                  userID : userID
                })
            }else{
              res.render('index', { 
                title: "Profile",
                user: req.session.user,
                successLogin: req.session.loginPOST 
              })
            }
        } catch (error) {
          console.error('Unable to connect to the database:', error)
        }
    }else{
    res.redirect('/')
    }
}

const postProfile = async (req, res) => {
    const { first_name, second_name, place_birth, date_birth, phone_number, address } = req.body
    const userID = req.session.idUser

    let formattedDateBirth 
    if (moment(date_birth, 'YYYY-MM-DD', true).isValid()) {
      formattedDateBirth = moment(date_birth).format('YYYY-MM-DD')
    }
    try {
      await Profile.create({
        first_name,
        second_name,
        place_birth,
        date_birth: formattedDateBirth,
        phone_number,
        address,
        user_id: userID
      })
      res.redirect('/profile')
    } catch (error) {
      console.error('data failed save to the database:', error)
    }
}

const addDescriptionProfile = async (req, res) => {
    const { description } = req.body
    const userID = req.session.idUser
    try {
        if (userID) {
        const profile = await Profile.findOne({
            where: { user_id: userID }
        })
        await profile.update({
            description
        })
        res.redirect('/profile')
        }else{
        res.render('index', { 
            title: "Profile",
            user: req.session.user,
            successLogin: req.session.loginPOST 
        })
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

const addRoleProfile = async (req, res) => {
    const { role } = req.body
    const userID = req.session.idUser
    try {
      if (userID) {
        const profile = await Profile.findOne({
          where: { user_id: userID }
        })
        await profile.update({
          role,
        })
        res.redirect('/profile')
      }else{
        res.render('index', { 
          title: "Profile",
          user: req.session.user,
          successLogin: req.session.loginPOST 
        })
      }
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
}

module.exports = { profile, postProfile, addDescriptionProfile, addRoleProfile }