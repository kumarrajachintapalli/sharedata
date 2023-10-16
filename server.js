const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key1.json");
initializeApp({
  credential: cert(serviceAccount)
});
var express = require('express');
const app = express();
const fetch = require('node-fetch');
const bodyParser =require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
const db = getFirestore();
var express = require('express');
const { render } = require('ejs');
app.use(express.static('public'));
var passwordHash = require('password-hash');
app.get('/', function (req, res) {  
res.sendFile( __dirname + "/public/" + "signuppage.html" );
})  
app.get('/loginpage', function (req, res) {  
    res.sendFile( __dirname + "/public/" + "loginpage.html" );
    })  
 
app.get('/signuppage', function (req, res) {  
    res.sendFile( __dirname + "/public/" + "signuppage.html" );
    })
app.post('/signupsubmit', function (req, res) {  
  console.log(req.body);
  db.collection('UserData')
  .where("reg_number","==",req.body.reg_number)
  .get()
  .then((docs) => {
    if(docs.size>0){
      res.send("<h1>oops!... account already exists with this email</h1><br><br><br><h2>Please login</h2><br><h2>Or Try Again With Another Email</h2>");
    }
    else{
   db.collection('UserData').add({
     full_name:req.body.full_name,
     reg_number:req.body.reg_number,
     mobile:req.body.mobile,
     year:req.body.year,
     colege_mail:req.body.college_mail,
     password:passwordHash.generate(req.body.password)
 }).then(() =>{
  res.sendFile( __dirname + "/public/" + "loginpage.html" );
 })
}
})
 })
  app.post('/loginsubmit', function (req, res) {  
  console.log(req.body.reg_number);
  db.collection('UserData')
  .where("reg_number","==",req.body.reg_number)
  .get()
  .then((docs) => {
    var verified = false;
    docs.forEach((doc) => {
      verified = passwordHash.verify(req.body.password, doc.data().password)
    });
      console.log(docs.size)
      if(verified){
        res.sendFile(__dirname + "/public/" + "CSBS.html");
      }
      else{
        res.send("<h1>please signup first or Password was wrong</h1>");
      }
    })
  })
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})