const cool = require('cool-ascii-faces'); 
//use path module
var path = require('path');
//use express module
var express = require('express');
//use ejs view engine
var session = require('express-session');

const port = process.env.PORT || 5000

var ejs = require('ejs');
//use bodyParser middleware
var bodyParser = require('body-parser');
//use mysql database
var mysql = require('mysql');

var app = express();

const fs = require('fs');



 
//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(session({
  secret: "sosecret",
  saveUninitialized: false,
  resave: false
}));

// middleware to make 'user' available to all templates
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {  
    res.render('home',{
    });
  });
 
app.get('/json-read',(req, res) => {  
    
    let rawdata = fs.readFileSync('./json_files/new-json.json');
    let file_data = JSON.parse(rawdata); 
   res.send(file_data);

  });

app.post('/json-write',(req, res) => {  
  
  var shop_data = {};
  var shop_name = req.body.shop_name;
  var cust_id   = req.body.cust_id;
  var pro_id    = req.body.pro_id;
  shop_data[shop_name]   = [ {"cust_id": cust_id},{ "pro_id": pro_id}] ;

  var rawdata = fs.readFileSync('./json_files/new-json.json');	
  console.log("hello");

  // res.send(rawdata);
		 if(rawdata !=''){
           var file_data = JSON.parse(rawdata); 
		   file_data = JSON.stringify(file_data);
		  }
		  else
		  {
		  	file_data = shop_data;
		  }
 // res.send(req.body);
 // 
	// let data = JSON.stringify(shop_data);
	fs.writeFileSync('./json_files/new-json.json', file_data );
    res.send(shop_data);
  // let data = JSON.stringify(student);
  // fs.writeFileSync('student-2.json', data);

  });

app.listen(port, () => console.log(`Listening on ${ port }`));