class ErrorWithExitCode extends Error {
  constructor (exitCode = 1, ...rest) {
    super(...rest)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorWithExitCode)
    }
    this.exitCode = exitCode
  }
}

module.exports = ErrorWithExitCode
