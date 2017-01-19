

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const  app = express();
const firebase = require("firebase");

var config = {
            apiKey: "AIzaSyBQ2swuVnEBW4PHKGNXYKLs6ussitWlDTk",
            authDomain: "trackdoc-ad797.firebaseapp.com",
            databaseURL: "https://trackdoc-ad797.firebaseio.com",
            storageBucket: "trackdoc-ad797.appspot.com",
            messagingSenderId: "178755390087"
          };
firebase.initializeApp(config);

//route setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(bodyParser.urlencoded({ extended: true })); 

// session setup
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
// must use cookieParser before expressSession
app.use(cookieParser());

app.use(expressSession({secret:'smilesh2o24Andela'}));


//reponse to get from root url
app.get('/', (req, res) => {
   if( req.session.uid) {
      res.sendFile(__dirname + '/views/index.html');
    
    } else{
      res.redirect('/login');
    }
 })

app.get('/login',function(req,res){
   res.sendFile(__dirname + '/views/login.html');
});


app.post('/login',function(req,res){
  var email=req.body.email;
  var password=req.body.password;
  var errorCode;
  var errorMessage;
  var userid;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    userid = firebase.auth().currentUser.uid;
    req.session.uid = userid;
     if(req.session.uid){
      console.log(userid);
    
     res.redirect('/');
  } else {
    console.log("fail");
     res.redirect('/login');
  }

  }).catch(function(error) {
    // Handle Errors here.
     errorCode = error.code;
     errorMessage = error.message;
     console.log('errorCode = ' + errorCode + ', errorMessage= ' + errorMessage);
     res.redirect('/login');
    // ...
  });
 
});

app.get('/logout',function(req,res){

  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    res.redirect('/login');
  }).catch(function(error) {
    console.error('Sign Out Error', error);
  })


});

app.get('/share', (req, res) => {

    if( req.session.uid) {
      res.sendFile(__dirname + '/views/share.html');
    
    } else{
      res.redirect('/login');
    }
 })

// response to post from url = /quotes
app.post('/share', (req, res) => {

      var uploadUrl = req.body.docurl,
        keywords = req.body.keywords,
        title = req.body.title,
        dept = '',
        deptStart=0;

      // get the department

      if ( req.body.key1) { 
        if(deptStart == 0) { dept = req.body.key1.toString();}
        else {  dept += ',' + req.body.key1.toString();}
        deptStart++;
      }
      if ( req.body.key2) { 
        if(deptStart == 0) { dept = req.body.key2.toString();}
        else {  dept += ',' + req.body.key2.toString();}
        deptStart++;
      }
      if ( req.body.key3) { 
        if(deptStart == 0) { dept = req.body.key3.toString();}
        else {  dept += ',' + req.body.key3.toString();}
        deptStart++;
      }
      if ( req.body.key4) { 
        if(deptStart == 0) { dept = req.body.key4.toString();}
        else {  dept += ',' + req.body.key4.toString();}
        deptStart++;
      }
      if ( req.body.key5) { 
        if(deptStart == 0) { dept = req.body.key5.toString();}
        else {  dept += ',' + req.body.key5.toString();}
        deptStart++;
      }
      if ( req.body.key6) { 
        if(deptStart == 0) { dept = req.body.key6.toString();}
        else {  dept += ',' + req.body.key6.toString();}
        deptStart++;
      }
      if ( req.body.key7) { 
        if(deptStart == 0) { dept = req.body.key7.toString();}
        else {  dept += ',' + req.body.key7.toString();}
        deptStart++;
      }

       //check if no dept was selected

       if( dept == '') {
         // document.getElementById('result').innerHTML = 'you must select at least one department';
       } else {

        //push share
        var date = new Date(),
          uid = req.session.uid,
          dateObj = new Date(),
          month = dateObj.getUTCMonth() + 1,
          day = dateObj.getUTCDate(),
          year = dateObj.getUTCFullYear(),
          newdate = year + "/" + month + "/" + day;
          //firebase database
          shareRef = firebase.database().ref('trackdoc/shared'),
          newshare = {
            "dateReg" : newdate,
              "departments" : dept,
              "sharedBy" : uid,
              "tags" : keywords,
              "title" : title,
              "url" : uploadUrl
          };
        console.log(newshare);
        shareRef.push(newshare).then(function(user) {
          res.redirect('/');
        }). catch(function(error) {
          res.redirect('/share');
         });

      }
       //console.log("test");
       //res.redirect('/login');

  })


app.listen(3000, function() {
  console.log('listening on 3000')
});
  
