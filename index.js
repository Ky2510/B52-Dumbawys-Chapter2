const express = require('express')
const moment = require('moment')
const { Sequelize, where } = require('sequelize')
const { Project } = require('./models')

const app = express()
const port = 3000

app.set('view engine', 'hbs')

app.use('/assets', express.static('public/assets'))
app.use(express.urlencoded({extended:false})) //parse inputan dari html

app.get('/', home)
app.get('/detail/:id', detail)
app.get('/addProject', addProjects)
app.post('/post-project', postProject)
app.get('/edit-project/:id', editProjects)
app.post('/update-project/:id', updateProject)
app.get('/delete-project/:id', deleteProject)
app.get('/contact', contact)

// connect to database by sequelize
const sequelize = new Sequelize('db_personalweb', 'postgres', 'Lavesfar123', {
  host: 'localhost',
  dialect:'postgres' 
})

        
async function home(req, res) {
  // debug connect 
  try {
      // komentar dibawah menggunakan query sequelize (READ)
      // const [data] = await sequelize.query('SELECT * FROM "Projects"')
      // res.render('index', {data, title:"Home"})

      // ORM => Object-Relational Mapping 
      const data = await Project.findAll()
      res.render('index', { data, title: "Home" });
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

function detail(req, res) {
    const { id } = req.params //req params => mengambil data bedasarkan URL
    const dataProject = data[id]
    res.render('detailProject', {dataProject, title: dataProject.name})
}

function addProjects(req, res) {
    res.render('addProject', {
      'title' : "Add Project"
    })
}

// Menambahkan Data
async function postProject(req, res) {
      // komentar dibawah menggunakan query sequelize (CREATE)
      // const createProjectSql =  ` INSERT INTO "Projects"
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
  
    const name = req.body.name
    const description = req.body.description

    const sass = req.body.sass
    const laravel = req.body.laravel
    const php = req.body.php
    const python = req.body.python
    
    const starDate = req.body.startdate
    const endDate = req.body.enddate
    const starDateV = new Date(starDate)
    const endDateV = new Date(endDate)
    const duration = endDateV - starDateV
    const rangeDuration = duration / (1000 * 60 * 60 * 24)
    let vRangeDuration
    let textDate
    if (rangeDuration > 29) { 
      vRangeDuration = Math.floor(rangeDuration / 30) 
      textDate = "month"
    }else{
      vRangeDuration = rangeDuration
      textDate = "day"
    }
      const imageDefault = "/assets/image/foto.jpg"
      const formatDateStart = req.body.startdate
      const formatDateEnd =  req.body.enddate
      let formattedStartDate 
      if (moment(formatDateStart, 'YYYY-MM-DD', true).isValid()) {
        formattedStartDate = moment(formatDateStart).format('YYYY-MM-DD')
      } else {
        console.error('Format tanggal awal tidak valid')
      }
      let formattedEndDate 
      if (moment(formatDateEnd, 'YYYY-MM-DD', true).isValid()) {
        formattedEndDate = moment(formatDateEnd).format('YYYY-MM-DD')
      } else {
        console.error('Format tanggal awal tidak valid')
      }
    try {

      await Project.create({ 
          name:  name,
          startdate: formattedStartDate,
          enddate: formattedEndDate,
          description: description,
          image: imageDefault,
          sass: sass,
          laravel: laravel,
          python: python,
          php: php,
          duration: `${vRangeDuration} ${textDate}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        res.redirect('/')
    } catch (error) {
        console.error('data failed save to the database:', error)
    }
}

async function editProjects(req, res) {
  const { id } = req.params
  const project = await Project.findOne({
    where: { id: id }
  })

  const dataProject = project
  const startDate = dataProject.startdate
  const endDate = dataProject.enddate
  
  const laravel = dataProject.laravel
  const sass = dataProject.sass
  const php = dataProject.php
  const python = dataProject.python

  let checkedlaravel
  let checkedpython
  let checkedsass
  let checkedphp
  if (laravel === 'laravel') {
    checkedlaravel = 'checked'
  }
  if (sass === 'sass') {
    checkedsass = 'checked'
  }
  if (python === 'python') {
    checkedpython = 'checked'
  }
  if (php === 'php') {
    checkedphp = 'checked'
  }
  
  const formattedStartDate = moment(startDate).format('YYYY-MM-DD')
  const formattedEndDate = moment(endDate).format('YYYY-MM-DD')

  res.render('editProject', {dataProject, checkedlaravel, checkedpython, checkedphp, checkedsass, formattedStartDate, formattedEndDate, title: dataProject.name})
}

async function updateProject(req, res) {
  const { id } = req.params;
  try {
    const project = await Project.findOne({
      where: { id: id }
    });

    if (project) {
      const starDateV = new Date(req.body.startdate);
      const endDateV = new Date(req.body.enddate);
      const duration = endDateV - starDateV;
      const rangeDuration = duration / (1000 * 60 * 60 * 24);
      let vRangeDuration;
      let textDate;
      
      if (rangeDuration > 29) { 
        vRangeDuration = Math.floor(rangeDuration / 30);
        textDate = "month";
      } else {
        vRangeDuration = rangeDuration;
        textDate = "day";
      }

      const sass = req.body.sass;
      const laravel = req.body.laravel;
      const php = req.body.php;
      const python = req.body.python;
      
      let checkedlaravel = null;
      let checkedpython = null;
      let checkedsass = null;
      let checkedphp = null;
      
      if (laravel === 'laravel') {
        checkedlaravel = 'laravel';
      }
      if (sass === 'sass') {
        checkedsass = 'sass';
      }
      if (python === 'python') {
        checkedpython = 'python';
      }
      if (php === 'php') {
        checkedphp = 'php';
      }
      
      await project.update({
        name: req.body.name,
        description: req.body.description,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        duration: `${vRangeDuration} ${textDate}`,
        laravel: checkedlaravel,
        sass: checkedsass,
        php: checkedphp,
        python: checkedpython,
        image: req.body.image
      }, {
        where: { id: id } 
      });

      res.redirect('/')
    } else {
      console.error('Project not found')
      // Handle error response or redirect to an error page
      res.redirect('/error')
    }
  } catch (error) {
    console.error('Data failed update to the database:', error)
    // Handle error response or redirect to an error page
  }
}


async function deleteProject(req, res) {
  const { id } = req.params
  const project = await Project.findOne({
    where: { id: id }
  })

  try{
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
}

function contact(req, res) {
    res.render('contact', {
      title : "Contact"
    })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

