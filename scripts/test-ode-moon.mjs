async function testMoonODE() {
  // Let's test valid instruments and product types for Moon
  const urls = [
    'https://oderest.rsl.wustl.edu/live2/?target=moon&query=inst&output=JSON',
    'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&ihid=LRO&maxresults=1&output=JSON',
    'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&pdsid=LOLA&maxresults=1&output=JSON',
    'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&keyword=LDEM&maxresults=1&results=m&output=JSON',
  ];

  for (const url of urls) {
    console.log(`\nFetching: ${url}`);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'TERRALIGN/1.0' } });
      const data = await res.json();
      console.log('Result:', JSON.stringify(data).slice(0, 400));
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

testMoonODE();
