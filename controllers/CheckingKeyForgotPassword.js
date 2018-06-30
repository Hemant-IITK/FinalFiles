const handleCheckKeyForgotPassword = (req,res,db,bcrypt) => {
    db('forgotpassword').where({uemail: req.body.email}).then(data => {
        if(data[0].randomstring === req.body.key && req.body.choosedpassword === req.body.confirmpassword){
          bcrypt.hash(req.body.choosedpassword,null,null,(err,hashGenerated) => {
            db('users').where({uemail : req.body.email}).update({upassword: hashGenerated}).then(data => {
              db('forgotpassword').where({uemail: req.body.email}).del()
              .then(data => {
                res.json({Response : 'Password Changed'})
              })
            })
          })      
        } else {
          res.json({Response: "Key didnt matched"})
        }
      })
}
module.exports = {
    handleCheckKeyForgotPassword : handleCheckKeyForgotPassword
}