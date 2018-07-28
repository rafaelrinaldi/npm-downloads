const ErrorWithExitCode = require('./errorWithExitCode')
const got = require('got')
const baseUrl = 'api.npmjs.org/downloads/point'

const get = url => got(url, { timeout: 5000, json: true })

const parseErrorMessage = (error, packageName) => {
  const mapCodeOrStatusCodeToErrorMessage = {
    404: `Package "${packageName}" was not found`,
    ETIMEDOUT: 'Timed out'
  }

  return (
    mapCodeOrStatusCodeToErrorMessage[error.code || error.statusCode] ||
    error.statusMessage
  )
}

const parseExitCode = error => {
  const mapCodeOrStatusCodeToExitCode = {
    404: 1,
    ETIMEDOUT: 2
  }

  return mapCodeOrStatusCodeToExitCode[error.code || error.statusCode] || 3
}

const parseDownloads = period => period.body.downloads.toLocaleString() || 0

const parseOutput = (
  { lastDay, lastWeek, lastMonth },
  packageName
) => `Downloads for the "${packageName}" package on npm:

   Last day:\t${parseDownloads(lastDay)}
  Last week:\t${parseDownloads(lastWeek)}
 Last month:\t${parseDownloads(lastMonth)}`

const parseJsonOutput = (downloads, packageName) =>
  JSON.stringify(
    Object.keys(downloads).reduce(
      (prev, next) => ({
        ...prev,
        [next]: parseDownloads(downloads[next])
      }),
      { packageName }
    ),
    null,
    2
  )

const npmDownloads = async ({ packageName, json = false }) => {
  try {
    const [lastDay, lastWeek, lastMonth] = await Promise.all([
      get(`${baseUrl}/last-day/${packageName}`),
      get(`${baseUrl}/last-week/${packageName}`),
      get(`${baseUrl}/last-month/${packageName}`)
    ])

    const downloads = { lastDay, lastWeek, lastMonth }

    return (json ? parseJsonOutput : parseOutput)(downloads, packageName)
  } catch (error) {
    const exitCode = parseExitCode(error)
    const message = parseErrorMessage(error, packageName)

    throw new ErrorWithExitCode(exitCode, message)
  }
}

module.exports = npmDownloads
