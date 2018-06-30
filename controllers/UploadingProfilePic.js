const handleProfilePic = (req,res,db) => {
    const {id, hash} = req.params;
    db.select('*').from('users').where({userid: id}).then(data => {
      if(data[0].isloggedin === 'true'&& data[0].upassword===hash){ 
       res.json({Response: "File Uploaded"})
      } else{
        res.json({Response: "Cannot Upload"})
      }
    })
}
module.exports = {
    handleProfilePic: handleProfilePic
}