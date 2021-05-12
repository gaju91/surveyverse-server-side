const utility = function () {

}
const response = require('./response');
const error = require('./error');
const errorMessage = require('./errorMessage.json');
const errorCode = require('./errorCode.json');


utility.prototype.checkResult = (arrResponseRows) => {

    let output = { isError: false, isCustomException: false, result: arrResponseRows }

    if (arrResponseRows.length > 1) output = { ...output, result: arrResponseRows }
    else if (arrResponseRows.length == 0) {
        output = { ...output, result: arrResponseRows }
    }
    else if (arrResponseRows.length == 1) {
        if ('isexecuted' in arrResponseRows[0] || 'errorcode' in arrResponseRows[0]) {
            if (arrResponseRows[0].errorcode === "E0000") output = { ...output, result: arrResponseRows }
            else {
                if (!arrResponseRows[0].errormsg || arrResponseRows[0].errormsg == "") {
                    output = { ...output, isError: true }
                } else {
                    output = { ...output, isError: true, isCustomException: true }
                }
            }
        } else {
            output = { ...output, result: arrResponseRows }
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
            let errorMsg = isCustomException ? error.errormsg : errorMessage[error.errorcode]
            res.status(500).json(new response(new error(errorCode.db, errorMsg, error.errorcode, error), null));
        } else {
            res.status(500).json(new response(new error(errorCode.server, errorMessage['1'], 1, error), null));
        }
    } else {
        res.status(500).json(new response(new error(errorCode.db, error.errormsg || errorMessage['E1240'], 'E1240', error), null));
    }
    throw new Error(error);
}

utility.prototype.getfinalresult = (err, result, req, res) => {
    let finalResult = utility.prototype.checkResult(result.rows);
    if (!finalResult.isError) {
        res.status(200).json(new response(null, finalResult.result));
    } else {
        let errorMsg = finalResult.isCustomException ? 
        finalResult.result[0].errormsg : errorMessage[finalResult.result[0].errorcode]
        res.status(500).json(new response(new error(errorCode.db, errorMsg, finalResult.result[0].errorcode, err), null));
    }
}

module.exports = new utility();