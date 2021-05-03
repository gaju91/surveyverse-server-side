function response(error, result) {
    this.error = error || null;
    this.result = result || null;
}

module.exports = response;

