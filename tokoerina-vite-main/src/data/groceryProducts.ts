export const groceryCategories = [
  'Semua',
  'Beras & Bahan Pokok',
  'Minyak & Bumbu',
  'Mie & Instan',
  'Minuman',
  'Kebersihan',
]

export const defaultGroceryProducts = [
  {
    id: 'grocery-rice-5kg',
    name: 'Beras Premium 5 kg',
    flavor: 'Beras & Bahan Pokok',
    description: 'Beras putih pulen untuk kebutuhan makan keluarga sehari-hari.',
    price: '72000',
    stock_status: 'available',
    is_featured: true,
    image_url:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'grocery-sugar-1kg',
    name: 'Gula Pasir 1 kg',
    flavor: 'Beras & Bahan Pokok',
    description: 'Gula pasir bersih untuk minuman, masakan, dan kue rumahan.',
    price: '17000',
    stock_status: 'available',
    is_featured: false,
    image_url:
      'https://images.unsplash.com/photo-1581268497089-7a975fb491a3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'grocery-cooking-oil-2l',
    name: 'Minyak Goreng 2 Liter',
    flavor: 'Minyak & Bumbu',
    description: 'Minyak goreng kemasan untuk kebutuhan memasak harian.',
    price: '36000',
    stock_status: 'limited',
    is_featured: true,
    image_url:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'grocery-instant-noodle',
    name: 'Mie Instan Goreng',
    flavor: 'Mie & Instan',
    description: 'Mie instan praktis dengan bumbu gurih untuk stok di rumah.',
    price: '3500',
    stock_status: 'available',
    is_featured: false,
    image_url:
      'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'grocery-tea-box',
    name: 'Teh Celup Kotak',
    flavor: 'Minuman',
    description: 'Teh celup aroma segar, cocok untuk diminum pagi atau sore.',
    price: '14500',
    stock_status: 'available',
    is_featured: false,
    image_url:
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'grocery-dish-soap',
    name: 'Sabun Cuci Piring',
    flavor: 'Kebersihan',
    description: 'Sabun cuci piring cair untuk membersihkan minyak dan noda.',
    price: '12000',
    stock_status: 'available',
    is_featured: false,
    image_url:
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
  },
]

const dessertKeywords = [
  'cake',
  'cheese',
  'cheesecake',
  'cupcake',
  'velvet',
  'matcha',
  'vanilla',
  'strawberry',
  'dessert',
  'frosting',
]

export const isDessertProduct = (product: any) => {
  const text = `${product.name || ''} ${product.flavor || ''} ${
    product.description || ''
  }`.toLowerCase()

  return dessertKeywords.some((keyword) => text.includes(keyword))
}
