//===============================================
//*************global boject*********************
//===============================================
var app = require('express')();
var sql_ctrl=require('./controller/sql_ctrl')
var json_ctrl=require('./controller/json_ctrl')


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

        var acconut = new json_ctrl(res.query)
        var login_status = sql_ctrl.login(acconut)
        if(login_status.status==='success')
        {
            //set cookie
            //pass
            //pass

        }

        console.log(JSON.stringify(login_status))
        console.log("\n\n")
        res.send(result)
    }
})


//===============================================
//***************register api********************
//===============================================
app.post('/register',urlencodedParser,function (req,res) {
    if(req.protocol === 'https') {
        console.log("A connect try to regigster")
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
//***************register api********************
//===============================================
