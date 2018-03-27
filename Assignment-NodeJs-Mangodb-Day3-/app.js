
var express = require("express");
var fs = require("fs");
var url = require("url");
var app = express();
var ejs  = require("ejs");
var empModel = require("./model/model.js");
var mongoose = require("mongoose");
var jade = require("jade");
app.set("view engine","jade");
mongoose.connect('mongodb://127.0.0.1:27017/EmployeeDB',function(err) {
    if (err) throw err;

    console.log("Database connected ..");

});


app.get('/',function(req,res) {
    fs.readFile('./views/addEmp.html', function (err,content){
        res.write(content);
        res.end();
    })
});


app.get('/addEmployee',function(req,res) {
    var empId = req.query.txtEmpId;
    var name = req.query.txtName;
    var desg = req.query.txtDesg;
    var city = req.query.txtCity;
    var userData = new empModel({
        emp_id : empId,
        name : name,
        desg : desg,
        city : city
    });

    userData.save(function(err) {
        if (err) {
            res.send(err);
            throw err;
        }
        console.log("Data saved in database");
        res.write("<h3>Data saved successfully</h3>");
        res.end();
    });
     
});

app.get('/getAllEmployees',function(req,res) {
    empModel.find({},function(err,results) {
        if (err) {
            throw err ;
        }
        console.log(results);
        res.render('listOfEmployee',{results : results})
        res.end();
    })
});

app.get('/deleteEmployee/:emp_id',function(req,res) {
    empModel.find({emp_id : req.params.emp_id}).remove().exec(function(err) {
        if(err) {
            throw err
        }
        console.log("Employee removed successfully");
        res.write("<h3>Employee removed successfully</h3>");
    });
    res.end();
})

app.get('/updateEmployee/:emp_id',function(req,res) {
    empModel.findOne({emp_id : req.params.emp_id},function(err,empDetails) {
        if(err) {
            throw err;
        }
        app.set('view engine', 'ejs');
        
        console.log('data===>',empDetails);
        res.render('updateInfo',{empDetails : empDetails});
        res.end();
    })
    
});

app.get('/saveInfo',function(req,res) {
    var empId = req.query.txtEmpId;
    var name = req.query.txtName;
    var desg = req.query.txtDesg;
    var city = req.query.txtCity;
    req.newData = {};
    req.newData.emp_id = empId;
    req.newData.name = name;
    req.newData.desg = desg;
    req.newData.city= city;
    empModel.findOneAndUpdate({_id : req.query.txtObjId }, req.newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        return res.send("succesfully saved");
        res.end();
    });
    
    
})
app.listen(3000,function(err) {
    if(err) throw err ;
    console.log("Server is listening on port 3000");
})