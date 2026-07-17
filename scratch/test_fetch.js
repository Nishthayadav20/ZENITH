async function run() {
  try {
    const res = await fetch('https://zenith-sigma-ruby.vercel.app/api/products');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('JSON success:', data.success);
    console.log('Number of products:', data.products ? data.products.length : 'N/A');
    if (data.products) {
      console.log('Product names:', data.products.map(p => p.name));
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

run();
