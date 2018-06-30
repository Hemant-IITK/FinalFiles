const nodemailer = require ('nodemailer');
let mailOptionsToInformDoctor = {
    from : 'jhooteid@gmail.com',
    to: '',
    subject: 'New Patient Booked Appointment',
    body: '',
    html: ''
  }
  let transporterToInformDoctor = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jhooteid@gmail.com',
      pass: 'gmailk@pass'
    }
  })
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1;
  let yyyy = today.getFullYear();
  
  if(dd<10) {
      dd = '0'+dd
  } 
  
  if(mm<10) {
      mm = '0'+mm
  } 
  
  today = mm + '/' + dd + '/' + yyyy;
const handleConfirmAppointment = (req,res,db) => {
    const {idofuser, hash} = req.params;
    db.select('*').from('pendingbookingsofdoctors').where({uid: idofuser}).then(data => {
        if(data.length > 0) {
            if(hash === data[0].hash){
                db.select('*').from('doctor_info').where({doc_id: data[0].doctornumber}).then(data2 => {
                    console.log(data2[0].email)
                    mailOptionsToInformDoctor.to = data2[0].email;
                    mailOptionsToInformDoctor.html = "<p>Patient InFo </p>" + 
                        "<p>Name : " + data[0].uname + "</p>" +
                        "<p>Email : " + data[0].uemail + "</p>" + 
                        "<p>Phone : " + data[0].uphone + "</p>" +
                        "<p>Gender : " + data[0].gender + "</p>" +
                        "<p>Address : " + data[0].uaddress + "</p>" +
                        "<p>Date of Arrival : " + today + "</p>" + 
                        "<p> TOKEN : " + today + "__"+ data[0].uid + "</p>" ;
                    transporterToInformDoctor.sendMail(mailOptionsToInformDoctor,(err,info)=>{
                    if(err){
                    console.log(err)
                    } else{
                    console.log(info)
                    }
                    })
                })

                console.log(data[0].uemail,'bjhcbha')   
                mailOptionsToInformDoctor.to = data[0].uemail;     
                mailOptionsToInformDoctor.html = "<p>Token :" + data[0].uid + "</p>"+
                                                 "<p> Visiting Date : " + today + "</p>"    
                transporterToInformDoctor.sendMail(mailOptionsToInformDoctor,(err,info) => {
                    if(err){
                        console.log(err)
                    } else {
                        console.log(info)
                    }
                })  
                db('pendingbookingsofdoctors').where({hash: hash}).del().then(data => 
                    res.json(" Your appointment is booked check your Email"))                 
                } else {
                res.json("404 Not Found")
                }
        } else {
            res.status(404).send("not found");
        }
        
    })
}
module.exports = {
    handleConfirmAppointment : handleConfirmAppointment
}