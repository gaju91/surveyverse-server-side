const utility = function() {

}
const response = require('./response');
const error = require('./error');


utility.prototype.checkResult = (data) => {

    let output = { isError: false, isCustomException: false, result: data }

    if (data.length > 1) output = {...output, result: data }
    else if (data.length == 0) { output = {...output, result: data } } else if (data.length == 1) {
        if ('isexecuted' in data[0] || 'errorcode' in data[0]) {
            if (data[0].errorcode === "E0000") output = {...output, result: data }
            else {
                if (!data[0].errormsg || data[0].errormsg == "") {
                    output = {...output, isError: true }
                } else {
                    output = {...output, isError: true, isCustomException: true }
                }
            }
        } else {
            output = {...output, result: data }
        }
    }
    return output;
}

utility.prototype.geterrorresult = (error, res) => {
    if (error.isJoi) {
        return res.status(422).json(new response(new error(errorCode.invalidData, error.details[0].context.label, 17, null), null));
    }
    res.status(500).json(new response(new error(errorCode.server, error.errormsg || errorMessage[error.errorMessageCode || '1'], 1, error), null));
}

utility.prototype.throwerror = (error, res) => {
    if (error.isJoi) {
        return res.status(422).json(new response(new error(errorCode.invalidData, error.details[0].context.label, 17, null), null));
    } else if ('isexecuted' in error) {
        if (!error.isexecuted) {
            let isCustomException = false;
            if (!error.errormsg || error.errormsg == "" || error.errormsg == null) {
                isCustomException = false;
            } else {
                isCustomException = true;
            }
            let errorMessage = isCustomException ? error.errormsg : errorMessage[error.errorcode]
            res.status(500).json(new response(new error(errorCode.db, errorMessage, error.errorcode, error), null));
        } else {
            res.status(500).json(new response(new error(errorCode.server, errorMessage['1'], 1, error), null));
        }
    } else {
        res.status(500).json(new response(new commonController.error(errorCode.db, error.errormsg || errorMessage['E1240'], 'E1240', error), null));
    }
    throw new Error(error);
}

utility.prototype.getfinalresult = (error, result, req, res) => {
    let finalResult = utility.prototype.checkResult(result.rows, req._startTime, req.originalUrl, req.method, req.hostname);
    if (!finalResult.isError) {
        res.status(200).json(new response(null, finalResult.result));
    } else {
        let errorMessage = finalResult.isCustomException ? finalResult.result[0].errormsg : commonController.errorMessage[finalResult.result[0].errorcode]
        res.status(500).json(new response(new error(commonController.errorCode.db, errorMessage, finalResult.result[0].errorcode, error), null));
    }
}

module.exports = new utility();