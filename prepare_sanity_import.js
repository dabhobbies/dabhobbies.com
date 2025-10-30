
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

        // 2. Clean and use slug for _id and slug field
        if (!data.slug) {
            console.warn(`Skipping ${filePath}, no slug found.`);
            return;
        }

        let cleanedSlug = data.slug.replace(/^dab-hobbies-/, '');
        const idPattern = /-(?:[0-9]{19}|[a-f0-9]{5})$/;
        cleanedSlug = cleanedSlug.replace(idPattern, '');

        data.slug = { _type: 'slug', current: cleanedSlug };
        data._id = cleanedSlug;
        
        // 3. Rename 'title' to 'name'
        if (data.title) {
            data.name = data.title;
            delete data.title;
        } else {
            console.warn(`Skipping ${filePath}, no title found to rename to name.`);
            return;
        }

        // 4. Ensure price is a number
        if (data.price && typeof data.price === 'string') {
            const priceNum = parseInt(data.price, 10);
            if (!isNaN(priceNum)) {
                data.price = priceNum;
            } else {
                console.warn(`Could not convert price to int for ${filePath}. Removing price.`);
                delete data.price;
            }
        }

        // 5. Create brand reference
        if (data.brand) {
            data.brand = {
                _type: 'reference',
                _ref: `productBrand-${data.brand.toLowerCase().replace(/\s+/g, '-')}`
            };
        }

        // 6. Create category reference
        if (data.category) {
            data.category = {
                _type: 'reference',
                _ref: `productCategory-${data.category.toLowerCase().replace(/\s+/g, '-')}`
            };
        }

        // 7. Format images for asset upload
        if (data.downloaded_images && Array.isArray(data.downloaded_images)) {
            const productDir = path.dirname(filePath);
            data.images = data.downloaded_images
                .map(imagePath => {
                    const imageName = path.basename(imagePath);
                    const correctPath = path.join(productDir, 'images', imageName);
                    
                    if (fs.existsSync(correctPath)) {
                        const absolutePath = path.resolve(correctPath);
                        return {
                            _type: 'image',
                            _sanityAsset: `image@file://${absolutePath}`
                        };
                    }
                    console.warn(`Image file not found: ${correctPath}`);
                    return null;
                })
                .filter(Boolean); 
        }
        delete data.downloaded_images; 

        fs.appendFileSync(ndjsonPath, JSON.stringify(data) + '\n');

    } catch (error) {
        console.error(`An error occurred with ${filePath}:`, error);
    }
}

console.log('Starting preparation of Sanity import file with corrected image paths...');
processDirectory(productsDir);
console.log(`Successfully created ${ndjsonPath}`);
