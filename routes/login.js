var express = require('express');
var router = express.Router();
var client = require('redis');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
	req.session.username = req.body.username;

	if(req.body.username === 'hugo'){
		//res.send(req.session.username);
		res.redirect('index');	
	}else{
		res.render('login',{error:true})
	}  	
});

module.exports = router;
