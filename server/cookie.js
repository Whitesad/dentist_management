function cookie(req,res) {
    var req_cookies = req.signedCookies
    var res_cookies=res.cookie

    var isLogin= req_cookies.isLogin
    
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
        res.cookie(
            "is_login",
            true,
            {
                signed:true,
                maxAge:7*24*3600*1000,
                overwrite:false,
                path:"/"
            }
        )
        res.cookie(
            "username",
            account.username,
            {
                signed:true,
                maxAge:7*24*3600*1000,
                overwrite:false,
                path:"/"
            }
        )
        res.cookie(
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
                    username:req_cookies.username,
                    identity_ID:req_cookies.identity_ID
                };
            return account
        }
    }
}

module.exports=cookie;