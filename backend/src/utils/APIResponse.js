class APIResponse {
    constructor(
        statusCode,
        message,
        data
    ) {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.sucess = statusCode < 400
    }
}

export {APIResponse}