class ApiError extends Error {

    constructor (
        statusCode , 
        massege = "something went wrong" , 
        errors = [] , 
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null 
        this.message = message
        this.success = false
        this.errors = errors 
    }

}

export {ApiError}