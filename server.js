//===============================================
//*************global module*********************
//===============================================
var cookies=require('./server/cookie')
var cookieParser = require('cookie-parser')


//===============================================
//*************global boject*********************
//===============================================
var app = require('express')();
app.use(cookieParser('test'));
app.keys=['yang']

var sql_ctrl=new require('./controller/sql_ctrl')()
var json_ctrl=new require('./controller/json_ctrl')()
var image_ctrl=new require('./controller/image_ctrl')()

// create application/x-www-form-urlencoded decoder
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//===============================================
//*************https server**********************
//===============================================

//create the cert
var certification=require('./server/certification');
var cert=new certification();

var https = require('https');
var httpsServer = https.createServer(cert.get_credentials(), app);
var PORT = 8002;
httpsServer.listen(PORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', PORT);
});

//===============================================
//*********login api*****************************
//登录api，登录后会创建加密cookie保证登录状态为1 week
//===============================================

app.post('/login',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        console.log("A connect try to login")
        console.log("host:"+req.headers.host+"  servername:"+req.connection.servername)

        var account={
            username:req.query.username,
            password:req.query.password,
            identity_ID:req.query.identity_ID
        }

        var login_status =await sql_ctrl.login(account)

        //test code
        // login_status={status:'success'}
        // account={username:"test02",identity_ID: '123',avatar:image_ctr(req.file)}

        if(login_status.status=='login_success')
        {
            //set login
            res.cookie("is_login",true,{signed:true,maxAge:7*24*3600*1000, overwrite:false, path:"/"})
            res.cookie("username", account.username, {signed:true, maxAge:7*24*3600*1000, overwrite:false, path:"/"})
            res.cookie("identity_ID", account.identity_ID, {signed:true, maxage:7*24*3600*1000, overwrite:false, path:"/"})
        }

        console.log(JSON.stringify(login_status))
        console.log("\n\n")
        res.send(login_status)
    }
})

//===============================================
//***************register api********************
//注册api，分为医生与病人
//===============================================

//病人注册api
app.post('/register/patient',urlencodedParser, async function (req,res) {
    if(req.protocol === 'https') {
        console.log("A connect try to register as patient")
        console.log("host:"+req.headers.host+"  servername:"+req.connection.servername)

        var avatar=await image_ctrl.sava_avatar(req.files.avatar)
        var ID_photo=await image_ctrl.save_identity_ID_image(req.files.ID_photo)
        var register_info={
            name:req.query.name,
            identity_ID:req.query.identity_ID,
            phonenumber:req.query.phonenumber,
            ID_photo:ID_photo,
            sex:req.query.sex,
            introduce:req.query.introduce,
            avatar:avatar
        }
        console.log(JSON.stringify(register_info))

        var register_status=await sql_ctrl.register_patient(register_info)

        console.log(register_status);
        console.log("\n\n")
        res.end(register_status);
    }
})

//医生注册api
app.post('/register/doctor',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        console.log("A connect try to register as patient")
        console.log("host:"+req.headers.host+"  servername:"+req.connection.servername)

        var avatar=await image_ctrl.sava_avatar(req.files.avatar)
        var ID_photo=await image_ctrl.save_identity_ID_image(req.files.ID_photo)
        var cert_photo=await image_ctrl.save_doctor_cert_image(req.files.cert_photo)
        var register_info={
            name:req.query.name,
            identity_ID:req.query.identity_ID,
            phonenumber:req.query.phonenumber,
            ID_photo:ID_photo,
            job_number:req.query.job_number,
            cert_photo:cert_photo,
            sex:req.query.sex,
            introduce:req.query.introduce,
            avatar:avatar
        }
        console.log(JSON.stringify(register_info))

        var register_status=await sql_ctrl.register_doctor(register_info)

        console.log(register_status);
        console.log("\n\n")
        res.end(register_status);
    }
})

//===============================================
//***************query api**********************
//===============================================

//查询个人信息
app.post('/query/personal_info',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        //if is login
        if(req.signedCookies['is_login']=='true')
        {
            //need try catch
            var account={
                username: req.signedCookies['username'],
                identity_ID:req.signedCookies['identity_ID']
            }
            console.log("username:"+account.username+"  identity_ID:"+account.identity_ID+"  try to query personal info.")
            console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

            var query_info ={
                type:req.query.type
            }
            console.log(JSON.stringify(query_info))

            if(query_info.type=='basical_info')
            {
                var personal_info=await sql_ctrl.query_personal_info(account)

                console.log(personal_info)
                console.log("\n\n")
                res.send(personal_info)
            }
        }else
        {
            console.log("invalid personal info query:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})

//查询诊疗记录
app.post('/query/treat_record',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        //if is login
        if(req.signedCookies['is_login']=='true')
        {
            //need try catch
            var account={
                username: req.signedCookies['username'],
                identity_ID:req.signedCookies['identity_ID']
            }
            console.log("username:"+account.username+"  identity_ID:"+account.identity_ID+"  try to query treat_record info.")
            console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

            var treat_query_info = {
                type:req.query.type
            }
            console.log(JSON.stringify(query_info))

            if(treat_query_info.type=='treat_list')
            {
                var treat_list_info=await sql_ctrl.query_treat_list_info(account);

                console.log(JSON.stringify(treat_list_info))
                console.log("\n\n")
                res.send(treat_list_info)
            }else if(treat_query_info.type=='treat_record')
            {
                var record={
                    PK:req.query.record_ID
                }

                var treat_record_info=await sql_ctrl.query_treat_record_info(record);

                console.log(JSON.stringify(treat_record_info));
                console.log("\n\n")
                res.send(treat_record_info)
            }
        }else
        {
            console.log("invalid treat record query:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})

//查询医生信息
app.post('/query/doctor_info',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        //if is login
        if(req.signedCookies['is_login']=='true')
        {
            //need try catch
            var account={
                username: req.signedCookies['username'],
                identity_ID:req.signedCookies['identity_ID']
            }
            console.log("username:"+account.username+"  identity_ID:"+account.identity_ID+"  try to query doctor info.")
            console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

            var doctor_query_info = {
                type:req.query.type
            }
            console.log(JSON.stringify(doctor_query_info))

            if(doctor_query_info.type=='doctor_list')
            {
                var doctor_list_info=await sql_ctrl.query_doctor_list_info();

                console.log(JSON.stringify(doctor_list_info))
                console.log("\n\n")
                res.send(doctor_list_info)
            }else if(doctor_query_info.type=='doctor_detail')
            {
                var doctor={
                    PK:req.query.doctor_ID,
                }

                var doctor_info=await sql_ctrl.query_doctor_info(doctor);

                console.log(JSON.stringify(doctor_info));
                console.log("\n\n")
                res.send(doctor_info)
            }
        }else
        {
            console.log("invalid doctor info query:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})

//查询公告信息
app.post('/query/annouce_info',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        console.log("A connect try to query the annouce")
        console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

        var annouce_info=await sql_ctrl.query_announce_info()
        console.log(JSON.stringify(annouce_info))
        console.log("\n\n")
        res.send(annouce_info)
    }
})

//查询预约信息
app.post('/query/doctor_info',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        //if is login
        if(req.signedCookies['is_login']=='true')
        {
            //need try catch
            var account={
                username: req.signedCookies['username'],
                identity_ID:req.signedCookies['identity_ID']
            }
            console.log("username:"+account.username+"  identity_ID:"+account.identity_ID+"  try to query reserve info.")
            console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

            var reserve_query_info = {
                type:req.query.type
            }
            console.log(JSON.stringify(reserve_query_info))

            if(reserve_query_info.type=='reserve_list')
            {
                var reserve_list_info=await sql_ctrl.query_reserve_list_info(account);

                console.log(JSON.stringify(reserve_list_info))
                console.log("\n\n")
                res.send(reserve_list_info)
            }else if(reserve_query_info.type=='reserve_detail')
            {
                var reserve={
                    PK:req.query.reserve_ID
                }
                var reserve_info=await sql_ctrl.query_reserve_info(reserve);

                console.log(JSON.stringify(reserve_info));
                console.log("\n\n")
                res.send(reserve_info)
            }
        }else
        {
            console.log("invalid reserve record query:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})


//===============================================
//***************reserve api**********************
//提供预约医生的功能
//===============================================

//进行预约
app.post('/reserve',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        //if is login
        if(req.signedCookies['is_login']=='true')
        {
            //need try catch
            var reserve_info=req.query

            var patient={
                name: req.signedCookies['username'],
                identity_ID:req.signedCookies['identity_ID']
            }

            var doctor={
                name:reserve_info.doctor_name,
                identity_ID:reserve_info.identity_ID
            }

            var time={
                day:reserve_info.day,
                period:reserve_info.period
            }

            console.log("username:"+patient.username+"  identity_ID:"+patient.identity_ID+"  try to make a reserve.")
            console.log(JSON.stringify(reserve_info))
            console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

            var reserve_status = await sql_ctrl.reserve(patient,doctor,time)

            console.log('update status:'+reserve_status.status)
            console.log('\n\n')
            res.send(reserve_status)
        }else
        {
            console.log("invalid doctor info query:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})

//===============================================
//***************update api**********************
//提供修改对数据库进行操作的权限，现在主要是修改个人信息
//===============================================

//更新个人信息
app.post('/update/personal_info',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        //if is login
        if(req.signedCookies['is_login']=='true')
        {
            //need try catch
            var avatar=await image_ctrl.sava_avatar(req.files.avatar)
            var register_info=req.query
            register_info['avatar']=avatar

            console.log("username:"+register_info.username+"  identity_ID:"+register_info.identity_ID+"  try to update personal info.")
            console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

            var update_status =await sql_ctrl.uptate_personal_info(register_info)

            console.log(JSON.stringify(register_info))
            console.log('update status:'+update_status.status)
            console.log('\n\n')
            res.send(update_status)
        }else
        {
            console.log("invalid personal info update:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})

//医生更新预约信息的表
app.post('/update/treat_record_info',urlencodedParser,async function (req,res) {
    if(req.protocol === 'https') {
        //if is login
        if(req.signedCookies['is_login']=='true')
        {
            var account={
                username: req.signedCookies['username'],
                identity_ID:req.signedCookies['identity_ID']
            }

            console.log("username:"+account.username+"  identity_ID:"+account.identity_ID+"  try to update treat record info.")
            console.log("host:" + req.headers.host + "  servername:" + req.connection.servername)

            var is_doctor=await sql_ctrl.is_doctor(account)

            if(is_doctor)
            {
                //need try catch

                var remark_photo=await sql_ctrl.save_treat_record_image(req.files)
                var record={
                    start_time:req.query.start_time,
                    end_time:req.query.end_time,
                    ispaid:req.query.ispaid,
                    cost:req.query.cost,
                    remark_describe:req.query.remark_describe,
                    remark_photo:remark_photo
                }

                var update_status =await sql_ctrl.uptate_treat_record_info(record)

                console.log(JSON.stringify(record))
                console.log('update status:'+update_status.status)
                console.log('\n\n')
                res.send(update_status)
            }else
            {
                console.log("invalid treat reserve update:no permission!")
                console.log("\n\n")
                res.redirect('./login')
            }


        }else
        {
            console.log("invalid treat reserve update:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})