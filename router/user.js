const express = require('express')
const router = express.Router()
//导入表单校验中间件
const expressJoi=require('@escook/express-joi')
//导入验证规则对象
const {regLoginSchema}=require('../schema/user.js')
//导入路由处理函数模块
const userHandler=require('../router_handler/user.js')
//注册新用户
router.post('/register',expressJoi(regLoginSchema), userHandler.register)//局部生效的中间件

//登录
router.post('/login',expressJoi(regLoginSchema), userHandler.login)

module.exports=router