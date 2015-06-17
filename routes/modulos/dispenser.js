var express = require('express');
var router = express.Router();

router.get('/agua',function(req,res,next){
	res.render('dispenserAgua');
});

router.get('/comida',function(req,res,next){
	res.render('dispenserComida');
});

router.post('/agua-salvar',function(req,res,next){
	res.send("ok!");
});

router.post('/comida-salvar',function(req,res,next){
	res.send("ok!");
});

module.exports = router;