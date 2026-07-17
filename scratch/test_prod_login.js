async function testProdLogin() {
  try {
    const res = await fetch('https://zenith-sigma-ruby.vercel.app/api/health');
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testProdLogin();
