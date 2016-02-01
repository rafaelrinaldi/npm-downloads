import test from 'ava';
import npmDownloads from './src';

test(async t => {
  const downloads = await npmDownloads({module: 'ava'});
  const perDay = downloads[0].downloads;
  const perWeek = downloads[1].downloads;
  const perMonth = downloads[2].downloads;
  const valid = value => typeof value === 'number' && value > 0;

  t.ok(valid(perDay));
  t.ok(valid(perWeek));
  t.ok(valid(perMonth));
});
