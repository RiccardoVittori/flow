import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';
import { base } from '../site.config.mjs';

// Synthetic lab profile; requires scripts/serve-test.mjs. No field INP claim.
const browser = await chromium.launch();
const report = { generatedAt: new Date().toISOString(), runs: [] };
try {
  for (const configuration of [
    { width: 1440, height: 950, cpu: 1 },
    { width: 390, height: 844, cpu: 4 },
  ]) {
    const context = await browser.newContext({ viewport: configuration });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', {
      rate: configuration.cpu,
    });
    await cdp.send('Performance.enable');
    await page.addInitScript(() => {
      window.flowLongTasks = [];
      new window.PerformanceObserver((list) =>
        window.flowLongTasks.push(
          ...list.getEntries().map((entry) => ({
            start: entry.startTime,
            duration: entry.duration,
          })),
        ),
      ).observe({ type: 'longtask', buffered: true });
    });
    await page.goto('http://127.0.0.1:4321' + base);
    await page.evaluate(() => document.fonts.ready);
    const initial = await page.evaluate(() => ({
      resources: window.performance
        .getEntriesByType('resource')
        .map((entry) => ({ name: entry.name, bytes: entry.encodedBodySize })),
      image: document.querySelector('.forest-painting').currentSrc,
    }));
    const before = await cdp.send('Performance.getMetrics');
    const scrolling = await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const start = window.performance.now();
      const intervals = [];
      let last = start;
      await new Promise((resolve) => {
        const frame = (timestamp) => {
          intervals.push(timestamp - last);
          last = timestamp;
          window.scrollTo(
            0,
            Math.min(1, (timestamp - start) / 6000) *
              (document.documentElement.scrollHeight - window.innerHeight),
          );
          if (timestamp - start < 6000) window.requestAnimationFrame(frame);
          else resolve();
        };
        window.requestAnimationFrame(frame);
      });
      const values = intervals
        .filter((value) => value > 0)
        .sort((a, b) => a - b);
      return {
        duration: window.performance.now() - start,
        frames: values.length,
        medianFrameMs: values[Math.floor(values.length * 0.5)],
        p95FrameMs: values[Math.floor(values.length * 0.95)],
        framesOver50ms: values.filter((value) => value > 50).length,
        longTasks: window.flowLongTasks.filter((task) => task.start >= start),
      };
    });
    const after = await cdp.send('Performance.getMetrics');
    const metric = (data, name) =>
      data.metrics.find((entry) => entry.name === name)?.value || 0;
    const resources = await page.evaluate(() =>
      window.performance
        .getEntriesByType('resource')
        .map((entry) => ({ name: entry.name, bytes: entry.encodedBodySize })),
    );
    report.runs.push({
      configuration,
      initial,
      scrolling,
      layoutCount: metric(after, 'LayoutCount') - metric(before, 'LayoutCount'),
      styleRecalcCount:
        metric(after, 'RecalcStyleCount') - metric(before, 'RecalcStyleCount'),
      jsHeapBytes: metric(after, 'JSHeapUsedSize'),
      resources,
    });
    await context.close();
  }
  report.bundles = fs
    .readdirSync('dist/_astro')
    .filter((name) => name.endsWith('.js'))
    .map((name) => {
      const bytes = fs.readFileSync('dist/_astro/' + name);
      return { name, raw: bytes.length, gzip: gzipSync(bytes).length };
    });
  fs.writeFileSync(
    'artifacts/immersive-profile.json',
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        runs: report.runs.map((run) => ({
          configuration: run.configuration,
          scrolling: run.scrolling,
          layoutCount: run.layoutCount,
          jsHeapBytes: run.jsHeapBytes,
          initialBytes: run.initial.resources.reduce(
            (sum, r) => sum + r.bytes,
            0,
          ),
          allBytes: run.resources.reduce((sum, r) => sum + r.bytes, 0),
        })),
        bundles: report.bundles,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
