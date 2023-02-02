const mysql=require('mysql')

const db=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    database:'node-item'
})
//共享出去
module.exports=db