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
        this.phase = phase;
    }
}

class FileReadError extends CustomError {
    constructor(file, phase) {
        super('FILEREADERR', phase, {file: file});
    }
}

class FileWriteError extends CustomError {
    constructor(file, phase) {
        super('FILEWRITEERR', phase, {file: file});
    }
}

class MKDIRError extends CustomError {
    constructor(folder, phase) {
        super('MKDIRERR', phase, {folder: folder});
    }
}

class RMDIRError extends CustomError {
    constructor(folder, phase) {
        super('RMDIRERR', phase, {folder: folder});
    }
}

class RMError extends CustomError {
    constructor(from, to, phase) {
        super('RMERROR', phase, {from, to});
    }
}

class CopyError extends CustomError {
    constructor(from, to, phase) {
        super('CPERR', phase, {from: from, to: to});
    }
}

class BuildError extends CustomError {
    constructor(stdout, stderr) {
        super('BUILDERROR', 'build', {stdout: stdout, stderr: stderr});
    }
}

class CleanError extends CustomError {
    constructor(stdout, stderr) {
        super('CLEANERROR', 'clean', {stdout: stdout, stderr: stderr});
    }
}

class CertImportError extends CustomError {
    constructor() {
        super('CERTIMPORTERROR', 'certimport');
    }
}

module.exports.FileReadError = FileReadError;
module.exports.FileWriteError = FileWriteError;
module.exports.MKDIRError = MKDIRError;
module.exports.RMDIRError = RMDIRError;
module.exports.CopyError = CopyError;
module.exports.RMError = RMError;
module.exports.BuildError = BuildError;
module.exports.CleanError = CleanError;
module.exports.CertImportError = CertImportError;