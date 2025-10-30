
const fs = require('fs');
const path = require('path');

const productsDir = 'import_products';
const brandsPath = 'brands.ndjson';
const categoriesPath = 'categories.ndjson';

const brands = new Set();
const categories = new Set();

function processDirectory(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(directory, file.name);
        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.name === 'product.json') {
            try {
                const fileContent = fs.readFileSync(fullPath, 'utf-8');
                const data = JSON.parse(fileContent);
                if (data.brand) brands.add(data.brand);
                if (data.category) categories.add(data.category);
            } catch (error) {
                console.error(`Error reading ${fullPath}:`, error);
            }
        }
    }
}

function createNdjson(items, type, filePath) {
    let ndjson = '';
    for (const item of items) {
        const doc = {
            _type: type,
            _id: `${type}-${item.toLowerCase().replace(/\s+/g, '-')}`,
            name: item
        };
        ndjson += JSON.stringify(doc) + '\n';
    }
    fs.writeFileSync(filePath, ndjson);
    console.log(`Successfully created ${filePath}`);
}

console.log('Extracting brands and categories...');
processDirectory(productsDir);

createNdjson(brands, 'productBrand', brandsPath);
createNdjson(categories, 'productCategory', categoriesPath);

console.log('Finished extracting brands and categories.');
