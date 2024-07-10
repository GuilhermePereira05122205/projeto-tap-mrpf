function authenticate(req, res, next){
    if(!req.session || !req.session.user){
        res.redirect("/users/login")        
    }else{
        next()
    }
}

module.exports = authenticate