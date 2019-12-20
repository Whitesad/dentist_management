function cookie(req,res) {
    var cookies = new require("cookies")(req, res);
    var isLogin= cookies.get("isLogin",{signed:true})
    
    this.is_login=function is_login() {
        if(isLogin)
            cookies.set(
                "is_login",
                true,
                {
                    signed:true,
                    maxAge:7*24*3600*1000,
                    overwrite:false,
                    path:"/"
                }
                )
        return isLogin
    }
    this.set_login_status=function set_login_status(account) {
        cookies.set(
            "is_login",
            true,
            {
                signed:true,
                maxAge:7*24*3600*1000,
                overwrite:false,
                path:"/"
            }
        )
        cookies.set(
            "username",
            account.username,
            {
                signed:true,
                maxAge:7*24*3600*1000,
                overwrite:false,
                path:"/"
            }
        )
        cookies.set(
            "identity_ID",
            account.identity_ID,
            {
                signed:true,
                maxage:7*24*3600*1000,
                overwrite:false,
                path:"/"
            }
        )
    }

    this.get_account=function get_account() {
        if(!isLogin)
            return false
        else
        {
            var account= {
                    username:cookies.get("username",{signed:true}),
                    identity_ID:cookies.get("identity_ID",{signed:true})
                };
            return account
        }
    }
}

module.exports=cookie;