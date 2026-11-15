async function testProductTypes() {
  const urls = [
    // Moon product types
    'https://oderest.rsl.wustl.edu/live2/?target=moon&query=pt&ihid=LRO&iid=LOLA&output=JSON',
    // Mars MEGDR with results
    'https://oderest.rsl.wustl.edu/live2/?target=mars&query=product&ihid=MGS&iid=MOLA&pt=MEGDR&results=m&maxresults=1&output=JSON',
  ];

  for (const url of urls) {
    console.log(`\nFetching: ${url}`);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'TERRALIGN/1.0 (NASA Space Apps Challenge)' }
      });
      const data = await res.json();
      console.log('Result:', JSON.stringify(data, null, 2).slice(0, 800));
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

testProductTypes();
