const handleLogout = (req,res,db) => {
    const { id } = req.params;
    db('users').where({userid: id}).update({isloggedin: 'false'}).
    then(data => res.json({Response: 'Logged Out'}));    
}
module.exports = {
    handleLogout : handleLogout
}