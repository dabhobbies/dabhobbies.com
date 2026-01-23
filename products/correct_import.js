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

// Category mapping from source to Sanity document ID
const categoryMapping = {
    'accesories': '7de54f97-769a-4efc-a1cc-f0ce7c10b72e',
    'accessories': '7de54f97-769a-4efc-a1cc-f0ce7c10b72e',
    'boots': '6c70410e-d2a2-47db-8066-477cc4133e8e',
    'cargo equipment': 'productCategory-cargo-equipment',
    'eye wear': 'productCategory-eyewear',
    'eyewear': 'productCategory-eyewear',
    'gloves': 'a60a6e0b-6cae-4c8e-83f1-4f2d614c3d98',
    'helmets': 'productCategory-helmets',
    'inner suit': '420a1367-06fe-4d82-bd0e-d93821dc4aff',
    'intercom': '3b082a75-55ef-4f58-b764-a675392e382f',
    'jackets': '2dc0ac92-61d9-430a-bcf7-c3f2a27e5912',
    'others': 'productCategory-others',
    'pants': 'f49d2848-f4eb-4bb5-9412-81fa1adf73f2',
    'parts helmet': 'ed47141e-0223-4446-a293-d791069d6aa7',
    'phone holder': 'productCategory-phone-holders',
    'protector': '92609a21-1528-473b-8058-1b969f85e8df',
    'rain suit': '980b1995-8739-4aed-bce7-897cb87f60a3',
    'rainsuit': '980b1995-8739-4aed-bce7-897cb87f60a3',
    'spotlight': 'productCategory-general',
    'storages': '8c865ea3-a5b5-4d95-ac1d-b345444062de',
    'tires': 'productCategory-tires',
    'vest': 'c04fa46d-e98f-4553-8f18-5c72724903f1',
};

// Default brand reference
const defaultBrandId = 'productBrand-others';

// Helper function to generate a unique key for Portable Text blocks
function generateKey() {
    return Math.random().toString(36).substring(2, 12);
}

// Convert plain text description to Portable Text format
function convertToPortableText(text) {
    if (!text || typeof text !== 'string') return [];

    // Clean up and split into paragraphs
    const cleanText = text.replace(/\n+/g, '\n').trim();
    const paragraphs = cleanText.split('\n').filter(p => p.trim());

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

// Upload image to Sanity
async function uploadImage(imagePath) {
    try {
        // Extract actual file path from _sanityAsset format
        let filePath = imagePath;
        if (typeof imagePath === 'object' && imagePath._sanityAsset) {
            filePath = imagePath._sanityAsset.replace('image@file://', '');
        } else if (typeof imagePath === 'string' && imagePath.startsWith('image@file://')) {
            filePath = imagePath.replace('image@file://', '');
        }

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const imageBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        const asset = await client.assets.upload('image', imageBuffer, {
            filename: fileName
        });

        return {
            _type: 'image',
            _key: generateKey(),
            asset: {
                _type: 'reference',
                _ref: asset._id
            }
        };
    } catch (error) {
        return null;
    }
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
            const productName = sourceProduct.title || sourceProduct.name || 'Unnamed';

            // Show progress
            process.stdout.write(`\r   Processing ${i + 1}/${lines.length}: ${productName.substring(0, 40)}...                    `);

            // Upload all images
            const uploadedImages = [];
            if (sourceProduct.images && sourceProduct.images.length > 0) {
                for (const img of sourceProduct.images) {
                    const uploaded = await uploadImage(img);
                    if (uploaded) {
                        uploadedImages.push(uploaded);
                    }
                }
            }

            // Skip if no images uploaded
            if (uploadedImages.length === 0) {
                console.log(`\n   ⚠️ Skipping ${productName} - no valid images`);
                errors++;
                continue;
            }

            // Get category reference
            const categoryKey = (sourceProduct.category || 'accesories').toLowerCase();
            const categoryId = categoryMapping[categoryKey] || '7de54f97-769a-4efc-a1cc-f0ce7c10b72e';

            // Convert description to Portable Text
            const descriptionBlocks = convertToPortableText(sourceProduct.description);

            // Prepare product data according to schema
            const product = {
                _type: 'product',
                _id: sourceProduct._id,
                name: sourceProduct.title || sourceProduct.name || 'Unnamed Product',
                slug: sourceProduct.slug,
                images: uploadedImages,
                brand: {
                    _type: 'reference',
                    _ref: defaultBrandId
                },
                category: {
                    _type: 'reference',
                    _ref: categoryId
                },
                description: descriptionBlocks,
                longDescription: descriptionBlocks,
                price: sourceProduct.price || 0,
                rating: Math.floor(Math.random() * 2) + 4,
                reviewCount: Math.floor(Math.random() * 50),
                sizes: sourceProduct.sizes && sourceProduct.sizes.length > 0 ? sourceProduct.sizes : ['Universal'],
                colors: sourceProduct.colors && sourceProduct.colors.length > 0 ? sourceProduct.colors : ['Black'],
                gender: 'Unisex',
                weight: 0.5,
            };

            await client.createOrReplace(product);
            imported++;

        } catch (error) {
            console.log(`\n   ❌ Error on product ${i + 1}: ${error.message}`);
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
    console.log('   SANITY PRODUCT IMPORT (CORRECT SCHEMA)');
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
