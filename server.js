let express = require("express");
let path = require("path");

let app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req, res)=>{
    //res.sendFile("/HTML/index.html");
    res.sendFile(__dirname+"/public/HTML/index.html");
})

//フォームからのデータを受けとるにはexpress.urlencoded({extended:true})の記述が必要らしい。
app.use(express.urlencoded({ extended: true }));

app.post("/login",(req, res)=>{
    console.log("LONGIN");
    console.log(req.body);
    console.log(req.body.userName);
    console.log(req.body.password);
    res.sendFile(__dirname+"/public/HTML/game.html");
})

app.listen(3000,()=>{
    console.log("Start server port:3000");
})

