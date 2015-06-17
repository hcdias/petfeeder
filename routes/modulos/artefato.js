var express = require('express');
var router = express.Router();
var db = require('../../db/mysql');

router.get('/',function(req,res,next){
	res.render('artefato');	
});

router.post('/salvar',function(req,res,next){
	
	if(!req.body || req.body.ativar_modulo == undefined) return res.send({status:0})
	

	var ativar_modulo = req.body.ativar_modulo;
	var horarios = req.body.horario;
	var bulkSql = [];

	if(typeof horarios === 'string'){
		horarios = [horarios];	
	} 

	console.log(horarios.length);
	for(horario in horarios){
		bulkSql.push([horarios[horario],1]);
	}
	console.log(bulkSql);

	db.query("INSERT INTO modulo_ativo (horario,modulo_id) VALUES ?",[bulkSql],function(err,rows,field){
		if(err){
			console.log(err);
		}else{
			console.log(rows);
		}
	});


	res.send({status:'salvo'});
});

module.exports = router;