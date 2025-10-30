
const fs = require('fs');
const path = require('path');

const productsDir = 'import_products';
const ndjsonPath = 'import.ndjson';

// Ensure the output file is empty before we start
fs.writeFileSync(ndjsonPath, '');

function processDirectory(directory) {
    const items = fs.readdirSync(directory, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(directory, item.name);
        if (item.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.name === 'product.json') {
            processProductFile(fullPath);
        }
    }
}

function processProductFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // 1. Add _type
        data._type = 'product';

        // 2. Use slug for _id
        if (!data.slug) {
            console.warn(`Skipping ${filePath}, no slug found.`);
            return;
        }
        data._id = data.slug;

        // 3. Ensure price is a number
        if (data.price && typeof data.price === 'string') {
            const priceNum = parseInt(data.price, 10);
            if (!isNaN(priceNum)) {
                data.price = priceNum;
            } else {
                console.warn(`Could not convert price to int for ${filePath}. Removing price.`);
                delete data.price;
            }
        }

        // 4. Create brand reference
        if (data.brand) {
            data.brand = {
                _type: 'reference',
                _ref: `productBrand-${data.brand.toLowerCase().replace(/\s+/g, '-')}`
            };
        }

        // 5. Create category reference
        if (data.category) {
            data.category = {
                _type: 'reference',
                _ref: `productCategory-${data.category.toLowerCase().replace(/\s+/g, '-')}`
            };
        }

        // 6. Remove fields that are not needed or will be handled differently
        delete data.images;

        // Append the transformed object to the .ndjson file
        fs.appendFileSync(ndjsonPath, JSON.stringify(data) + '\n');

    } catch (error) {
        console.error(`An error occurred with ${filePath}:`, error);
    }
}

console.log('Starting preparation of Sanity import file...');
processDirectory(productsDir);
console.log(`Successfully created ${ndjsonPath}`);
