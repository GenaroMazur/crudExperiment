var express = require('express');
var router = express.Router();
var fs=require("fs");
var path=require("path")
const multer=require("multer")

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,"./../public/images/userImg"))
  },
  filename:(req,file,cb)=>{
    let fileName="user_image-"+Date.now()+path.extname(file.originalname)
    cb(null,fileName)
  }
})
const update=multer({storage})

router.get("/",(req,res)=>{
  let usersJSON=fs.readFileSync(path.join(__dirname,"./../models/users.JSON"),"utf-8")
  let usersList=JSON.parse(usersJSON)
  res.render("users",{title:"formulario",usersList:usersList})
})
router.get("/:userId/edit",(req,res)=>{
  let usersJSON=fs.readFileSync(path.join(__dirname,"./../models/users.JSON"),"utf-8")
  let usersList=JSON.parse(usersJSON)
  let usuario=usersList.find(user=>{
    return req.params.userId==user.id
  })
  res.render("editUsers",{title:"editar Usuario", usuario:usuario})
})

router.post("/create",update.single("userImage"),(req,res)=>{
  let usuario={
    username:req.body.username||"",
    password:req.body.password||"",
    age:req.body.age||0,
    image:req.file.filename||null
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
  let userId=req.params.userId
  let userList=usersList.filter(user=>{
    if(user.id==userId){
      if(user.image!=null){
        fs.rmSync(path.join(__dirname,"./../public/images/userImg",user.image))
      }
    }
    return user.id != userId
  })
  
  fs.writeFileSync(path.join(__dirname,"./../models/users.JSON"),JSON.stringify(userList),"utf-8")
  res.redirect("/users")
})

router.put("/:userId/edit",(req,res)=>{
  let usersJSON=fs.readFileSync(path.join(__dirname,"./../models/users.JSON"),"utf-8")
  let usersList=JSON.parse(usersJSON)

  let editedUser={
    username:req.body.username||"",
    password:req.body.password||"",
    age:req.body.age||0,
    id:req.params.userId
  }

  let editedUsersList=usersList.map(user=>{
    if ( user.id == editedUser.id ) {
      return user = editedUser
    }
    return user
  })

  fs.writeFileSync(path.join(__dirname,"./../models/users.JSON"),JSON.stringify(editedUsersList),"utf-8")
  res.redirect("/users")
})

module.exports = router;
