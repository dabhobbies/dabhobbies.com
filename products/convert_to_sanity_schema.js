const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'sanity-products.ndjson');
const outputFile = path.join(__dirname, 'sanity-products-ready.ndjson');

// Category mapping to match schema expectations
const categoryMapping = {
    'accesories': 'Accesories',
    'accessories': 'Accesories',
    'boots': 'Boots',
    'cargo equipment': 'Storage',
    'eye wear': 'Accesories',
    'eyewear': 'Accesories',
    'gloves': 'Gloves',
    'helmets': 'Helmets',
    'inner suit': 'Suits',
    'intercom': 'Intercom',
    'jackets': 'Jackets',
    'others': 'Accesories',
    'pants': 'Pants',
    'parts helmet': 'Helmets',
    'phone holder': 'Accesories',
    'protector': 'Protector',
    'rain suit': 'Rainsuit',
    'spotlight': 'Accesories',
    'storages': 'Storage',
    'tires': 'Accesories',
    'vest': 'Vest',
};

// Read and process the input file
const inputContent = fs.readFileSync(inputFile, 'utf-8');
const lines = inputContent.trim().split('\n');

const outputLines = [];
let successCount = 0;
let errorCount = 0;

lines.forEach((line, index) => {
    if (!line.trim()) return;

    try {
        const product = JSON.parse(line);

        // Create new product object matching schema
        const newProduct = {
            _type: 'product',
            _id: product._id,

            // Name (from title)
            name: product.title || product.name || 'Unnamed Product',

            // Slug
            slug: product.slug,

            // Image - take first image from images array or use placeholder
            image: null, // Will be set below

            // Brand - convert to string
            brand: extractBrandName(product.brand) || 'Universal',

            // Category - convert to string matching schema list
            category: convertCategory(product.category),

            // Description - extract as plain text (max 200 chars)
            description: extractDescription(product.description, 200),

            // Long Description - full text
            longDescription: extractDescription(product.description),

            // Price
            price: product.price || 0,

            // Rating - default to random 3-5
            rating: Math.floor(Math.random() * 3) + 3,

            // Review Count - default to random 0-50
            reviewCount: Math.floor(Math.random() * 51),

            // Sizes - ensure at least one size
            sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['Universal'],

            // Colors - default colors
            colors: product.colors && product.colors.length > 0 ? product.colors : ['Black'],

            // Gender - default to Unisex
            gender: product.gender || 'Unisex',

            // Weight - default 0.5kg
            weight: product.weight || 0.5,
        };

        // Handle image
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            const firstImage = product.images[0];
            newProduct.image = {
                _type: 'image',
                _sanityAsset: firstImage._sanityAsset || firstImage.asset?._ref
            };
        }

        // Optional fields
        if (product.materials && product.materials.length > 0) {
            newProduct.materials = product.materials;
        }
        if (product.protection && product.protection.length > 0) {
            newProduct.protection = product.protection;
        }
        if (product.certification) {
            newProduct.certification = product.certification;
        }
        if (product.specialFeatures && product.specialFeatures.length > 0) {
            newProduct.specialFeatures = product.specialFeatures;
        }

        outputLines.push(JSON.stringify(newProduct));
        successCount++;
    } catch (error) {
        console.error(`Error processing line ${index + 1}:`, error.message);
        errorCount++;
    }
});

// Helper function to extract brand name
function extractBrandName(brand) {
    if (!brand) return null;
    if (typeof brand === 'string') return brand;
    // If it's a reference, extract from _ref
    if (brand._ref) {
        return brand._ref.replace('productBrand-', '').replace(/-/g, ' ');
    }
    return 'Universal';
}

// Helper function to convert category
function convertCategory(category) {
    if (!category) return 'Accesories';

    if (typeof category === 'string') {
        const key = category.toLowerCase();
        return categoryMapping[key] || 'Accesories';
    }

    // If it's a reference, extract from _ref
    if (category._ref) {
        const key = category._ref.replace('productCategory-', '').replace(/-/g, ' ');
        return categoryMapping[key] || 'Accesories';
    }

    return 'Accesories';
}

// Helper function to extract description as plain text
function extractDescription(description, maxLength = 0) {
    if (!description) return 'No description available.';

    // If already a string
    if (typeof description === 'string') {
        if (maxLength > 0 && description.length > maxLength) {
            return description.substring(0, maxLength - 3) + '...';
        }
        return description;
    }

    // If Portable Text (array of blocks)
    if (Array.isArray(description)) {
        const text = description
            .filter(block => block._type === 'block')
            .map(block => {
                if (block.children && Array.isArray(block.children)) {
                    return block.children
                        .filter(child => child._type === 'span')
                        .map(span => span.text)
                        .join('');
                }
                return '';
            })
            .join(' ')
            .trim();

        if (maxLength > 0 && text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text || 'No description available.';
    }

    return 'No description available.';
}

// Write output
fs.writeFileSync(outputFile, outputLines.join('\n') + '\n');

console.log(`\n=== Conversion Complete ===`);
console.log(`Successfully converted: ${successCount} products`);
console.log(`Errors: ${errorCount}`);
console.log(`Output file: ${outputFile}`);
