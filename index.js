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


let pg = require('pg');
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
}

let connString = process.env.DATABASE_URL || 'postgres://ytamkroyffxgnt:dca99427b6da93b53823fee68f63566d4c4eff9a26662d4c9925c787b8744137@ec2-34-193-232-231.compute-1.amazonaws.com:5432/d3rsmfbojfac9k';
const { Pool } = require('pg');

const conn = new Pool({
  connectionString : connString
});
 
  // conn.query(
  // 'CREATE TABLE shop_data(id SERIAL PRIMARY KEY, shop_name VARCHAR(255) not null, customer_id VARCHAR(255), product_id VARCHAR(255) not null)');
 
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
     
    let sql = "SELECT * FROM new_quiz";
    let query = conn.query(sql, (err, results) => {
    	console.log(results);
     if (results.rows.length>0) 
        {
          res.render('home',{ shop_data : results });
        } 
     else {
          res.render('home',{ shop_data : err });
         }
   });
 });

app.post('/add-to-wish',(req, res) => {  
  
  var shop_name = req.body.shop_name;
  var cust_id   = req.body.cust_id;
  var pro_id    = req.body.pro_id;
  
   let data = {shop_name: req.body.shop_name, cust_id: req.body.cust_id, pro_id: req.body.pro_id};
    const  query = {
		        text: 'INSERT INTO shop_data(shop_name, customer_id, product_id ) VALUES($1, $2, $3)',
		        values: [data.shop_name, data.cust_id, data.pro_id ],
	         }
     conn.query(query, (err, results) => {
      if (err)
       {
        res.send(err);
       } 
      else {
           res.send(data);
         }
   });
});

app.listen(port, () => console.log(`Listening on ${ port }`));