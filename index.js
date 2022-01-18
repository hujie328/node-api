const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3000
const {getDb,saveDb,setLogs,sqlTest} = require("./db")

app.all("*",(req,res,next)=>{
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options'){
        res.send(200);  //让options尝试请求快速结束
    }else{
        next();
    }
})


// // 引入三方插件解析post请求体参数
// const bodyParser = require('body-parser')
// // 创建application/json 解析器
// const jsonParser = bodyParser.json()
// app.use(jsonParser)
// // 创建 application/x-www-form-urlencoded 解析器
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(urlencodedParser)

// express 有自带的解析中间件
app.use(express.json())
app.use(express.urlencoded())

app.use((req,res,next)=>{
    let log = req.method+req.url+'===>'+Date.now()
    setLogs(log)
    next()
})

app.get('/todos',async (req,res) =>{
    if(req.query.issend == 'true'){
        // fs.readFile('./db.json','utf-8',(err,data)=>{
        //     if(err){
        //        return res.status(500).json({
        //             error:err.message
        //         })
        //     }
        //     const db = JSON.parse(data)
        //     res.status(200).json(db.todos)
        // })
        // 对于上面的读取文件操作封装成db模块
        try{
            sqlTest()
            const db = await getDb()
            res.status(200).json(db.todos)
        }catch(err){
            res.status(500).json({
                error:err.message
            })
        }
    }else{
        res.status(500).send("参数错误") //res.status(500).send("参数错误")
    }
})

app.get('/hujie',(req,res)=>{
    res.send('胡杰')
})

app.post('/todos/add',async (req,res) =>{
    let data = req.body
    console.log(data)
    if(!data.id){
        res.status(422).json({
            error:'The id is required'
        })
        return
    }
    const db = await getDb()
    db.todos.push({
        id:data.id,
        title:data.title
    })
    let state = await saveDb(db) 
    if(state =='ok'){
        res.status(200).send(`save ${data.id} is success`)
    }else{
        res.status(500).send(state)
    }
})

app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
})