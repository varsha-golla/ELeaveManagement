app.get('/fpendingreqs',function(req,res){
  if(req.session.auth){
    db.tempadjust.find({adjustedfacultyid:req.session.facultyid},function(error,docs){
      if(error){
        res.send("something went wrong ....!")
      }
      else{
        res.render('fpendingreqs',{result:docs})          //ejs file
      }

    })
  }
  else{

    res.send("please Login")
  }
})





app.get('/fleaveavails',function(req,res){
  if(req.session.auth){
        db.confirmedleaves.find({facultyid:req.session.facultyid},function(error,docs){
          if(error){
            res.send("something went wrong ....!")
          }
          else{
            res.render('fleaveavails',{result:docs})                //ejs file
          }

        })
  }
  else{
    res.send("please Login")
  }
})