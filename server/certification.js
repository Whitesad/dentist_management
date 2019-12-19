function certification() {
    var fs = require('fs');

    var privateKey  = fs.readFileSync('./cert/server.key', 'utf8');
    var certificate = fs.readFileSync('./cert/server.crt', 'utf8');
    var credential = {key: privateKey, cert: certificate};

    this.get_credentials=function () {
        return credential;
    };
}
module.exports=certification;