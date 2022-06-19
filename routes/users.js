var express = require('express');
var router = express.Router();
var fs=require("fs");
var path=require("path")

router.get("/",(req,res)=>{
  let usersJSON=fs.readFileSync(path.join(__dirname,"./../models/users.JSON"),"utf-8")
  let usersList=JSON.parse(usersJSON)
  res.render("users",{title:"formulario",usersList:usersList})
})

router.post("/create",(req,res)=>{
  let usuario={
    username:req.body.username||"",
    password:req.body.password||"",
    age:req.body.age||0
  }
  let usersJSON=fs.readFileSync(path.join(__dirname,"./../models/users.JSON"),"utf-8")
  if (usersJSON==""){
    usersList=[]
  } else {
    usersList=JSON.parse(usersJSON)
  }
  usuario.id=Math.floor(Math.random()*1000)
  usersList.push(usuario)
  fs.writeFileSync(path.join(__dirname,"./../models/users.JSON"),JSON.stringify(usersList),"utf-8")

  res.redirect("/users")
})
router.delete("/:userId",(req,res)=>{
  let usersJSON=fs.readFileSync(path.join(__dirname,"./../models/users.JSON"),"utf-8")
  let usersList=JSON.parse(usersJSON)

  let userList=usersList.filter(user=>{
    return user.id != userId
  })

  fs.writeFileSync(path.join(__dirname,"./../models/users.JSON"),JSON.stringify(userList),"utf-8")
  res.redirect("/users")
})

module.exports = router;
