exports.successResponse = function(messages = '', extras = {} ,user) {
    var response = {
        success: true,
        messages,
        user
    }
    response = {...response, ...extras}
    return response
}
exports.errorResponse = function(messages = '', data = []) {
    var response = {
        success: false,
        data,
        messages
    }
    return response
}