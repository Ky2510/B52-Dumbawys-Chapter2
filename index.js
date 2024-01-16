const express = require('express')
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


data =  []
        
function home(req, res) {
  res.render('index', {data, title:"Home"})
}

function detail(req, res) {
  const { id } = req.params
  const dataProject = data[id]
  res.render('detailProject', {dataProject, title: dataProject.name})
}

function addProjects(req, res) {
    res.render('addProject', {
      'title' : "Add Project"
    })
}

// Menambahkan Data
function postProject(req, res) {
    const newId = data.length + 0

    const starDate = req.body.stardate
    const endDate = req.body.enddate
    const starDateV = new Date(starDate)
    const endDateV = new Date(endDate)

    const duration = endDateV - starDateV
    const rangeDuration = duration / (1000 * 60 * 60 * 24)
    // Month & Day
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
    const { name, stardate, enddate, description, php, laravel, sass, python } = req.body
    data.push({id: newId, name, stardate, enddate, description, php, laravel, sass, python, vRangeDuration, textDate, imageDefault})
    res.redirect('/')
}


function editProjects(req, res) {
  const { id } = req.params
  const dataProject = data[id]

  
  const python = dataProject.python
  const php = dataProject.php
  const laravel = dataProject.laravel 
  const sass = dataProject.sass

  let checkedpython
  let checkedphp
  let checkedsass
  let checkedlaravel
  if (python === "python") {
    checkedpython = `checked`
  }
  if (php === "php") {
    checkedphp = `checked`
  }
  if (sass === "sass") {
    checkedsass = `checked`
  }
  if (laravel === "laravel") {
    checkedlaravel = `checked`
  }
  res.render('editProject', {dataProject, checkedpython, checkedphp, checkedsass, checkedlaravel, title: dataProject.name})
}


function updateProject(req, res) {
  const { id } = req.params
  const newName = req.body.name
  const newStarDate = req.body.stardate
  const newEndDate = req.body.enddate
  const newDescription = req.body.description
  const newLaravel = req.body.laravel
  const newPython = req.body.python
  const newSass = req.body.sass
  const newPhp = req.body.php
  const newStarDateV = new Date(newStarDate)
  const newEndDateV = new Date(newEndDate)
  const duration = newEndDateV - newStarDateV
  const newRangeDuration = duration / (1000 * 60 * 60 * 24)

  // Month & Day
  let newVRangeDuration
  let newTextDate
  if (newRangeDuration > 29) { 
      newVRangeDuration = Math.floor(newRangeDuration / 30) 
      newTextDate = "month"
  }else{
      newVRangeDuration = newRangeDuration
      newTextDate = "day"
  }

  const index = parseInt(id)
  // definisi variable yang mengandung logika dan mendefinisikan inputan baru
  data[index] = {
      id : index,
      name : newName,
      stardate: newStarDate,
      enddate: newEndDate,
      description: newDescription,
      vRangeDuration: newVRangeDuration,
      textDate: newTextDate,
      laravel: newLaravel,
      php: newPhp,
      sass: newSass,
      python: newPython,
  }
  const imageDefault = "/assets/image/foto.jpg"
  // besar = 0 dan kecil dari banyak data
  if (index >= 0 && index < data.length) {
    // splice itu menghapus atau mengubah object
    data.splice(index, 1, {
        id: index,
        name: newName,
        imageDefault: imageDefault,
        vRangeDuration: newVRangeDuration,
        textDate : newTextDate,
        stardate : newStarDate,
        enddate : newEndDate,
        description: newDescription,
        laravel: newLaravel,
        php: newPhp,
        sass: newSass,
        python: newPython,
    });

    res.redirect('/');
  } else {
      res.send('data tidak ditemukan')
  }
}

function deleteProject(req, res) {
  const { id } = req.params
  const index = parseInt(id)
  // besar = 0 dan kecil dari banyak data
  if (index >= 0  && index < data.length) {
    // splice itu menghapus atau mengubah object
    data.splice(index, 1) // 1 : total object yang akan dihapus dari array dimulai dari index
    res.redirect('/')
  }else{
    res.send('data tidak ditemukan')
  }
}

function contact(req, res) {
    res.render('contact', {
      title : "Contact"
    })
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedDate = new Date(dateString).toLocaleDateString('id-ID', options);
  return formattedDate;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

