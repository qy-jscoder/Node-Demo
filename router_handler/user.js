const db = require('../db/index.js')
//加密密码 包
const bcrypt = require('bcryptjs')
//jwt身份认证 包
const jwt=require('jsonwebtoken')
//加密和解密的密钥
const config=require('../config.js')
//注册
exports.register = (req, res) => {
    const userInfo = req.body
    if (!userInfo.userName || !userInfo.password) {
        res.send({
            status: 0, message: '账号或密码不能为空'
        })
    }
    //数据库查询
    const sqlStr = 'select * from user where userName=?'
    db.query(sqlStr, userInfo.userName, (err, res) => {
        if (err) {
            return res.handleErr(err)
        }
        if (res.length > 0) {
            res.send({ status: 0, message: '该用户名已被使用' })
        }
        //调用bcrypt.hashSync对密码进行加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        //插入新注册的用户信息
        const sql = 'insert into user set ?'
        db.query(sqlStr, { userName: userInfo.userName, password: userInfo.password }, (err, res) => {
            if (err) {
                 return res.handleErr(err)
            }
            //影响行数是否为1
            if (res.affectedRows===1) {
                res.send({ status: 200, message: '注册成功' })
            }
        })
    })
}




//登录
exports.login = (req, res) => {
    const userInfo=req.body
    const sql='select * from user where userName=?'
    db.query(sql,userInfo.userName,(err,res)=>{
        if(err)return res.handleErr(res)
        //获取对应userName的密码个数不是一个
        if(res.length!==1)return res.handleErr('登录失败')
        //用户输入密码和数据库中对应userName的加密过的密码 比较，结果为true或者false
        const compareRes=bcrypt.compareSync(userInfo.password,res[0].password)
        if(!compareRes)return res.handleErr('密码不一致，登录失败')
        //生成token
        const user={...res[0],password:'',user_pic:''}
        //生成token
        const token=jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn
        })

        res.send({
            message:'登录成功',
            token:'Bearer '+token
        })
    })
}
