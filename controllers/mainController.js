const { Project } = require('../models')
const { User } = require('../models')
const { Profile } = require('../models')

const home = async (req, res) => {
    try {
        const userID = req.session.idUser
        if (userID) {
            const profile = await Profile.findOne({
                where: { user_id: userID }
            })
            let profileID
            let profileName
            let profileFirstName
            let profileRole
            let bool
            if (profile) {
                profileID = profile.user_id
                profileName = profile.first_name
                profileFirstName = profile.first_name
                profileRole = profile.role
                bool =  profileID === userID
            }
            const data = await Project.findAll({
              where: { user_id: userID },
              include: User,
              include: Profile,
            })

            res.render('index', { 
              data, 
              title: "Home",
              user: req.session.user,
              profileActive: bool, 
              profileName,
              profileRole,
              profileFirstName,
              successLogin: req.session.loginPOST 
            })
        }else{
          const userIds = []
          const data = await Project.findAll({
            include: [
              { model: User, include: Profile } 
            ]
          })

          res.render('index', { 
            data, 
            title: "Home",
            user: req.session.user,
            successLogin: req.session.loginPOST 
          })
        }
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
}

module.exports = { home }