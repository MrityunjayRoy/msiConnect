class APIError extends Error{
    constructor(
        status,
        message,
        error,
        stack=""
    ){
        super(message)
        this.status = status
        this.stack = stack
        this.message = message
        this.error = error
    }
}

export {APIError}