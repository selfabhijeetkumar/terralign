async function testODE() {
  const urls = [
    // Moon LOLA product query
    'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&ihid=LRO&iid=LOLA&pt=RDR&maxresults=2&output=JSON',
    // Moon LOLA point elevation query (ptv)
    'https://oderest.rsl.wustl.edu/live2/?target=moon&query=ptv&lat=-89.9&lon=0.0&output=JSON',
    // Mars MOLA product query
    'https://oderest.rsl.wustl.edu/live2/?target=mars&query=product&ihid=MGS&iid=MOLA&pt=MEGDR&maxresults=2&output=JSON',
    // Mars MOLA point elevation query
    'https://oderest.rsl.wustl.edu/live2/?target=mars&query=ptv&lat=18.38&lon=77.58&output=JSON',
  ];

  for (const url of urls) {
    console.log(`\nFetching: ${url}`);
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'TERRALIGN/1.0 (NASA Space Apps Challenge; Scientific Research Prototype)' }
      });
      clearTimeout(tid);
      const text = await res.text();
      console.log(`Status: HTTP ${res.status} (${text.length} bytes)`);
      console.log(text.slice(0, 350));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testODE();
