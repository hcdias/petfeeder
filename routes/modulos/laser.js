var express = require('express');
var router = express.Router();
var db = require('../../db/mysql');
var cron = require('crontab');

router.get('/',function(req,res,next){
	res.render('laser');
});

router.post('/salvar',function(req,res,next){

	if(!req.body || req.body.ativar_modulo == undefined){
		
	}	
		
	var ativar_modulo = req.body.ativar_modulo;
	var horarios = req.body.horario;
	var bulkSql = [];

	if(typeof horarios === 'string'){
		horarios = [horarios];
	}

	for(horario in horarios){
		bulkSql.push([horarios[horario],1]);
	}

	var statusRes = saveData(bulkSql);

	res.send({status:statusRes});

});

function saveData(bulkSql){
	var result = null;
	db.query("INSERT INTO modulo_ativo (horario,modulo_id) VALUES ?",[bulkSql],function(err,rows,field){
			if(err){
				result = 0;
				console.log(err);

			}else{

				cron.load(function(err,crontab){
					var job = crontab.create("node /home/root/petfeeder/scripts/bash/laser.sh","50 2 * * *","laser");
					//crontab.remove({command:'ls -l',comment:/teste/});
					crontab.save(function(err,crontab){
						console.log(err+" save");
					});

				});
			}
		}.bind(this)
	);

	db.end();
	return result;
}

function removeData(){
	db.query("DELETE FROM modulo_ativo WHERE id_modulo = 1",function(err,rows,field){
		if(err){
			console.log(err);
		}else{
			cron.load(function(err,crontab){
				crontab.remove({command:'node /home/root/petfeeder/scripts/bash/laser.sh',comment:/laser/});
			});	
		}		
	});

	db.end();	
}

module.exports = router;

