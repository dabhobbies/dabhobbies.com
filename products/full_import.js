const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configuration
const projectId = 'ko6ixh1i';
const dataset = 'dab-h4m9k2x7r8pda6_data';
const token = 'skNytNZjB9DeF9PXePNkSwGW66aD8ngEgKCNBsww64x675mpdJn5GWksDS8hMtvKzZ4Y3kiMrhm1yPIK0G8dD2i10KPHH3kxPLkeXINPG721SWMjTi8255YeMRVX0q8Kqa29HBxrhrJFShFeVRsFx6xuSdRjPP1C3xCEQkOF7x6XdEXPcVZh';

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-07-15',
});

const inputFile = path.join(__dirname, 'sanity-products.ndjson');

// Category mapping to match schema list
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

// Upload image to Sanity
async function uploadImage(imagePath) {
    try {
        // Extract actual file path from _sanityAsset format
        let filePath = imagePath;
        if (imagePath.startsWith('image@file://')) {
            filePath = imagePath.replace('image@file://', '');
        }

        if (!fs.existsSync(filePath)) {
            console.log(`   ⚠️ Image not found: ${filePath}`);
            return null;
        }

        const imageBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        const asset = await client.assets.upload('image', imageBuffer, {
            filename: fileName
        });

        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id
            }
        };
    } catch (error) {
        console.log(`   ⚠️ Error uploading image: ${error.message}`);
        return null;
    }
}

// Extract description as plain text
function extractDescription(description, maxLength = 0) {
    if (!description) return 'No description available.';

    if (typeof description === 'string') {
        // Clean up newlines and extra spaces
        let text = description.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        if (maxLength > 0 && text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    }

    return 'No description available.';
}

// Delete all products
async function deleteAllProducts() {
    console.log('\n🗑️  Step 1: Deleting all existing products...');

    const products = await client.fetch(`*[_type == "product"]._id`);
    console.log(`   Found ${products.length} products to delete.`);

    if (products.length === 0) {
        console.log('   No products to delete.\n');
        return 0;
    }

    const batchSize = 100;
    let deleted = 0;

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const transaction = client.transaction();
        batch.forEach(id => transaction.delete(id));
        await transaction.commit();
        deleted += batch.length;
        process.stdout.write(`\r   Deleted ${deleted}/${products.length} products...`);
    }

    console.log(`\n   ✅ Successfully deleted all ${products.length} products.\n`);
    return products.length;
}

// Import products with images
async function importProducts() {
    console.log('📦 Step 2: Importing products with images...\n');

    if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file not found: ${inputFile}`);
    }

    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = fileContent.trim().split('\n').filter(line => line.trim());

    console.log(`   Found ${lines.length} products to import.\n`);

    let imported = 0;
    let errors = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        try {
            const sourceProduct = JSON.parse(line);

            // Show progress
            process.stdout.write(`\r   Processing ${i + 1}/${lines.length}: ${sourceProduct.title || sourceProduct.name}...                    `);

            // Upload first image
            let imageAsset = null;
            if (sourceProduct.images && sourceProduct.images.length > 0) {
                const firstImage = sourceProduct.images[0];
                const imagePath = firstImage._sanityAsset || firstImage;
                imageAsset = await uploadImage(imagePath);
            }

            // Prepare product data according to schema
            const categoryKey = (sourceProduct.category || 'accesories').toLowerCase();
            const description = extractDescription(sourceProduct.description);

            const product = {
                _type: 'product',
                _id: sourceProduct._id,
                name: sourceProduct.title || sourceProduct.name || 'Unnamed Product',
                slug: sourceProduct.slug,
                image: imageAsset, // Will be null if upload failed
                brand: 'Universal', // Default brand
                category: categoryMapping[categoryKey] || 'Accesories',
                description: description.substring(0, 197) + (description.length > 197 ? '...' : ''),
                longDescription: description,
                price: sourceProduct.price || 0,
                rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
                reviewCount: Math.floor(Math.random() * 50),
                sizes: sourceProduct.sizes && sourceProduct.sizes.length > 0 ? sourceProduct.sizes : ['Universal'],
                colors: ['Black'],
                gender: 'Unisex',
                weight: 0.5,
            };

            // Skip if no image (image is required in schema)
            if (!product.image) {
                console.log(`\n   ⚠️ Skipping ${product.name} - no valid image`);
                errors++;
                continue;
            }

            await client.createOrReplace(product);
            imported++;

        } catch (error) {
            console.log(`\n   ❌ Error on line ${i + 1}: ${error.message}`);
            errors++;
        }
    }

    console.log(`\n\n   ✅ Import complete!`);
    console.log(`   Successfully imported: ${imported} products`);
    console.log(`   Errors/Skipped: ${errors}`);

    return imported;
}

async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   SANITY PRODUCT IMPORT WITH IMAGES');
    console.log(`   Project: ${projectId}`);
    console.log(`   Dataset: ${dataset}`);
    console.log('═══════════════════════════════════════════════════════════════');

    try {
        await deleteAllProducts();
        await importProducts();

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('   ALL DONE! 🎉');
        console.log('═══════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

main();
