const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use('/assets', express.static('public/assets'))

app.get('/', home)
app.get('/detail/:linkTitle', detail)
app.get('/addProject', addProjects)


data =  [
          {
            'id' : 1,
            'title' : "Kursus Digital Marketing - 2024",
            'linkTitle' : 'kursus-digital-Marketing',
            'startDate' : '12 Jan 2024',
            'endDate' : '15 Mar 2024',
            'tech1' : 'Laravel',
            'icon1' : 'fa-brands fa-laravel',
            'tech2' : 'Sass',
            'icon2' : 'fa-brands fa-sass',
            'duration' : "1 bulan",
            'image' : "https://sasanadigilab.com/wp-content/uploads/2022/08/Screen-Shot-2022-08-09-at-17.09.12-large.jpg",
            'content' : "Donec vulputate volutpat nunc ac accumsan. Phasellus eleifend odio eu enim luctus porttitor. Quisque eget sem a",
          },
          {
            'id' : 2,
            'title' : "Python - 2024",
            'linkTitle' : 'Python',
            'startDate' : '15 Feb 2024',
            'endDate' : '10 Mar 2024',
            'tech1' : 'Python',
            'icon1' : 'fa-brands fa-python',
            'tech2' : 'Python',
            'icon2' : 'fa-brands fa-python',
            'tech3' : 'Python',
            'icon3' : 'fa-brands fa-python',
            'tech4' : 'Python',
            'icon4' : 'fa-brands fa-python',
            'duration' : "4 bulan",
            'image' : "https://i.pinimg.com/originals/d2/69/43/d26943a4e6a8d3dfbb1f95cf0cedf282.jpg",
            'content' : "Donec vulputate volutpat nunc ac accumsan. Phasellus eleifend odio eu enim luctus porttitor. Quisque eget sem a",
          },
          {
            'id' : 3,
            'title' : "Sass - 2024",
            'linkTitle' : 'Sass',
            'startDate' : '23 Aug 2024',
            'endDate' : '03 Oct 2024',
            'tech1' : 'Sass',
            'icon1' : 'fa-brands fa-sass',
            'tech2' : 'Sass',
            'icon2' : 'fa-brands fa-sass',
            'tech3' : 'Sass',
            'icon3' : 'fa-brands fa-sass',
            'tech4' : 'Sass',
            'icon4' : 'fa-brands fa-sass',
            'duration' : "5 bulan",
            'image' : "https://images7.alphacoders.com/133/1337527.png",
            'content' : "Donec vulputate volutpat nunc ac accumsan. Phasellus eleifend odio eu enim luctus porttitor. Quisque eget sem a",
          }
        ]

        
function home(req, res) {
  res.render('index', {data})
}

function detail(req, res) {
  const { linkTitle } = req.params
  const project = data.find(val => val.linkTitle == linkTitle)
  res.render('detailProject', {project})
}

function addProjects(req, res) {
    res.render('addProject')
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})