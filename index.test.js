const npmDownloads = require('./')
const ErrorWithExitCode = require('./errorWithExitCode')

test('Should work for ordinary packages', async () => {
  expect.assertions(1)

  await expect(npmDownloads({ packageName: 'jquery' })).resolves.toEqual(
    expect.any(String)
  )
})

test('Should work for scoped packages', async () => {
  expect.assertions(1)

  await expect(
    npmDownloads({ packageName: '@rafaelrinaldi/whereami' })
  ).resolves.toEqual(expect.any(String))
})

test('Should fail for invalid package name', async () => {
  expect.assertions(1)

  await expect(
    npmDownloads({ packageName: '@rafaelrinaldi/invalid-package-name' })
  ).rejects.toThrow(ErrorWithExitCode)
})

test('Should properly render output as JSON if flag is on', async () => {
  expect.assertions(1)

  const output = await npmDownloads({ packageName: 'jquery', json: true })

  expect(JSON.parse(output)).toBeTruthy()
})
