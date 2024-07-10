function validator(validations,  page = undefined){
    return async (req, res, next) => {
        let result = []
        for(let validation of validations){
            let errors = await validation.run(req)
            result.push(errors.array()[0])
        }

        if(!result.every((value) => value == null)){
            req.session.errors = result
            if(!page){
                res.redirect("back")
            }else{
                res.redirect(page)
            }
        }else{
            next() 
        }
    }
}

module.exports = validator