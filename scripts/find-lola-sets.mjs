async function getLROInstruments() {
  const url = 'https://oderest.rsl.wustl.edu/live2/?target=moon&query=inst&output=JSON';
  const res = await fetch(url, { headers: { 'User-Agent': 'TERRALIGN/1.0' } });
  const data = await res.json();
  const sets = data?.ODEResults?.IIPTSets?.IIPTSet || [];
  const lolaSets = sets.filter(s => s.IHID === 'LRO' && s.IID?.includes('LOLA'));
  console.log(`Found ${lolaSets.length} LOLA sets for LRO:`);
  for (const s of lolaSets) {
    console.log(`  IID: ${s.IID} | PT: ${s.PT} | PTName: ${s.PTName} | DataSetId: ${s.DataSetId}`);
  }
}

getLROInstruments();
