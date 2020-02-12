let Validator = (request, ...reqArr) => {
    return new Promise((resolve, reject) => {
        for(let req of reqArr) {
            if(request[req] instanceof Array && !request[req].length) {
                reject(false);
                break;
            } else if(request[req] instanceof Object && !Object.keys(request[req]).length ) {
                reject(false);
                break;
            } else if(!request[req]) {
                reject(false);
                break;
            }
        }
        resolve(true);
    })
}


let ResponseWOData = (res, code, message) => {
    res.status(code).json({message: message});
}

let ResponseWData = (res, code, message, data) => {
    res.status(code).json({message: message, data: data});
}

module.exports = {
    ResponseWOData,
    ResponseWData,
    Validator
}