async function run() {
  const res = await fetch('https://zenith-sigma-ruby.vercel.app/api/health');
  const data = await res.json();
  console.log('HEALTH_DIAGNOSTICS:', JSON.stringify(data, null, 2));
}
run().catch(console.error);
