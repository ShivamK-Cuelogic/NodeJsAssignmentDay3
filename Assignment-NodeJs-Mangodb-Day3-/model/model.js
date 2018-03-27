
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    emp_id : {type : String , required : true ,maxlength : 5 , minlength : 2} ,
    name : String ,
    desg : String ,
    city : String
});

var empModel = mongoose.model('Employee' , employeeSchema);

module.exports = empModel;