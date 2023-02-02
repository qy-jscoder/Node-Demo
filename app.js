const express =require('express')
//导入cors跨域模块
const cors=require('cors')
const joi=require('@hapi/joi')
//解析token字符串
const expressJwt=require('express-jwt')
const config=require('./config.js')

const app=express()

//注册使用cors中间件
app.use(cors())
//只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({extended:false}))
//托管静态资源文件
app.use('/public',express.static('./public'))

//处理err值
app.use((req,res,next)=>{
    res.handleErr=(err,status=0)=>{
        res.send({status,message:err?.message||err})
    }
    next()
})
//解析token字符串
app.use(expressJwt({secret:config.jwtSecretKey}).unless({path:[/^\api/]}))

//导入并使用用户路由模块
const userRouter=require('./router/user.js')
app.use('/api',userRouter)
//定义错误级别的中间件
app.use((err,req,res,next)=>{
    if(err instanceof joi.ValidationError){
        return res.handleErr(err)
    }
    //捕获解析token失败的错误
    // if(err.name==='UnauthorizedError')return res.handleErr('身份认证失败')
    res.handleErr(err)
})
//启动服务器
app.listen(8080,()=>{
    console.log('启动服务');
})