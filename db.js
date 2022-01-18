const fs = require('fs')

const path = require('path')
const dbPath = path.join(__dirname,'./db.json') //path模块的join方法第一个参数__dirname能表示当前文件，第二个参数则是当前文件对应的相对路径

const {promisify} = require('util')

const mysql = require('mysql')
// var connection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'root',
//     database:'hkzf',
//     port:'3306'
// })
// connection.connect()
// exports.sqlTest = ()=>{
//     connection.query('SELECT * from characteristics WHERE id=4 OR id=13',(err,results,fields)=>{
//         if(err){
//             console.log(err);
//         }
//         console.log(results);
//     })
// }


// const myReadFile = (dbPath)=>{
//     return new Promise((resolve,reject)=>{
//         fs.readFile(dbPath,'utf-8',(err,data)=>{
//             if(err) reject(err)
//             if(data) resolve(data)
//         })
//     })
// }

// promisify可以直接把readFile等api转换成Promise的形式
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

exports.getDb = async ()=>{
    // const data = await myReadFile(dbPath)
    const data = await readFile(dbPath,'utf-8') // readFile已经是Promise的形式
    return JSON.parse(data)
}

exports.saveDb = async db =>{
    const data = JSON.stringify(db,null,'  ')
    try{
        await writeFile(dbPath,data)
        return 'ok'
    }catch(err){
        return 'err'
    }
}

const logsPath = path.join(__dirname,'./log.json')
exports.setLogs = async log =>{
    const data = await readFile(logsPath,'utf-8')
    const db = JSON.parse(data)
    db.logs.push(log)
    await writeFile(logsPath,JSON.stringify(db,null,'  '))
}