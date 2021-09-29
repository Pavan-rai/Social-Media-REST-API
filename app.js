const { urlencoded } = require('body-parser');
const { render } = require('ejs');
const express = require('express');
const  mongoose  = require('mongoose');
const morgan = require('morgan');
const Blog = require('./models/blog');

const dbURI ='mongodb+srv://pavan:Pavan123@cluster0.qnuae.mongodb.net/node-tuts?retryWrites=true&w=majority';


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(result => app.listen(3000))
   .catch(err => console.log(err));

    const app = express();

// register view engine

app.set('view engine','ejs');

// listen for requests

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));



app.use((req,res ,next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ',req.path);
  console.log('method: ',req.method);
  next();
});

app.use((req,res,next) => {
   console.log('in the next middleware');
    next();
});

app.get('/',(req,res) =>{
  //  res.send('<p> home page</p>');
   res.redirect('/blogs');
} );

app.get('/about',(req,res) =>{
  //  res.send('<p>About Page</p>');
   res.render('about',{title: 'About'});
} );


app.get('/blogs',(req,res) => {
     Blog.find().sort({createdAt: -1})
     .then((result) => {
       res.render('index',{title:'All Blogs ', blogs: result})
     })
     .catch((err) => {
         console.log(err);
     })
});

app.post('/blogs',(req,res) => {
      const blog = new Blog(req.body);
      
      blog.save()
          .then((result) => {
              res.redirect('/blogs');
          })
          .catch((err) => {
             console.log(err);
          });
});

app.get('/blogs/:id', (req,res) => {
       const id = req.params.id;
       Blog.findById(id)
           .then(result => {
               res.render('details',{blog: result, title: 'Blog Details'});
           })
           .catch(err => {
               console.log(err);
           })
} );

app.get('/blogs/create',(req,res) =>{
   res.render('create',{title: 'Create a new Blog'});
});

app.use((req,res) => {
    res.status(404).sendFile('./views/404.html',{root: __dirname},{title: '404'});
});
