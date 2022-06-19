var express = require('express');
var router = express.Router();
var fs=require("fs");
var path=require("path")

/* GET home page. */
router.get('/', function(req, res, next) {
  let usersJSON=fs.readFileSync(path.join(__dirname,"./../models/users.JSON"),"utf-8")
  let usersList=JSON.parse(usersJSON)
  res.render('index', { title: 'Express',usersList:usersList});
});

module.exports = router;
