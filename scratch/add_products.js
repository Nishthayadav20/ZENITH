const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDdhMjk1NjE5ZTIyMzIzNTJiYzI0ZCIsIm5hbWUiOiJBZG1pbiBBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbkB6ZW5pdGguY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzgzMDk4MjM4LCJleHAiOjE3ODU2OTAyMzh9.FNIXFN5kulbFrUk2d1navYYR8udAP9W64c_jGH05LTk';

const p1 = {
  name: 'Khroniq Silver Blue Edition',
  price: 4999,
  stock: 10,
  category: 'Khronomaster',
  gender: 'men',
  description: 'A masterpiece with a blue textured dial and silver finish.',
  image: '/assets/new_featured_watch_1.png',
  specs: {
    movement: 'Automatic',
    case: 'Stainless Steel',
    strap: 'Leather Strap',
    waterResistance: '50m',
    glass: 'Sapphire Crystal'
  },
  customizable: true,
  discountPercent: 0,
  badge: 'Featured'
};

const p2 = {
  name: 'Khroniq Azure Classic',
  price: 5200,
  stock: 5,
  category: 'Heritage',
  gender: 'unisex',
  description: 'Classic heritage design with modern blue dial.',
  image: '/assets/new_featured_watch_2.png',
  specs: {
    movement: 'Automatic',
    case: 'Stainless Steel',
    strap: 'Leather Strap',
    waterResistance: '30m',
    glass: 'Sapphire Crystal'
  },
  customizable: false,
  discountPercent: 5,
  badge: 'Limited Edition'
};

async function add() {
  for (let p of [p1, p2]) {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      console.log('Added:', data.success ? data.product.name : data.message);
    } catch (e) {
      console.log('Error adding product:', e);
    }
  }
}

add();
