const { Project } = require('../models')
const { User } = require('../models')
const { Profile } = require('../models')
const moment = require('moment')
const path = require('path')
const fs = require('fs').promises 


const detail = async (req, res) => {
    const { id } = req.params 
    const userID = req.session.idUser
    if (userID) {
        const profile = await Profile.findOne({
            where: { user_id: userID }
        })
        let profileID
        let profileName
        let bool
        if (profile) {
            profileID = profile.user_id
            profileName = profile.first_name
            bool =  profileID === userID
        }
      
        const dataProject = await Project.findOne({
          where: { user_id: userID },
          include: User,
          include: Profile,
        })
        console.log(dataProject.Profile)
        let icons = []
        if ('laravel' === dataProject.laravel) {
          icons.push({name:dataProject.laravel, icon: `fa-laravel`})
        }
        if ('python' === dataProject.python) {
          icons.push({name:dataProject.python, icon: `fa-python`})
        }
        if ('sass' === dataProject.sass) {
          icons.push({name:dataProject.sass, icon: `fa-sass`})
        }
        if ('php' === dataProject.php) {
          icons.push({name:dataProject.php, icon: `fa-php`})
        }
      
        const formattedStartDate = moment(dataProject.startdate).format('DD MMMM YYYY')
        const formattedEndDate = moment(dataProject.enddate).format('DD MMMM YYYY')
        res.render('detailProject', {
          dataProject,
          icons,
          formattedStartDate, 
          formattedEndDate, 
          title: dataProject.name,
          user: req.session.user, 
          successLogin: req.session.loginPOST,
        })
    }else{
        const dataProject = await Project.findOne({
          where: { id: id } ,
          include: User,
          include: Profile,
        })
      
        let icons = []
        if ('laravel' === dataProject.laravel) {
          icons.push({name:dataProject.laravel, icon: `fa-laravel`})
        }
        if ('python' === dataProject.python) {
          icons.push({name:dataProject.python, icon: `fa-python`})
        }
        if ('sass' === dataProject.sass) {
          icons.push({name:dataProject.sass, icon: `fa-sass`})
        }
        if ('php' === dataProject.php) {
          icons.push({name:dataProject.php, icon: `fa-php`})
        }
      
        const formattedStartDate = moment(dataProject.startdate).format('DD MMMM YYYY')
        const formattedEndDate = moment(dataProject.enddate).format('DD MMMM YYYY')
        res.render('detailProject', {
          dataProject,
          icons,
          formattedStartDate, 
          formattedEndDate, 
          title: dataProject.name,
          user: req.session.user, 
          successLogin: req.session.loginPOST,
        })
    }
}

const addProject = (req, res) => {
    if (req.session.loginPOST) {
        res.render('addProject', {
          'title' : "Add Project",
          user: req.session.user, 
          successLogin: req.session.loginPOST,
        })
    }else{
        res.redirect('/')
    }
}

const postProject = async (req, res) => {
    const { name, description, sass, laravel, php, python, startdate, enddate } = req.body
    const image = req.file.filename
    const userID = req.session.idUser
    const starDateV = new Date(startdate)
    const endDateV = new Date(enddate)
    const duration = endDateV - starDateV
    const rangeDuration =  duration / (1000 * 60 * 60 * 24)

    let vRangeDuration
    let textDate
    if (rangeDuration > 29) { 
      vRangeDuration = Math.floor(rangeDuration / 30) 
      textDate = "month"
    }else{
      vRangeDuration = rangeDuration
      textDate = "day"
    }
    
    let formattedStartDate 
    if (moment(startdate, 'YYYY-MM-DD', true).isValid()) {
      formattedStartDate = moment(startdate).format('YYYY-MM-DD')
    } 
    let formattedEndDate 
    if (moment(enddate, 'YYYY-MM-DD', true).isValid()) {
      formattedEndDate = moment(enddate).format('YYYY-MM-DD')
    }
    
    try {
      await Project.create({ 
          name,
          startdate: formattedStartDate,
          enddate: formattedEndDate,
          duration: `${vRangeDuration} ${textDate}`,
          description,
          sass,
          laravel,
          python,
          php,
          image: image,
          user_id: userID,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        res.redirect('/')
    } catch (error) {
        console.error('data failed save to the database:', error)
    }
}

const editProjects = async (req, res) => {
    if (req.session.loginPOST) {
        const { id } = req.params
        const project = await Project.findOne({ where: { id: id } })
        const { startdate, enddate, laravel, sass, php, python } = project
    
        const checkedlaravel = laravel === 'laravel' ? 'checked' : ''
        const checkedsass = sass === 'sass' ? 'checked' : ''
        const checkedpython = python === 'python' ? 'checked' : ''
        const checkedphp = php === 'php' ? 'checked' : ''
    
        const formattedStartDate = moment(startdate).format('YYYY-MM-DD')
        const formattedEndDate = moment(enddate).format('YYYY-MM-DD')
    
        res.render('editProject', {
          dataProject: project, 
          checkedlaravel, 
          checkedpython, 
          checkedphp, 
          checkedsass, 
          formattedStartDate, 
          formattedEndDate, 
          title: project.name,
          user: req.session.user, 
          successLogin: req.session.loginPOST,
        })
    }else{
        res.redirect('/')
    }
}

const updateProject = async (req, res) => {
    const { id } = req.params
    try {
        const project = await Project.findOne({ where: { id: id } })
        if (project) {
        const {name, description, startdate, enddate, sass, laravel, php, python } = req.body
        if (req.file) {
            image = req.file.filename
            if (project.image) {
            const imageDirectory = path.join('public/assets/image', project.image)
                try {
                    await fs.unlink(imageDirectory)
                } catch (error) {
                    console.error(`Error delete image file: ${error.message}`)
                }
            }
        } else {
            image = project.image 
        }
        
        const newImageFilePath = path.join('public/assets/image', image)
        console.log(`File baru ${newImageFilePath} akan disimpan`)
        

        const starDateV = new Date(startdate)
        const endDateV = new Date(enddate)
        const duration = endDateV - starDateV
        const rangeDuration = duration / (1000 * 60 * 60 * 24)
        let vRangeDuration
        let textDate
        
        if (rangeDuration > 29) { 
            vRangeDuration = Math.floor(rangeDuration / 30)
            textDate = "month"
        } else {
            vRangeDuration = rangeDuration
            textDate = "day"
        }
        
        await project.update({
            name,
            description,
            startdate,
            enddate,
            duration: `${vRangeDuration} ${textDate}`,
            laravel: laravel === 'laravel' ? 'laravel' : null,
            sass: sass === 'sass' ? 'sass' : null,
            php: php === 'php' ? 'php' : null,
            python: python === 'python' ? 'python' : null,
            image: image
            }, { where: {id: id}})
            res.redirect('/')
        } else {
            console.error('Data not found')
        }
    } catch (error) {
        console.error('Data failed update to the database:', error)
    }
}

const deleteProject = async (req, res) => {
    if (req.session.loginPOST) {
        const { id } = req.params
        const project = await Project.findOne({ where: { id: id } })
        try{
            if (project) {
                if (project.image) {
                const imageDirectory = path.join('public/assets/image', project.image)
                try {
                    await fs.unlink(imageDirectory)
                } catch (error) {
                    console.error(`Error deleting image file: ${error.message}`);
                }
                }
                await Project.destroy({
                where: {id: id}
                })
                console.log("data success delete to the database:")
            }else{
                console.log("data failed delete to the database:")
            }
        }catch{
          console.error('data failed delete to the database:', error)
        }
        res.redirect('/')
    }else{
        res.redirect('/')
    }
}

module.exports = { detail, addProject, postProject, editProjects, updateProject, deleteProject }