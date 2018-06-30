  const express = require('express');
  const bodyParser = require('body-parser')
  const cors = require('cors');
  const bcrypt = require('bcrypt-nodejs');
  const path = require('path');
  const mkdirp = require('mkdirp');
  const multer = require('multer');
  const random = require('random-string'); 
  const CheckingKeyForgotPassword = require('./controllers/CheckingKeyForgotPassword');
  const Login = require('./controllers/Login');
  const SignUp = require('./controllers/SignUp');
  const SearchDoctor = require('./controllers/SearchDoctor');
  const PatientAppointment = require('./controllers/PatientAppointment');
  const ForgotPassword = require('./controllers/ForgotPassword');
  const UploadingProfilePic = require('./controllers/UploadingProfilePic');
  const Logout = require('./controllers/Logout');
  const ConfirmingAppointment = require('./controllers/ConfirmingAppointment');
  const ConfirmingSignUp = require('./controllers/ConfirmingSignup');
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const db = require('knex')({
      client: 'mysql',
      connection: {
        host : 'localhost',
        user : 'root',
        password : 'Rama@1234',
        database : 'test'
      }
    });
  const  searchdata = {
    location:[],
    fee:[],
    speciality:[]
  }
  db.select('*').from('location').then(data => searchdata.location = data);
  db.select('*').from('feerange').then(data => searchdata.fee = data);
  db.select('*').from('speciality').then(data => searchdata.speciality = data);
  const storageimageuserp = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/patients/'+req.params.id);
    },
    filename: (req, file, cb) => {
      const newFilename =`${'PatientsPic'}${path.extname(file.originalname)}`;
      cb(null, newFilename);
    },
  });
  let upload = multer({storage: storageimageuserp,
      fileFilter: (req,file,callback) =>{
          const ext = path.extname(file.originalname);
          if(ext !== '.jpg'){
          return callback(new Error('Only Jpg images csn be uploaded'))
      }
      callback(null,true);
      }
  });
  app.post('/checkkey',(req,res) => {CheckingKeyForgotPassword.handleCheckKeyForgotPassword(req,res,db.brcypt)});     
  app.get('/searchdata',(req,res) => {res.json(searchdata)})              
  app.post('/login',(req,res) => { Login.handleLogin(req,res,db,bcrypt)});      
  app.post('/signup',(req,res) => { SignUp.handleSignUp(req,res,db,bcrypt) });    
  app.post('/searchdoctor',(req,res) => { SearchDoctor.handleSearchDoctor(req,res,db)});
  app.post('/bookingappointment',(req,res) => {  PatientAppointment.handlePatientAppointment(req,res,db,bcrypt)});
  app.get('/forgotpassword/resetingrequest/:email(*)',(req,res) => {ForgotPassword.handleForgotPassword(req,res,db)});
  app.post('/uploading/:id/:hash(*)',upload.single("selectedFile"),(req, res) => {UploadingProfilePic.handleProfilePic(req,res,db)});
  app.get('/signout/:id/:hash(*)',(req,res) => { Logout.handleLogout(req,res,db) })
  app.get('/image/:type/:id',(req,res)=> {res.sendFile(__dirname+'/images/'+req.params.type+'/'+req.params.id)})
  app.get('/appointmentbooking/:idofuser/:hash(*)',(req,res) => {ConfirmingAppointment.handleConfirmAppointment(req,res,db)});
  app.get('/:Id/:hash(*)',(req,res) => {ConfirmingSignUp.handleConfirmSignUp(req,res,db,mkdirp)});
  app.listen(3000,() => {
    console.log('App is Running On Port 3000')
  });    
