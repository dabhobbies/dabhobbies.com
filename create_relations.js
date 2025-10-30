
const fs = require('fs');
const path = require('path');

const productsDir = 'import_products';
const relationsPath = 'relations.ndjson';

const brands = new Set();
const categories = new Set();

// Clear the relations file before starting
fs.writeFileSync(relationsPath, '');

function processDirectory(directory) {
    const items = fs.readdirSync(directory, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(directory, item.name);
        if (item.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.name === 'product.json') {
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            const data = JSON.parse(fileContent);
            if (data.brand) {
                brands.add(data.brand);
            }
            if (data.category) {
                categories.add(data.category);
            }
        }
    }
}

// Start processing from the root products directory
processDirectory(productsDir);

// Create Brand documents
brands.forEach(brandName => {
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const brandDoc = {
        _id: `productBrand-${slug}`,
        _type: 'productBrand',
        title: brandName,
        slug: { _type: 'slug', current: slug }
    };
    fs.appendFileSync(relationsPath, JSON.stringify(brandDoc) + '\n');
});

// Create Category documents
categories.forEach(categoryName => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const categoryDoc = {
        _id: `productCategory-${slug}`,
        _type: 'productCategory',
        title: categoryName,
        slug: { _type: 'slug', current: slug }
    };
    fs.appendFileSync(relationsPath, JSON.stringify(categoryDoc) + '\n');
});

console.log(`Successfully created ${relationsPath} with ${brands.size} brands and ${categories.size} categories.`);
