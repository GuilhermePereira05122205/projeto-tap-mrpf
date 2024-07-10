const helpers = {
    verify(valor1, valor2){
        if(valor1 == valor2){
            return true
        }else{
            return false
        }
    },
    error(field){
        if(!this.errors){
            return null
        }
        for(let error of this.errors){
            if(error == null){
                continue
            }
            if(error.path == field){
                return error.msg
            }
        }

        return null;
    }
}

module.exports = helpers