import puppeteer from 'puppeteer';

describe('Homepage', () => {
  it('it should have logo text', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8000');
    await page.waitForSelector('h1');
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain('<h1>人员管理系统</h1>');
    await page.close();
    browser.close();
  });
});
