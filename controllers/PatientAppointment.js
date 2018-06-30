const nodemailer = require ('nodemailer');
let mailOptionsForConformingBooking = {
    from:'jhooteid@gmail.com',
    to:'',
    subject:'Confirm Your Booking',
    body: '',
    html: ''
  }
  let transporterForConformingBooking = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:'jhooteid@gmail.com',
          pass:'gmailk@pass'
        }
      })

const handlePatientAppointment = (req,res,db,bcrypt)=> {
    bcrypt.hash(req.body.phone,null,null,(err,hash) => {
        db('pendingbookingsofdoctors').insert({
          uname: req.body.name,
          ugender: req.body.gender,
          uemail: req.body.email,
          uphone: (req.body.phone).toString(),
          uaddress: req.body.address,
          doctornumber: req.body.doctorInfo.doctornumber,
          doctoremail: req.body.doctorInfo.Email,
          hash: hash
          }).then(idGenerated => {
           let tempForBooking = 'http://localhost:3000/appointmentbooking/'+idGenerated+'/'+hash;
           mailOptionsForConformingBooking.html = "<a href = '"+tempForBooking+"'>Click here to confirm booking</a>";
           mailOptionsForConformingBooking.to = req.body.email;
           transporterForConformingBooking.sendMail(mailOptionsForConformingBooking,(err,info) => {
             if(err){
               console.log(err);
             } else {
               console.log(info);
             }
          }
         )
       })
     })
    res.json('ok');
}
module.exports = {
    handlePatientAppointment: handlePatientAppointment
}