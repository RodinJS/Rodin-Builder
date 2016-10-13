class CustomError {
    /**
     * @param {string} message
     * @param {string} phase
     * @param {Object} details
     */
    constructor(message, phase, details) {
        this.message = message;
        this.details = details;
        this.timestamp = Date.now();
    }
}

class FileReadError extends CustomError {
    constructor(file, phase) {
        super('File Read Error', phase, {file: file});
    }
}

class FileWriteError extends CustomError {
    constructor(file, phase) {
        super('File Write Error', phase, {file: file});
    }
}

class MKDIRError extends CustomError {
    constructor(folder, phase) {
        super('MKDIR Error', phase, {folder: folder});
    }
}

class CopyError extends CustomError {
    constructor(from, to, phase) {
        super('Copy Error', phase, {from: from, to: to});
    }
}

class BuildError extends CustomError {
    constructor(stdout, stderr) {
        super('Build Error', 'build', {stdout: stdout, stderr: stderr});
    }
}

module.exports.FileReadError = FileReadError;
module.exports.FileWriteError = FileWriteError;
module.exports.MKDIRError = MKDIRError;
module.exports.CopyError = CopyError;
module.exports.BuildError = BuildError;