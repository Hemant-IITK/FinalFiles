const handleSearchDoctor = (req,res,db) => {
    db.select('*').from('doctor_info').where({
        fee: parseInt(req.body.fee.fee_range),
        location: req.body.location.location,
        speciality: req.body.speciality.speciality
      }).then(data => { if(data.length > 0){
        res.json(data)
      } else{
        res.json({doc_id: null})
      }});
}
module.exports = {
    handleSearchDoctor : handleSearchDoctor
}