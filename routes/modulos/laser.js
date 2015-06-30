var express = require('express');
var router = express.Router();
var db = require('../../db/mysql');
var cron = require('crontab');

router.get('/',function(req,res,next){
	res.render('laser');
});

router.post('/salvar',function(req,res,next){
	var statusRes = null;

	if(req.body.ativar_modulo == undefined){		
		statusRes = removeData();
	}else{

		console.log(req.body);		
		var ativar_modulo = req.body.ativar_modulo;
		var horarios = req.body.horario;
		var bulkSql = [];

		if(typeof horarios === 'string'){
			horarios = [horarios];
		}

		for(horario in horarios){
			bulkSql.push([horarios[horario],1]);
		}

		statusRes = saveData(bulkSql,horarios);
	}

	

	res.send({status:statusRes});

});

function saveData(bulkSql,horarios){
	db.query("INSERT INTO modulo_ativo (horario,modulo_id) VALUES ?",[bulkSql],function(err,rows,field){
				if(err){
					console.log(err);
				}else{
					
					var stringSplit = [];
					for(horario in horarios){
						stringSplit.push(horarios[horario].split(":"));
					}

					cron.load(function(err,crontab){
						
						for(string in stringSplit){
							crontab.create("/home/root/petfeeder/scripts/bash/laser.sh",stringSplit[string][1]+" "+stringSplit[string][0]+" * * *","laser");
						}

						crontab.save(function(err,crontab){
							console.log(err+" save");
						});
					}.bind(this));
				}
			}
		);
	//db.end();
	return 'save';
}

function removeData(){
	db.query("DELETE FROM modulo_ativo WHERE modulo_id = 1",function(err,rows,field){
		if(err){
			console.log(err);
			return false;
		}else{
			cron.load(function(err,crontab){
				
				crontab.remove({command:'node /home/root/petfeeder/scripts/bash/laser.sh',comment:/laser/});
				crontab.save(function(err,crontab){
					console.log(err+" save");
				});
			});
		}		
	});

	return 'remove';
	//db.end();	
}

module.exports = router;

