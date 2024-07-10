function mapResult(data){

    if(data instanceof Array == false){
        let values = {}

        values["id"] = data.id

        Object.keys(data.data()).forEach((key) => {
            values[key] = data.data()[key]
        })

        return values;
    }

    if(data.length == 0){
        return [];
    }

    let result = []

    for(let register of data){
        let values = {}

        values["id"] = register.id

        Object.keys(register.data()).forEach((key) => {
            values[key] = register.data()[key]
        })

        result.push(values)
    }

    return result
}

module.exports = mapResult