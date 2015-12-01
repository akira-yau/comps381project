var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MONGODBURL = 'mongodb://akira1130.cloudapp.net:27017/test';

var restaurantSchema = require('./models/restaurant');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//create_K.O.
app.post('/', function(req,res) {
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;

		var restaurant = mongoose.model('restaurant', restaurantSchema);
		var r = new restaurant(rObj);
		r.save(function(err,results){
			if (err) {
				res.status(500).json(err);
			}
			else {
				res.status(200).json({message: 'insert done', _id: r._id});
				db.close();
			}
		});
	});
});

//remove_K.O.
app.delete('/:attrib/:attrib_value', function(req,res) {
	var criteria = {};
	var temp = req.params.attrib;
	if(temp=="street" ||temp=="zipcode" ||temp=="building"||temp=="coord"){
		temp = "address."+temp;
	}
	criteria[temp] = req.params.attrib_value;

	//show log in server side
	console.log(criteria);

	
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var restaurant = mongoose.model('restaurant', restaurantSchema);
		restaurant.find(criteria).remove(function(err){
			if (err) {
				res.status(500).json(err);
			}
			else {
				res.status(200).json({message: 'delete done', restaurant_id: req.params.restaurant_id});
				db.close();
			}
		});
	});
});

//update_K.O.
app.put('/:restaurant_id/:attrib/:attrib_value', function(req,res) {
	var criteria = {};
	var temp = req.params.attrib;
	if(temp=="street" ||temp=="zipcode" ||temp=="building"||temp=="coord"){
		temp = "address."+temp;
	}
	criteria[temp] = req.params.attrib_value;

	//show log in server side
	console.log(criteria);
	
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var restaurant = mongoose.model('restaurant', restaurantSchema);
		restaurant.update({restaurant_id:req.params.restaurant_id},{$set:criteria},function(err){
			if (err) {
				res.status(500).json(err);
			}
			else {
				res.status(200).json({message: 'update done', restaurant_id: req.params.restaurant_id});
				db.close();
			}
		});
	});
});

//display_K.O.
app.get('/:attrib/:attrib_value', function(req,res) {
	var criteria = {};
	var temp = req.params.attrib;
	if(temp=="street" ||temp=="zipcode" ||temp=="building"||temp=="coord"){
		temp = "address."+temp;
	}
	criteria[temp] = req.params.attrib_value;

	//show log in server side
	console.log(criteria);

	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var restaurant = mongoose.model('restaurant', restaurantSchema);
		restaurant.find(criteria,function(err,results){
			if (err) {
				res.status(500).json(err);
			}
			else {
				db.close();
				console.log('Found: ',results.length);
				if(results.length == 0){
					res.status(200).json({message: 'No matching document', restaurant_id: req.params.restaurant_id});
				}else{
					res.status(200).json(results);
				}
			}
		});
	});
});

app.get('/', function(req,res) {
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var restaurant = mongoose.model('restaurant', restaurantSchema);
		restaurant.find({},function(err,results){
			if (err) {
				res.status(500).json(err);
			}
			else {
				db.close();
				console.log('Found: ',results.length);
				if(results.length == 0){
					res.status(200).json({message: 'No matching document', restaurant_id: req.params.restaurant_id});
				}else{
					res.status(200).json(results);
				}
			}
		});
	});
});

app.listen(process.env.PORT || 8099);
