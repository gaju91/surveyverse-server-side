function error(name, message, number, dbError) {

    // if (typeof dbError == "string") {
    if (typeof dbError == ("object" && "string")) {
        dbError = { code: dbError.code || "", message: dbError.message || "", stack: dbError.stack || "" }
    } else if (Array.isArray(dbError)) {
        dbError = dbError
    } else {
        dbError = null
    }

    this.name = name;
    this.message = message;
    this.number = number;
    this.dbError = dbError;
}

module.exports = error;
