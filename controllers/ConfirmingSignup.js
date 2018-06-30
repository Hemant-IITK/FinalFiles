const handleConfirmSignUp = (req,res,db,mkdirp) => {
    const {Id,hash} = req.params;
    db.select('*').from('pending').where({id: Id}).then(data => {
        if(data.length > 0 && data[0].password === hash){
          db('users').insert({
            uname : data[0].name,
            uemail : data[0].email,
            uphone : data[0].mobile.toString(),
            ugender: data[0].gender,
            udob : data[0].dob,
            upassword : data[0].password
          }).then(response => {
            mkdirp('./uploads/patients/'+response[0].toString(),(err) => {
              if(err !== null ){
                res.json({response: 'Something Wrong'})
              }
            })
            db('pending').where('id',Id).del().then(r => res.send('Verification Completed')); 
          });
        } else {
        	res.send('Something Wrong');
        }
    })
}
module.exports = {
    handleConfirmSignUp: handleConfirmSignUp
}