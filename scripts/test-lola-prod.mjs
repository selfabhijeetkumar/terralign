async function testLolaProducts() {
  const url = 'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&ihid=LRO&iid=LOLA&pt=GDRDEM&results=m&maxresults=1&output=JSON';
  const res = await fetch(url, { headers: { 'User-Agent': 'TERRALIGN/1.0' } });
  const data = await res.json();
  console.log('LOLA Product Query Status:', data?.ODEResults?.Status);
  console.log('Count:', data?.ODEResults?.Count);
  const prod = data?.ODEResults?.Products?.Product?.[0];
  if (prod) {
    console.log('Product ID:', prod.pdsid);
    console.log('Description:', prod.Description?.slice(0, 200));
    console.log('Center lat/lon:', prod.Center_latitude, prod.Center_longitude);
  } else {
    console.log('Raw:', JSON.stringify(data).slice(0, 300));
  }
}

testLolaProducts();
