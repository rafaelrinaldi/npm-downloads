import test from 'ava';
import npmDownloads from './src';

test('test for valid package name', async t => {
  const downloads = await npmDownloads({module: 'ava'});
  const perDay = downloads[0].downloads;
  const perWeek = downloads[1].downloads;
  const perMonth = downloads[2].downloads;
  const valid = value => typeof value === 'number' && value > 0;

  t.ok(valid(perDay));
  t.ok(valid(perWeek));
  t.ok(valid(perMonth));
});

test('test for invalid package name', async t => {
  const hash = Number(new Date());
  const request = npmDownloads({module: `invalid-package-${hash}`});

  await request.catch(error => {
    t.same(error.message, 'nonexistent package');
  });
});

test('test for no package name', t => {
  npmDownloads({module: null}).catch(error => {
    t.same(error.message, 'module name required');
  });
});
