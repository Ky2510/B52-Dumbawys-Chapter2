const express = require('express')
const moment = require('moment')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

const { Sequelize, where } = require('sequelize')

const { Project } = require('./models')
const { User } = require('./models')
const { Profile } = require('./models')

const app = express()
const port = 3000

app.set('view engine', 'hbs')

app.use('/assets', express.static('public/assets'))
app.use(express.urlencoded({extended:false})) //parse inputan dari html

app.use(session({
  secret: 'passwordMySession',
  cookie: { secure: false }
}))

app.use(flash())

// connect to database by sequelize
// const sequelize = new Sequelize('db_personalweb', 'postgres', 'Lavesfar123', {
//   host: 'localhost',
//   dialect:'postgres' 
// })

app.get('/', home)
app.get('/detail/:id', detail)
app.get('/addProject', addProjects)
app.post('/post-project', postProject)
app.get('/edit-project/:id', editProjects)
app.post('/update-project/:id', updateProject)
app.get('/delete-project/:id', deleteProject)
app.get('/profile', profile)
app.post('/post-profile', postProfile)
app.post('/add-description-profile/:id', addDescriptionProfile)
app.post('/add-role-profile/:id', addRoleProfile)
app.post('/post-profile', postProfile)
app.get('/contact', contact)
app.get('/register', register)
app.post('/register', registerPOST)
app.get('/login', login)
app.post('/login', loginPOST)
app.get('/logout', logout)


function register(req, res) {
  if (req.session.loginPOST === true) {
    res.redirect('/')
  }else{
    res.render('register', { title: 'Register' })
  }
}

async function registerPOST(req, res) {
    const { name, email, password } = req.body
    const salt = 10 // salt = mengaduk character sehingga tidak beraturan
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

function login(req, res) {
  if (req.session.loginPOST === true) {
    res.redirect('/')
  }else{
    res.render('login', { title: 'Login' })
  }
}

async function loginPOST(req, res) {
    const { email, password} = req.body
    // cek email jika sama maka ketemu
    const emailCheck = await User.findOne({ where: {email: email } })

    // cek email jika tidak ketemu
    if (!emailCheck) {
        req.flash('error', `${email} is not register`)
        return res.redirect('/login')
    }

    // memastikan email di req.body
    const passwordInDatabase = emailCheck.dataValues.password
    const nameInDatabase = emailCheck.dataValues.name

    bcrypt.compare(password, passwordInDatabase, function(err, result){
      if (result) {
            req.session.loginPOST = true
            req.session.user = nameInDatabase
            req.session.idUser = emailCheck.id
            req.flash('success', 'Welcome my App');
            res.redirect('/')
      } else {
          req.flash('error', 'Invalid password')
          res.redirect('/login')
      }
    })
} 

function logout(req, res) {
  // hapus session yang saling terhubung
  req.session.destroy()
  res.redirect('/login')
}


async function home(req, res) {
    try {
        // komentar dibawah menggunakan query sequelize (READ)
        // const [data] = await sequelize.query('SELECT * FROM "Projects"')
        // res.render('index', {data, title:"Home"})
  
        // ORM => Object-Relational Mapping 
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
            // const query = await SequelizePool.query(
            // ` SELECT 
            //     projects.id, name, startdate, enddate, duration, sass, python, laravel, php, description, image, projects."createdAt", users.id AS user_id 
            //   FROM 
            //     projects 
            //   LEFT JOIN 
            //     users 
            //   ON 
            //   projects.user_id = users.id ORDER BY projects.id DESC`, 
            //   { type: QueryTypes.SELECT })
            
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
              successLogin: req.session.loginPOST 
            })
        }else{
          const data = await Project.findAll({
            include: User, 
            include: Profile,
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

function addProjects(req, res) {
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

async function postProject(req, res) { 
    const { name, description, sass, laravel, php, python, startdate, enddate } = req.body
    
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
          image: "/assets/image/foto.jpg",
          user_id: userID,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        res.redirect('/')
        // komentar dibawah menggunakan query sequelize (CREATE)
        // const createProjectSql =  `INSERT INTO "Project"
        // (
        //   name, startdate, enddate, description, laravel, python, 
        //   php, sass, image, duration, "createdAt", "updatedAt"
        // )VALUES(
        //   ${name}, 
        //   ${starDate}, 
        //   ${endDate}, 
        //   ${description}, 
        //   ${imageDefault}, 
        //   ${laravelValue}, 
        //   ${pythonValue},
        //   ${phpValue},
        //   ${sassValue},
        //   ${imageDefault},
        //   ${vRangeDuration} ${textDate},
        //   NOW(),
        //   NOW(),
        // )`
        // console.log(createProjectSql)
    } catch (error) {
        console.error('data failed save to the database:', error)
    }
}

async function editProjects(req, res) {
  if (req.session.loginPOST) {
    const { id } = req.params
    // komentar dibawah menggunakan query sequelize (CREATE)
    // const project = await sequelize.query(`SELECT * FROM "Project" WHERE id = ${id}`)
    // console.log(project)
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

async function updateProject(req, res) {
  const { id } = req.params
  try {
    const project = await Project.findOne({ where: { id: id } })
    
    if (project) {
      const {name, description, startdate, enddate, sass, laravel, php, python } = req.body

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
        image:  "/assets/image/foto.jpg"
      }, { where: {id: id} })
      res.redirect('/')
        // komentar dibawah menggunakan query sequelize (UPDATE)
        // const projectSql = `
        // UPDATE "Project"
        // SET "id"=${id},
        //     "name"='${req.body.name}',
        //     "startdate"='${req.body.startdate}',
        //     "enddate"='${req.body.enddate}',
        //     "description"='${req.body.description}',
        //     "duration"='${vRangeDuration} ${textDate}',
        //     "laravel"='${laravel}',
        //     "sass"='${sass}',
        //     "php"='${php}',
        //     "python"='${python}',
        //     "image"='${req.body.image}',
        //     "createdAt"='${project.createdAt}',
        //     "updatedAt"='${new Date()}'
        // WHERE 
        //     "id"=${id}`
        // console.log(projectSql)
        // await sequelize.query(projectSql, { type: sequelize.QueryTypes.UPDATE })
        // res.redirect('/')
    } else {
      console.error('Data not found')
    }
  } catch (error) {
    console.error('Data failed update to the database:', error)
  }
}

async function deleteProject(req, res) {
  if (req.session.loginPOST) {
    
    const { id } = req.params
    const project = await Project.findOne({ where: { id: id } })
    
    try{
      // komentar dibawah menggunakan query sequelize (DELETE)
      // const projectSql = `DELETE FROM "Projects" WHERE "id"=${id}`
      if (project) {
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


async function detail(req, res) {
  const { id } = req.params //req params => mengambil data bedasarkan URL
  const dataProject = await Project.findOne({where: {id: id} })

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

function contact(req, res) {
    res.render('contact', {
      title : "Contact",
      user: req.session.user, 
      successLogin: req.session.loginPOST,
    })
}

async function profile(req, res) {
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

async function postProfile(req, res) {
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

async function addDescriptionProfile(req, res) {
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

async function addRoleProfile(req, res) {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

