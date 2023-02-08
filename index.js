var express = require('express');
var app = express();
var multer = require('multer');
const cors = require('cors')

const path = require('path');


app.use('/public/uploads/images', express.static('/public/uploads/images'))

app.use(cors({origin:'http://localhost:4200'}))


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/meanDB',{  
     useNewUrlParser: true, 
     useUnifiedTopology: true,
    }).then(function(){
        console.log("DB Connection Successful")
    }).catch(function(err){
        console.log(err)
    })

var Login = require('./models/details.js');
const { request } = require('express');


app.set('view engine', 'pug');
app.set('views', './views')

const storage = multer.diskStorage({
    // destination for files
    destination: function(req, file, callback){
        callback(null, './public/uploads/images')
    },
    filename: function(req, file, callback){
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
// upload parameter for multer


const upload = multer({
    storage: storage,
    limits:{
        fieldSize: 1024 * 1024 * 3,
    }
});


app.get('/', function(req, res){
    res.render('login')
    // return res.json({
    //     "statusCode": 200,
    //     "statusMessage": "Sucess"
        
    // })
})

app.get('/api/login', function(req, res) {
    // use mongoose to get all students in the database
       Login.find(function(err, login) {
          // if there is an error retrieving, send the error.
          // nothing after res.send(err) will execute
          if (err)
             res.send(err);
             res.json(login); // return all students in JSON format
       });
    // Login.find()  
    // .then((documents)=>{  
    //   console.log(documents);  
    //     res.status(200).json({  
    //         message: 'Posts Fetched Successfully',  
    //         login: documents  
    //     });  
    // }); 

});

app.post('/login',upload.array('image', 12), function(req, res){

    const files = req.files
    
     console.log(req.files)
    var login = new Login({
        heading: req.body.heading,
        para: req.body.para,
        image: files.path
    });
    
    login.save(function(err, Login){
        if(err)
            res.render('show_message', {message: "Database error" + err, type: "error"});
        else
            res.render('show_message', {
            message: "Uploads File Successfully", type: "success", login:Login});
    });
    res.send(login);
   
})

app.listen(8080, function(){
    console.log("Server started at port: 8080")
})