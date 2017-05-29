var express = require('express');
var router = express.Router();
var userController = require('./controllers/userController');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

router.post('/signup', userController.signup);
router.post('/login',userController.login);
router.get('/chats/:username', userController.passportauth, userController.openChat);
router.get('/chat/:username1/:username2', userController.passportauth, userController.openMessage);
router.get('/allusers/:username', userController.passportauth, userController.allUsers);
router.post('/send',userController.passportauth, userController.send);

module.exports = router;
