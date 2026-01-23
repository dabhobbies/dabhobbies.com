const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'sanity-products.ndjson');
const outputFile = path.join(__dirname, 'sanity-products-converted.ndjson');

// Category mapping: category name -> category ID
const categoryMapping = {
  'accesories': 'productCategory-accessories',
  'accessories': 'productCategory-accessories',
  'boots': 'productCategory-boots',
  'cargo equipment': 'productCategory-cargo-equipment',
  'eye wear': 'productCategory-eyewear',
  'eyewear': 'productCategory-eyewear',
  'gloves': 'productCategory-gloves',
  'helmets': 'productCategory-helmets',
  'inner suit': 'productCategory-inner-suit',
  'intercom': 'productCategory-intercom',
  'jackets': 'productCategory-jackets',
  'others': 'productCategory-others',
  'pants': 'productCategory-pants',
  'parts helmet': 'productCategory-helmet-parts',
  'phone holder': 'productCategory-phone-holders',
  'protector': 'productCategory-protector',
  'rain suit': 'productCategory-rain-suit',
  'spotlight': 'productCategory-spotlight',
  'storages': 'productCategory-storages',
  'tires': 'productCategory-tires',
  'vest': 'productCategory-vest',
};

// Helper function to generate a unique key for Portable Text blocks
function generateKey() {
  return Math.random().toString(36).substring(2, 12);
}

// Convert plain text description to Portable Text format
function convertToPortableText(text) {
  if (!text || typeof text !== 'string') return [];
  
  // Split text into paragraphs by double newline or single newline
  const paragraphs = text.split(/\n+/).filter(p => p.trim());
  
  return paragraphs.map(paragraph => ({
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: generateKey(),
        text: paragraph.trim(),
        marks: []
      }
    ]
  }));
}

// Read and process the input file
const inputContent = fs.readFileSync(inputFile, 'utf-8');
const lines = inputContent.trim().split('\n');

const outputLines = [];
const categories = new Set();
const allCategories = [];

lines.forEach((line, index) => {
  if (!line.trim()) return;
  
  try {
    const product = JSON.parse(line);
    
    // 1. Rename 'title' to 'name'
    if (product.title) {
      product.name = product.title;
      delete product.title;
    }
    
    // 2. Convert 'category' string to reference
    if (product.category && typeof product.category === 'string') {
      const categoryKey = product.category.toLowerCase();
      categories.add(categoryKey);
      
      const categoryId = categoryMapping[categoryKey];
      if (categoryId) {
        product.category = {
          _type: 'reference',
          _ref: categoryId
        };
      } else {
        // Use 'others' as fallback
        console.warn(`Unknown category: ${product.category}, using 'others'`);
        product.category = {
          _type: 'reference',
          _ref: 'productCategory-others'
        };
      }
    }
    
    // 3. Convert 'description' to Portable Text format
    if (product.description && typeof product.description === 'string') {
      product.description = convertToPortableText(product.description);
    }
    
    // 4. Add brand reference if not present (use 'others' as default)
    if (!product.brand) {
      product.brand = {
        _type: 'reference',
        _ref: 'productBrand-others'
      };
    }
    
    // 5. Add _key to each image in the images array
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map(img => ({
        ...img,
        _key: generateKey()
      }));
    }
    
    outputLines.push(JSON.stringify(product));
  } catch (error) {
    console.error(`Error processing line ${index + 1}:`, error.message);
  }
});

// Write converted products
fs.writeFileSync(outputFile, outputLines.join('\n') + '\n');

console.log(`Converted ${outputLines.length} products`);
console.log(`Output written to: ${outputFile}`);
console.log('\nUnique categories found:', Array.from(categories).sort());

// Generate categories NDJSON
const categoriesOutput = [];
categories.forEach(cat => {
  const categoryId = categoryMapping[cat];
  if (categoryId) {
    const categoryName = cat.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    allCategories.push({
      _type: 'productCategory',
      _id: categoryId,
      name: categoryName
    });
  }
});

// Write categories file
const categoriesFile = path.join(__dirname, '..', 'categories-new.ndjson');
const uniqueCategories = [...new Map(allCategories.map(c => [c._id, c])).values()];
fs.writeFileSync(categoriesFile, uniqueCategories.map(c => JSON.stringify(c)).join('\n') + '\n');
console.log(`\nGenerated categories file: ${categoriesFile}`);
console.log(`Categories:`, uniqueCategories.map(c => c.name));
