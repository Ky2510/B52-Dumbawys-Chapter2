const { register, loginPOST, registerPOST, login, logout } = require('../controllers/authController')
const { home } = require('../controllers/mainController')
const { profile, postProfile, addDescriptionProfile, addRoleProfile } = require('../controllers/profileController')
const { detail, addProject, postProject, editProjects, updateProject, deleteProject } = require('../controllers/projectController')
const uploadImage = require('../middlewares/uploadImage')

const router = require('express').Router()

router.get('/register', register)
router.post('/register', registerPOST)
router.post('/login', loginPOST)
router.get('/login', login)
router.get('/logout', logout)

router.get('/', home)

router.get('/detail/:id', detail)
router.get('/addProject', addProject)
router.post('/post-project', uploadImage.single('image'), postProject)
router.get('/edit-project/:id', editProjects)
router.post('/update-project/:id', uploadImage.single('image'), updateProject)
router.get('/delete-project/:id', deleteProject)

router.get('/profile', profile)
router.post('/post-profile', postProfile)
router.post('/add-description-profile/:id', addDescriptionProfile)
router.post('/add-role-profile/:id', addRoleProfile)


module.exports = router