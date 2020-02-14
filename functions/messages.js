require('colors')

function warning(message,from){
    console.log(`[${from}]  ${message}`.yellow)
}

function error(message,from){
    console.log(`[${from}]  ${message}`.red)
}

function info(message,from){
    console.log(`[${from}]  ${message}`.blue)
}

function success(message,from){
    console.log(`[${from}]  ${message}`.green)
}

exports.warning = warning
exports.error = error
exports.info = info
exports.success = success