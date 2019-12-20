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
//===============================================


// create application/x-www-form-urlencoded decoder
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.post('/login',urlencodedParser,function (req,res) {
    if(req.protocol === 'https') {
        console.log("A connect try to login")
        console.log("host:"+req.headers.host+"  servername:"+req.connection.servername)

        //var account = new json_ctrl(res.query)
        //var login_status = sql_ctrl.login(acconut)

        //test code
        // login_status={status:'success'}
        // account={username:"test02",identity_ID: '123'}

        if(login_status.status=='success')
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
//===============================================
app.post('/register',urlencodedParser,function (req,res) {
    if(req.protocol === 'https') {
        console.log("A connect try to register")
        console.log("host:"+req.headers.host+"  servername:"+req.connection.servername)

        var register_info=new json_ctrl(res.query)
        console.log(JSON.stringify(register_info))

        var register_status

        if(register_info.type==='doctor'){
            register_status=sql_ctrl.register_doctor(register_info)
        }else if(register_info.type==='patient'){
            register_status=sql_ctrl.register_patient(register_info)
        }

        console.log(register_status);
        console.log("\n\n")
        res.end(JSON.stringify(register_status));
    }
})

//===============================================
//***************query api**********************
//===============================================
app.post('/query/personal_info',urlencodedParser,function (req,res) {
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

            var query_info = new json_ctrl(res.query)
            console.log(JSON.stringify(query_info))

            if(query_info.type=='basical_info')
            {
                var personal_info=sql_ctrl.query_personal_info(account)

                console.log(personal_info)
                console.log("\n\n")
                return personal_info
            }
        }else
        {
            console.log("invalid query:no login!")
            console.log("\n\n")
            res.redirect('./login')
        }
    }
})