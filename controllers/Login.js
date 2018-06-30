const handleLogin = (req,res,db,bcrypt) => {
    db.select('*').from('users').where({uemail:req.body.email}).then(data => {
        if(data.length > 0 ){
          bcrypt.compare(req.body.password, data[0].upassword, function(err, Res) {
            if(Res === true ){
              db('users').where({userid: data[0].userid}).update({isloggedin: 'true'}).then(response => {  
                  res.json({Response: true,UserData:data[0]});
              });
              
            } else {
              res.json({Response: false})
            }
        });
        } else{
          res.json({Response: false})
        }
    
      })
}
module.exports = {
    handleLogin : handleLogin
}