var validations =
{
  validateAge:function (birthdate){
    var today = new Date();
    return today.getFullYear() > birthdate.getFullYear();
  }
}

module.exports = validations;
