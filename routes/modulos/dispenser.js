var express = require('express');
var router = express.Router();
var db = require('../../db/mysql');
var cron = require('crontab');

router.get('/agua',function(req,res,next){
	res.render('dispenserAgua');
});

router.get('/comida',function(req,res,next){
	res.render('dispenserComida');
});

router.post('/agua-salvar',function(req,res,next){
	var statusRes = null;

	if(req.body.ativar_modulo == undefined){		
		statusRes = removeDataDispenserAgua(4,1);
	}else{

		console.log(req.body);		
		var ativar_modulo = req.body.ativar_modulo;
		var horarios = req.body.horario;
		var bulkSql = [];

		if(typeof horarios === 'string'){
			horarios = [horarios];
		}

		for(horario in horarios){
			bulkSql.push([horarios[horario],4]);
		}
		console.log(bulkSql);
		statusRes = saveData(bulkSql,horarios,1);
	}	

	res.send({status:statusRes});
});

router.post('/comida-salvar',function(req,res,next){
	var statusRes = null;

	if(req.body.ativar_modulo == undefined){		
		statusRes = removeDataDispenserComida(5,2);
	}else{

		console.log(req.body);		
		var ativar_modulo = req.body.ativar_modulo;
		var horarios = req.body.horario;
		var bulkSql = [];

		if(typeof horarios === 'string'){
			horarios = [horarios];
		}

		for(horario in horarios){
			bulkSql.push([horarios[horario],5]);
		}

		statusRes = saveData(bulkSql,horarios,2);
	}

	

	res.send({status:statusRes});
});

function saveData(bulkSql,horarios,tipoDispenser){
	db.query("INSERT INTO modulo_ativo (horario,modulo_id) VALUES ?",[bulkSql],function(err,rows,field){
				if(err){
					console.log(err);
				}else{
					
					var stringSplit = [];
					for(horario in horarios){
						stringSplit.push(horarios[horario].split(":"));
					}

					var bashScript = "";
					if(tipoDispenser == 1){
						bashScript = "dispenseragua";
					}else{
						bashScript = "dispensercomida";
					}

					cron.load(function(err,crontab){
						
						for(string in stringSplit){
							crontab.create("/home/root/petfeeder/scripts/bash/"+bashScript+".sh",stringSplit[string][1]+" "+stringSplit[string][0]+" * * *",bashScript);
						}

						crontab.save(function(err,crontab){
							console.log(err+" save");
						});
					}.bind(this));
				}
			}
		);

	return 'save';
}

function removeDataDispenserComida(){
	db.query("DELETE FROM modulo_ativo WHERE modulo_id = 5",function(err,rows,field){
		if(err){
			console.log(err);
			return false;
		}else{			

			cron.load(function(err,crontab){
				
				crontab.remove({command:"/home/root/petfeeder/scripts/bash/dispensercomida.sh",comment:/dispensercomida/});
				crontab.save(function(err,crontab){
					console.log(err+" save");
				});
			}.bind(this));
		}		
	});

	return 'remove';
}

function removeDataDispenserAgua(){
	db.query("DELETE FROM modulo_ativo WHERE modulo_id = 4",function(err,rows,field){
		if(err){
			console.log(err);
			return false;
		}else{			

			cron.load(function(err,crontab){
				
				crontab.remove({command:"node /home/root/petfeeder/scripts/bash/dispenseragua.sh",comment:/dispenseragua/});
				crontab.save(function(err,crontab){
					console.log(err+" save");
				});
			}.bind(this));
		}		
	});

	return 'remove';
}

module.exports = router;