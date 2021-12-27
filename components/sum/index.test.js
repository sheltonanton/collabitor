import sum from 'components/sum';

test('sum of 1 + 2 = 3', () => {
    expect(sum(1,2)).toBe(3);
});

test('testing home page loading', async () => {
    // await page.goto('http://127.0.0.1:5500/index.html');
    // await page.screenshot({ path: 'example.png' });
});