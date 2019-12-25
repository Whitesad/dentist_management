var mysql = require('mysql');    //这里外加模块 mysql


/*出现的返回值*/
//var status;         //状态标签
//var personal_info ;   //个人信息
//var treat_list ;     //粗略的treat信息
//var treat_info;     //具体的treat信息
//var doctor_list;      //粗略的医生信息
//var doctor_info;     //具体的医生信息
//var announce_list;    //所有的公告信息
//var reserve_list;     //粗略的reserve信息
//var reserve_info;     //具体的reserve信息

/*出现的传入参数*/
//var account;   //用户账户
//var register_info ;//注册时填入的信息
//var record_detail;  //用它来得到具体的treat记录
//var doctor;      //医生对象
//var reserve;     //用reserve得到具体的reserve信息
//var patient;   //病人对象
//var time;      //时间对象
//var record;     //用record  更新一个 treat里的信息
//var chat;   //一句消息






/* 注册登陆部分 */
// 用户登陆部分   返回status
exports.login= function (account,callback) {
    ParamSql('SELECT user_id FROM SystemUser WHERE username=? AND identity_ID=?',
        [account.username,account.identity_ID], function (result) {
            if(result.length==0){
                callback({status:'non_exist_user'})
            }
            else {
                //先是检查用户名和identity_ID的用户是否存在
                //接着比对密码是否正确
                ParamSql('SELECT user_id FROM SystemUser WHERE username=? AND identity_ID=? AND password=?',
                    [account.username, account.identity_ID, account.password],function (result) {
                        if (result.length==0) {
                            callback({status:'wrong_password'})
                        }
                        else {
                            callback({status:'login_success'})
                        }
                    });
            }
        });
}

//病人注册部分     返回status
exports.register_patient = function (register_info) {





    var status;
    return  status;
}

//医生注册部分      返回status
exports.register_doctor = function (register_info) {



    return  status;
}
/* 注册登陆部分 */



/*查询部分*/
//个人信息查询（医生和病人都能用）  返回personal_info
exports.query_personal_info = function (account,callback) {
    ParamSql('SELECT user_type,name,identity_ID FROM SystemUser WHERE password=? AND username=? AND identity_ID=?',
        [account.password,account.username,account.identity_ID],function(result){
            //先是判断用户是医生还是病人
            //然后到各自的表查询
            if(result[0].user_type=='doctor'){
                ParamSql('SELECT name,identity_ID,phonenumber,avartar,ID_photo,sex,introduce FROM Doctor ' +
                    'WHERE name=? AND identity_ID=?',[result[0].name,result[0].identity_ID],callback);
            }
            else if(result[0].user_type=='patient'){
                ParamSql('SELECT name,identity_ID,phonenumber,avartar,ID_photo,sex,introduce FROM Patient ' +
                    'WHERE name=? AND identity_ID=?',[result[0].name,result[0].identity_ID],callback);
            }

        })
}

// 要查询有哪些treat  返回treat_list
exports.query_treat_list_info = function (account, callback) {
    ParamSql('SELECT user_type,name,identity_ID FROM SystemUser WHERE password=? AND username=? AND identity_ID=?',
        [account.password,account.username,account.identity_ID],function (result) {
            //先是判断用户类型
            if (result[0].user_type == 'doctor') {  //如果查询治疗记录的是医生
                ParamSql('SELECT tr_num,doctor_name,patient_name,start_time,end_time,ispaid,cost ' +
                    'FROM TreatRecord  WHERE doctor_name=? AND doctor_identity_ID=?'
                    , [result[0].name, result[0].identity_ID], callback);
            } else if (result[0].user_type == 'patient') {  //如果查询治疗记录的是病人
                ParamSql('SELECT tr_num,doctor_name,patient_name,start_time,end_time,ispaid,cost ' +
                    'FROM TreatRecord  WHERE patient_name=? AND patient_identity_ID=?'
                    , [result[0].name, result[0].identity_ID], callback);
            }
        })
}

//查询具体的treat的内容   返回 treat_info
exports.query_treat_record = function (record_detail,callback) {
    ParamSql('SELECT doctor_name ,start_time,end_time,ispaid,cost,remark_photo,remark_describe FROM ' +
        'TreatRecord WHERE tr_num=?',
        [record_detail.PK],callback);



}

//查询doctor的列表       返回 doctor
exports.query_doctor_list_info = function (callback) {
    SqlQuery('SELECT name,identity_ID FROM Doctor',callback);
}

//查询具体的某个医生     返回doctor_info
exports.query_doctor_info = function (doctor, callback) {
    ParamSql('SELECT name,phonenumber,avartar,job_number,sex,introduce FROM Doctor ' +
        'WHERE name=? AND identity_ID=?',[doctor.name, doctor.identity_ID], callback);
}

//查询所有的公告信息    返回announce_list
exports.query_announce_info = function (callback) {
    var sql = 'SELECT * FROM Resources';
    SqlQuery(sql, callback)
}

//查询预约信息表       返回reserve_list
exports.query_reserve_list_info = function (account) {
    ParamSql('SELECT user_type,name,identity_ID FROM SystemUser WHERE password=? AND username=? AND identity_ID=?',
        [account.password, account.username, account.identity_ID], function (result) {
            //先是判断用户类型
            if (result[0].user_type == 'doctor') {  //如果查询治疗记录的是医生
                ParamSql('SELECT p_id,start_time,end_time,order_time,status,is_available,remark_describe,remark_photo' +
                    ',doctor_name,doctor_identity_ID,patient_name,patient_identity_ID ' +
                    'FROM AppointmentContent  WHERE doctor_name=? AND doctor_identity_ID=?'
                    , [result[0].name, result[0].identity_ID], callback);
            } else if (result[0].user_type == 'patient') {  //如果查询治疗记录的是病人
                ParamSql('SELECT p_id,start_time,end_time,order_time,status,is_available,remark_describe,remark_photo' +
                    ',doctor_name,doctor_identity_ID,patient_name,patient_identity_ID ' +
                    'FROM AppointmentContent  WHERE patient_name=? AND patient_identity_ID=?'
                    , [result[0].name, result[0].identity_ID], callback);
            }
        });

}



//查询某个特定的预约      返回reserve_info
exports.query_reserve_info = function (reserve) {



    return  reserve_info;
}
/*查询部分*/




/*更新的部分*/
//更新个人信息      返回 status   //本地运行的时候要重连一下数据库
exports.update_personal_info = function (register_info,callback) {
    ParamSql('SELECT user_type FROM SystemUser WHERE name=? AND identity_ID=?'
        ,[register_info.name,register_info.identity_ID],function(result) {
            if (result.length == null) {
                callback( 'illegal_username');
            }
            //先是判断用户是医生还是病人
            if (result[0].user_type == 'doctor') {
                ParamSql(' UPDATE Doctor SET  phonenumber=?,avartar=?,ID_photo=?,' +
                    'sex=?,introduce=? WHERE name=? AND identity_ID=?',
                    [register_info.phonenumber, register_info.avartar, register_info.ID_photo
                        , register_info.sex, register_info.introduce, register_info.name, register_info.identity_ID],function(result){
                        //注意！由于不支持修改口令，也就不必修改SystemUser表
                        if(result.length==0) callback('update_pesonal_info_error');
                        else callback('update_personal_info_success')
                    })
            } else if (result[0].user_type == 'patient') {
                ParamSql(' UPDATE Patient SET  phonenumber=?,avartar=?,ID_photo=?,' +
                    'sex=?,introduce=? WHERE name=? AND identity_ID=?',
                    [register_info.phonenumber, register_info.avartar, register_info.ID_photo
                        , register_info.sex, register_info.introduce, register_info.name, register_info.identity_ID],function(result){
                        //注意！由于不支持修改口令，也就不必修改SystemUser表
                        console.log(result.affectedRows);
                        if(result.length==0) callback('update_pesonal_info_error');
                        else callback('update_personal_info_success')
                    })
            }


        });
}

//完成预约操作      返回reserve
exports.reserve = function (patient,doctor,time) {


    var satus='reserve_success';
    return  status;
}

//更新诊疗记录       返回status
exports.update_treat_record_info = function (record,callback) {
    ParamSql('INSERT INTO  TreatRecord (doctor_name,doctor_identity_ID,patient_name,patient_identity_ID,start_time,end_time,' +
        'ispaid,cost,remark_describe,remark_photo) VALUES(?,?,?,?,?,?,?,?,?,?)'
        ,[record.doctor_name,record.doctor_identity_ID,record.patient_name,record.patient_identity_ID,record.start_time,record.end_time,
            record.ispaid,record.cost,record.remark_describe,record.remark_photo],function(result){
            callback(result);
            if(result)  callback('update_treat_record_info_success');
            else callback('update_treat_record_info_error');


        })
}
/*更新的部分*/


/*保存聊天信息*/
//保存聊天信息    返回status

exports.save_chat_info = function (chat,callback) {
    var s_user_id;
    var r_user_id;
    ParamSql('SELECT user_id FROM SystemUser WHERE name=? AND identity_ID=?',
        [chat.sender.name,chat.sender.identity_ID],function(result) {
            s_user_id=result.user_id;
            ParamSql('SELECT user_id FROM SystemUser WHERE name=? AND identity_ID=?',
                [chat.receiver.name, chat.receiver.identity_ID],function(result){
                    r_user_id=result.user_id;
                    //先是找到发送者和接受者的user_id，然后进一步插入Chat表
                    ParamSql('INSERT INTO Chat(content,sender_user_id,receiver' +
                        '_user_id,time) VALUES(?,(SELECT user_id FROM SystemUser WHERE name=? AND identity_ID=?),(SELECT user_id FROM SystemUser WHERE name=? AND identity_ID=?),?)',
                        [chat.content, chat.sender.name,chat.sender.identity_ID, chat.receiver.name,chat.receiver.identity_ID, chat.time],function(result){
                            if(result) callback('save_chat_info_success');
                            else callback('save_chat_info_error');


                        });
                });
        });
}
/*保存聊天信息*/


/*下面是用到的sql板子*/
function SqlQuery(sql, callback){

    //var mysql      = require('mysql');    //这里外加模块 mysql
    var connection = mysql.createConnection({
        host     : 'localhost',  //主机地址
        user     : 'root',
        password : 'QAZwsx*/123',
        port  :  '3306' ,
        database : 'dentist_management'     //数据库名
    });
    connection.connect();
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        callback(result)
    });

    connection.end();
}  //查询整张表
function ParamSql(Sql,SqlParam,callback){
    //var mysql      = require('mysql');    //这里外加模块 mysql
    var connection = mysql.createConnection({
        host     : 'localhost',  //主机地址
        user     : 'root',
        password : 'QAZwsx*/123',
        port  :  '3306' ,
        database : 'dentist_management'     //数据库名
    });

    connection.connect();

    connection.query(Sql,SqlParam,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------DONE----------------------------');
        console.log(result);
        console.log('-----------------------------------------------------------------\n\n');
        callback(result)
    });

    connection.end();
}//按照传入的语句和参数进行操作


//还剩4个
//要完善的话还有好多要去做的