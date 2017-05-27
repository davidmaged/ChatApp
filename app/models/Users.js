var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var validators = require('../validators');


var UsersSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    requires: true,
  },
  dateOfBirth: {
    type : Date,
    //required: true,
    validate:[validate ({ validator: validators.validateAge,msg: 'Invalid age'})]
  },
  online: {
    type: Boolean,
    default: false
   }
});


var Users = mongoose.model("Users",UsersSchema);
module.exports = Users;
