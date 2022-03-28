/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
const db = require("../plugin/database"); 

// authentication for any access request
exports.authenticate = function(req, res, next){
    if (req.cookies.islogin) {
        // the user is logined
        // set session for current session
        req.session.passport = req.cookies.islogin; 
        let user = {name: req.session.passport.name};
        res.locals.user = user; 
    }
    else{
        req.session.passport = null;
        res.locals.user = null;
    }
    
    if (!req.session.passport) {
        // exempt specific url
        if( req.url == '/' || req.url == '/signup' || req.url == '/signup/email' ||
            req.url == '/login' || req.url == "/login/reset" || 
            req.url == "/login/reset/email" || req.url == "/login/reset/pwd" ){
            next();
        }
        else{
            res.redirect('/login');
        }
    }
    else if (req.session.passport) {
        // if the user is login, pass
        next();
    }

}

// use sid to find the user
exports.selectUserInfo = function( sid, callback){
    try{
        let _db = new db();
        let strSql = 'SELECT * FROM account WHERE BINARY sid="' + sid + '"';
        _db.doSelect( strSql, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}

// record sid, name, pwd and code in the db
exports.insertUser = function(sid, username, password, code, callback){
    try{
        let _db = new db();
        let strSql = 'INSERT INTO account ' + '(sid, name, password, gender, state, code) VALUES(?,?,?,?,?,?)';
        let params = [sid, username, password, 'F', 0, code];
        _db.doInsert(
            strSql,
            params,
            callback
        );
        _db = null;
    }
    catch(err){
        //logger.error('err: '+ err.error_msg);
        console.log(" some problems happen in function insertUser ");
        console.error(err);
    }
}  

// modify the default password and state, it will be used to active account
exports.updatePwdNameState = function(sid, username, password, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET name=? , password=?, state=? WHERE sid=? ';
        let params = [username, password, 1, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}


// update the code after resending of email
exports.updateCode = function( sid, code, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET code=? WHERE sid=?';
        let params = [code, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}

exports.updataName = function(sid, name, callback){
    try{
        let _db = new db();
        let strSql = "UPDATE account SET name=? WHERE sid=?";
        let params = [name, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}

exports.updatePwd = function( sid, pwd, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET password=? WHERE sid=?';
        let params = [pwd, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}

exports.updateGender = function( sid, gender, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET gender=? WHERE sid=?';
        let params = [gender, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}

exports.updateState = function( sid, callback){
    try{
        let _db = new db();
        let strSql = 'UPDATE account SET state=? WHERE sid=?';
        let params = [1, sid];
        _db.doUpdate(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}

exports.deleteUser = function(sid, callback){
    try{
        let _db = new db();
        let strSql = 'DELETE FROM account WHERE sid=?';
        let params = [sid];
        _db.doDelete(strSql, params, callback);
        _db = null;
    }
    catch(err){
        console.error(err);
    }
}
