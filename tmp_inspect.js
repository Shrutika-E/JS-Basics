const { chromium } = require('playwright');
(async()=>{
  const br=await chromium.launch();
  const p=await br.newPage();
  await p.goto('https://automationexercise.com/product_details/1',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);
  const body = await p.content();
  const snippet = body.split('\n').filter(line=>line.toLowerCase().includes('write your review') || line.toLowerCase().includes('review')).slice(0,50);
  console.log('lines containing review keyword', snippet.join('\n'));
  await br.close();
})();
