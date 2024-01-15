const express=require("express");
const app=express();

app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static('./public'))

const client=require("mongodb").MongoClient;
const Objid=require("mongodb").ObjectId;

//http://localhost:8900/signup?name=shivayyy&passsword=12387
let dbinstance;
//-----------cart ,website ,student --->collection i used.
client.connect("mongodb+srv://shiva1277:shiva@cluster0.kiyvyjp.mongodb.net/?retryWrites=true&w=majority").then((database)=>{
    dbinstance=database.db("Shiva2111981277");
    console.log("Database connected  ")
}).catch((err)=>{
    console.log("Not connected");
})

app.get("/",(req,res)=>{
    res.render("come");
})


app.post("/login",(req,res)=>{
    dbinstance.collection("student").find({$and:[{name:req.body.name},{password:parseInt(req.body.password)}]}).toArray().then((response)=>{
        console.log(response);
        if(response.length>0){
            res.redirect("/showdata");
        }
        else{
            res.render("dashboard");
        }
    })
    })


app.post("/sinn",(req,res)=>{
    res.render("sign");
})
   
    app.post("/signup",(req,res)=>{
        dbinstance.collection("student").find({$and:[{name:req.body.name},{password:(req.body.password)}]}).toArray().then((response)=>{
            console.log(response);
            if(response.length>0){
                res.render("dashboard");
    
            }
            else{
                let obj={};
                obj.name=req.body.name;
                obj.password=parseInt(req.body.password);
                dbinstance.collection("student").insertOne(obj).then((ans)=>{
                    console.log("inserted.....");
                 res.redirect("/showdata");
                })
    
            }
        })
    })
    
    
app.get("/showdata",(req,res)=>{
dbinstance.collection("website").find({}).toArray().then((response)=>{
      res.render("home",{ans:response});
      res.end();
})
})

app.get("/add",(req,res)=>{
    res.render("add");
})


app.post("/storedata",(req,res)=>{
    let obj={"name":req.body.name,"age":req.body.age,"summary":req.body.summary,"img":req.body.img};
    dbinstance.collection("website").insertOne(obj).then((response)=>{
        console.log(response);
    })

    res.redirect("/showdata");
})



app.get("/viewdata/:id",(req,res)=>{
    dbinstance.collection("website").findOne({"_id":new Objid(req.params.id)}).then((result)=>{
        res.render("student",{data:result});
    })
})




app.get("/updatedata/:id",(req,res)=>{
dbinstance.collection("website").findOne({"_id":new Objid(req.params.id)}).then((response)=>{
    res.render("update",{data:response});
})
})

app.post("/update",(req,res)=>{
dbinstance.collection("website").updateOne({"_id":new Objid(req.body.id)},{$set:{"name":req.body.name,"age":req.body.age}})
res.redirect("/showdata");
})



app.get("/deletedata/:id",(req,res)=>{
    dbinstance.collection("website").findOne({"_id":new Objid(req.params.id)}).then((response)=>{
        res.render("delete",{data:response});
    })
})


app.post("/del",(req,res)=>{
    dbinstance.collection("website").deleteOne({"_id":new Objid(req.body.id)}).then((response)=>{
        res.redirect("/showdata");
    })
})



app.get("/cart",(req,res)=>{
    dbinstance.collection("cart").find({}).toArray().then((response)=>{
          res.render("cartt",{ans:response});
          res.end();
    })
    })
    
app.get("/addcart/:id/:age/:name/:img",(req,res)=>{
    let obj={"name":req.params.name,"age":req.params.age,"img": decodeURIComponent(req.params.img)}
    dbinstance.collection("cart").insertOne(obj).then((response)=>{
        console.log(response);
       
    })
    res.redirect("/showdata");
   
})


app.get("/cartdel/:id",(req,res)=>{
    dbinstance.collection("cart").deleteOne({"_id":new Objid(req.params.id)}).then((response)=>{
        res.redirect("/cart");
    })
})



app.listen(1000,(err)=>{
    console.log("server connected");
})
