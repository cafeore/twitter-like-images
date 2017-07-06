var cliant = new require('twitter')(require('../token.json'));
var strtotime = require('strtotime');
var http = require('http');
var fs = require('fs');
//const termImg = require('term-img');
const request = require('then-request');
//var await = require('await');
var async = require('async');
var express = require('express');
var router = express.Router();
var params = {screen_name: String,//process.argv[2],
			  count: Number//process.argv[3]
			};

var opt = {
		width:'50%',
		height:'50%'
	};
var img = [];
router.get('/', function(req, res, next) {
  	res.render('index', {tweets:img});
});
router.post('/',function(req,res,next){
	params.screen_name = req.body.userid;
	params.count = req.body.count;
	
	if(params.count>200||params.count<1)params.count=20;
	console.log(params);
	if(params.screen_name=='')res.render('index',{tweets:img});
	else{
		cliant.get('favorites/list', params, function(error, tweets, response){
			/*if(params.screen_name == ''){
				img.push("https://rr.img.naver.jp/mig?src=http%3A%2F%2Fext.stat.ameba.jp%2Fuser_images%2F20110731%2F16%2Fmiyase1983%2Fdd%2F73%2Fj%2Ft02200152_0348024011385436693.jpg%3Fcaw%3D500&twidth=1000&theight=0&qlt=80&res_format=jpg&op=r");
				//res.render('index', {tweets:img});
			}
			else */if (!error) {
				get_tweet(tweets,res);
			}
			res.render('index',{tweets:img});
			img=[];
		});
	}
});

function get_tweet(tweets,res){
	async.each(tweets,function(tweets,callback){
		if(tweets['extended_entities']!=null){
			async.each(tweets['extended_entities']['media'],function(imgs,callback){
				img.push(imgs['media_url_https']);
			});
		}
	});
	//res.render('index', {tweets:img});
	//img=[];
}
module.exports = router;
