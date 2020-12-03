var express = require('express')
var app = express()

app.use(express.static('static_files'))
var request = require('request')
app.set('view engine', 'ejs')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

mongojs = require('mongojs')
var db =  mongojs('mongodb://roja:roja9898@ds227654.mlab.com:27654/leave_management_svecw',['users','faculty','facultyleaves'])

var session = require('express-session')

app.use(session({ secret: 'roja98', cookie: { maxAge: 600000000000000000 }}))

app.get('/',function(req,res){
	res.sendFile(__dirname+'/static_files/adminhome.html')
})


app.post('/loginsubmit',function(req,res){
	var doc = {
 	facultyid : req.body.loginid,
 	password : req.body.pwd,
 }
 //console.log(doc)

//db.find(objectId(_))

 db.users.find(doc,function(err,data){
 	if(data.length>0){
 		var id = data[0].facultyid
 		var role = data[0].role
 		console.log(typeof(id))
 		//console.log("in login submit "+id)
 		req.session.auth = true
 		req.session.facultyid = id
 		db.faculty.find({facultyid:id},function(err,docs){
 			if(docs.length>0){

 				req.session.facultyname=docs[0].name
 				console.log("in faculty findd"+req.session.facultyname)
 				res.redirect('/profile/'+role+'/'+doc.facultyid)
 				//console.log("in faculty findd"+req.session.facultyname)
 			}
 			else{
 				console.log("errorrrrr.......")
 				res.send("Something went wrong")
 			}
 			//req.session.facultyname=docs[0].name
 			//console.log(docs)
 			//console.log(req.session.facultyname)

 		})

 	}
 	else{
 		res.send("invalid credentials")
 	}
 })

})

app.get('/profile/:role/:id',function(req,res){
	var role = req.params.role
	var id = req.params.id
	var doc= {
		role:role,
		facultyid:id
	}
	//console.log(req.session.facultyid)
	if(req.session.auth == true){
		db.users.find(doc,function(eror,docs){
			if(docs.length >0) {

				if(role == "faculty"){
			       res.render('facultymain',{res:docs})
				}
				else if(role == "hod"){
					res.render('hodmain',{res:docs})
				}
				else if(role == "principal"){
					res.render('principalmain',{res:docs})
				}
				else{
					res.render('adminmain',{res:docs})
				}
		}
			else {
				res.redirect('/')
			}
		})
	}
	else{
		res.send("please Login")
	}
	
})

app.get('/adjustments',function(req,res){
	if(req.session.auth){
		var today = new Date();
        var dd = today.getDate();
		var mm = today.getMonth() + 1;                 //January is 0!
		var yyyy = today.getFullYear();
		today = mm + '/' + dd + '/' + yyyy;
		console.log(req.session.facultyid)
		db.faculty.find({facultyid:req.session.facultyid},function(error,docs){
			//console.log(JSON.parse(docs))
			console.log(docs[0].dept)
			if(docs.length>0){
			var doc={
			facultyid:req.session.facultyid,

			dept:docs[0].dept,
			name:docs[0].name,
			applieddate:today,
			from:req.query.from,
			to:req.query.to,
			purpose:req.query.purpose,
			leavetype:req.query.leavetype,
			noofdays:req.query.noofdays
		}

		db.facultyleaves.insert(doc,function(error,response,body){
			if(error){
				
				res.redirect('/facultymain')
			}
			
		})                 
              var adjustedfacultyname = req.query.adjfname;
              var adjustedfacultydept = req.query.adjfdept;
              var session = req.query.session;
              var period = req.query.period;
              var semester = req.query.semester;
              var section = req.query.section;
              var adjustdate = req.query.adjdate;

              var doc1 = {
              appliedfacultyname : req.session.facultyname,
              appliedfacultyid : req.session.facultyid,
              appliedfacultydepartment : docs[0].dept,
              applieddate : today,
              adjustedfacultyname : adjustedfacultyname,
              adjustedfacultydept :adjustedfacultydept,
              session :session,
               period :period,
               semester :semester,
               section :section,
               adjustdate :adjustdate,

              }
              
              db.tempadjust.insert(doc1,function(error,reponse,body){
                      if(error){
                            window.alert("Something went wrong!!!Please Try again")
                            res.redirect('/facultymain')
                          }
                          else{
                            res.send("done")
                          }
              })
          }
          else{
          	res.send('you are not registered as a faculty member')
          }
		})
	}
})

app.get('/justcheck', function(req,res){
console.log("svcvs",req.session.facultyname)
})


app.get('/fpendingreqs',function(req,res){
	console.log("svcvs",req.session.facultyname)

  if(req.session.auth){
  	console.log(req.session.facultyname)

    db.tempadjust.find({adjustedfacultyname:req.session.facultyname},function(error,docs){
      if(docs.length>0){

      	console.log("in fpendingsreqs faculty name is     " + req.session.facultyname)
        res.render('fpendingreqs',{result:docs}) 
         
      }
      else{
        res.send('You dont have any requests')  
        console.log(req.session.facultyname)                       //ejs file
      }

    })
  }
  else{

    res.redirect('/login')
  }
})








app.listen(3000, function(){
	console.log('Hey I am Running!..')
})
