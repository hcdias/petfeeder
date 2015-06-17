var express = require('express');
var router = express.Router();
var db = require('../db/mysql');
var util = require("util");

router.get('/',function(req,res,next){
	res.render('cadastro');
});


router.post('/salvar',function(req,res,next){
	
	var nome_animal = req.body.nome_animal;
	var raca_animal = req.body.raca_animal;	
	var sexo_animal = req.body.sexo_animal;
	var especie_animal = req.body.especie_animal;
	var pelagem_animal = req.body.pelagem_animal;


	db.query("INSERT INTO animal SET nome = '"+nome_animal+"',raca ='"+raca_animal+"', sexo = '"+sexo_animal+"',especie = '"+especie_animal+"',pelagem = '"+pelagem_animal+"';",function(err,rows,field){
		
		if(err){
			console.log(err);
		}else{
			console.log("salvo");
		}
		
	});
	
	res.send({status:'salvo'});

});

module.exports = router;
