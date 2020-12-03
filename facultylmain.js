// var express = require('express')
var app = express()

app.use(express.static('static_files'))
var request = require('request')
app.set('view engine', 'ejs')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/',function(req,res){
	res.render('teja')
})


app.listen(3001, function(){
	console.log('Hey I am Running!..')
})
