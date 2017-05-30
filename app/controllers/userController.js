var Users = require('../models/Users.js');
var Chats = require('../models/Chats.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('../../config/passport')(passport);
const secret = require('../../config/secret');

var userController = {

  passportauth: passport.authenticate('jwt', { session: false }),

  signup: function(req,res)
  {
    if(!(req.body.firstname && req.body.lastname && req.body.username && req.body.password )){
      res.json({ success: false, message: 'Something is Missing' });
    }else
    {
      var today = new Date();
      var year = today.getFullYear() - 12;
      if(req.body.dateOfBirth && req.body.dateOfBirth.getFullYear() > year){
        res.json({ success: false, message: 'You need to be older to register' });
      }
      Users.findOne({username: req.body.username},function(err,user){
        if (user)
        {
          res.json({ success: false, message: 'Username is already used!.' });
        }else
        {
          var newUser = new Users({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password,
            dateOfBirth: req.body.dateOfBirth
          });
          console.log(newUser);
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
              newUser.password = hash;
              newUser.save(function(err,user)
              {
                if(err){
                  console.log(err)
                  res.json({success: false, message: 'There is a Problem'});
                }else
                {
                  console.log('habibi  '+ user)
                  var token = jwt.sign
                  (
                    {_id: user._id,username: user.username},
                    secret.secret,
                    {
                      expiresIn: 10080 // in seconds
                    }
                  );
                  res.json({
                      success: true,
                      token: 'JWT ' + token,
                      user:
                      {
                        id: user._id,
                        firstname: user.firstname,
                        username: user.username,
                      }
                  });
                }
              });
            });
          });
        }
      });
    }
  },
  comparePassword: function (candidatePassword, hash, callback) {
      bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
          if (err) throw err;
          callback(null, isMatch);
      });
  },

  login: function(req, res)
  {
    if(req.body.username && req.body.password)
    {
      Users.findOne({username: req.body.username},function(err,user)
        {
          if(err)
            res.json({success: false, message: 'There is a Problem'});
          else
          {
            if(!user)
            {
              res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            else
            {
              bcrypt.compare(req.body.password,user.password,function (err, isMatch)
                {
                  if (isMatch && !err)
                  {
                    // Create token if the password matched and no error was thrown
                    var token = jwt.sign
                    (
                      {_id: user._id,username: user.username},
                      secret.secret,
                      {
                        expiresIn: 10080 // in seconds
                      }
                    );
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user:
                        {
                          id: user._id,
                          firstname: user.firstname,
                          username: user.username,
                        }
                    });
                  } else {
                    res.json({ success: false, message: 'Authentication failed. Passwords did not match.' });
                  }
                }
              );
            }
          }
        }
      );
    }
  },

  openChat: function(req, res)
  {
    console.log(req.params.username);
    if(req.params.username)
    {
      Chats.find({user1: req.params.username},function(err,chats){
        if(err)
          res.json({success: false, message: 'There is a Problem'});
        else
        {
          Chats.find({user2: req.params.username},function(err,chats2){
            if(err)
              res.json({success: false, message: 'There is a Problem'});
            else
            {
              for(var i = 0;i < chats2.length;i++)
              {
                chats.push(chats2.splice(i, 1));
              }
              res.json({success: true,chats ,message:'list of latateen'});
            }
          });
        }
      });
    }
  },

  openMessage: function(req , res)
  {
    //{$or:[{Username1:requesterUsername, Username2:requiredUsername},{Username1:requiredUsername, Username2:requesterUsername}]}
    if((req.params.username1 && req.params.username2)){
      Chats.findOne({$or:[{user1: req.params.username1, user2: req.params.username2},{user1: req.params.username2, user2: req.params.username1}]},function(err,chat)
      {
        if(err)
          res.json({success: false, message: 'There is a Problem'});
        else
        {
          console.log(chat);
          res.json({success: true,chat ,message:'kalm el latat'})
        }
      });
    }
  },

  send: function(req,res)
  {
    if(!(req.body.content && req.body.username1 && req.body.username2 && req.body.username1 != req.body.username2) )
    {
      res.json({success: false, message: 'Some data is Missing or sending to the same persone'});
    }else{
      Chats.findOne({user1:req.body.username1 , user2: req.body.username2},function(err,chat)
      {
        if(err)
          res.json({success: false, message: 'There is a Problem1'});
        else if(!chat)
        {
          Chats.findOne({user1: req.body.username2, user2:req.body.username1},function(err,chat2)
          {
            if(err)
              res.json({success: false, message: 'There is a Problem2'});
            else if(!chat2)
            {
              var newChat = new Chats({
                user1: req.body.username1,
                user2: req.body.username2,
              });
              newChat.message.push(  {
                  content: req.body.content,
                  date: new Date(),
                  sender: req.body.username1
                });
                newChat.save(function(err,newChat){
                  if(err)
                    res.json({success: false, message: 'There is a Problem3'});
                  else {
                    res.json({success: true, newChat:newChat, message: 'message sent to new chat'});
                  }
                });
            }else {
              chat2.message.push({
                  content: req.body.content,
                  date: new Date(),
                  sender: req.body.username1
                });
                chat2.save(function(err,chat2){
                  if(err)
                    res.json({success: false, message: 'There is a Problem4'});
                  else {
                    res.json({success: true, newChat:chat2, message: 'message sent to chat'});
                  }
                });
            }
          });
        } else {
          chat.message.push({
              content: req.body.content,
              date: new Date(),
              sender: req.body.username1
            });
            chat.save(function(err,chat){
              if(err)
                res.json({success: false, message: 'There is a Problem4'});
              else {
                res.json({success: true, newChat:chat, message: 'message sent to chat'});
              }
            });
          }
      });
    }
  },

  allUsers:function(req,res)
  {
    Users.find(function(err,users){
      if(err)
        res.json({success: false, message: 'There is a Problem'});
      else {
        var allusers = [];
        var user1 = new Users();
        for(var i = 0;i < users.length;i++)
        {
          if(users[i].username != req.params.username)
          {
            var user =
            {
              firstname: users[i].firstname,
              lastname: users[i].lastname,
              dateOfBirth: users[i].dateOfBirth,
              username: users[i].username,
              online: users[i].online
            }
            allusers.push(user);
          }else{
            user1 = users[i];
            user1.online = true;
            user1.save(function(err,onuser)
            {
              if(err)
                res.json({success: false, message: 'There is a Problem'});
              else {
                  console.log(onuser);
                }
            });
          }
          console.log(allusers)

        }
        res.json({success: true, allusers, user1, message: 'Wellcome to all Users'});
      }
    });
  },

  logout:function(req,res)
  {
    Users.findOne({username:req.body.username},function(err,user)
    {
      user.online = false;
      if(err)
      {
        res.json({success: false, message: 'There is a Problem'});
      }else
      {

        user.save(function(err,offuser)
        {
          if(err)
            res.json({success: false, message: 'There is a Problem'});
          else {
              console.log(offuser);
              res.json({success:true, message:'logout'});
            }
        });

      }


    });
  }


}
module.exports = userController;
