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

const productsFile = path.join(__dirname, 'perfect-products.ndjson');
const brandsFile = path.join(__dirname, 'brands-to-import.ndjson');

// Upload image to Sanity
async function uploadImage(imagePath) {
    try {
        let filePath = imagePath;
        if (typeof imagePath === 'string' && imagePath.startsWith('image@file://')) {
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

        return asset._id;
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
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const transaction = client.transaction();
        batch.forEach(id => transaction.delete(id));
        await transaction.commit();
        process.stdout.write(`\r   Deleted ${Math.min(i + batchSize, products.length)}/${products.length} products...`);
    }

    console.log(`\n   ✅ Successfully deleted all ${products.length} products.\n`);
    return products.length;
}

// Import brands first
async function importBrands() {
    console.log('🏷️  Step 2: Importing brands...');

    if (!fs.existsSync(brandsFile)) {
        console.log('   No brands file found, skipping...\n');
        return 0;
    }

    const fileContent = fs.readFileSync(brandsFile, 'utf-8');
    const lines = fileContent.trim().split('\n').filter(line => line.trim());

    console.log(`   Found ${lines.length} brands to import.`);

    let imported = 0;
    for (const line of lines) {
        try {
            const brand = JSON.parse(line);
            await client.createOrReplace(brand);
            imported++;
        } catch (error) {
            // Brand might already exist, that's OK
        }
    }

    console.log(`   ✅ Imported ${imported} brands.\n`);
    return imported;
}

// Import products with images
async function importProducts() {
    console.log('📦 Step 3: Importing products with images...\n');

    if (!fs.existsSync(productsFile)) {
        throw new Error(`Products file not found: ${productsFile}`);
    }

    const fileContent = fs.readFileSync(productsFile, 'utf-8');
    const lines = fileContent.trim().split('\n').filter(line => line.trim());

    console.log(`   Found ${lines.length} products to import.\n`);

    let imported = 0;
    let errors = 0;

    for (let i = 0; i < lines.length; i++) {
        try {
            const product = JSON.parse(lines[i]);

            process.stdout.write(`\r   Processing ${i + 1}/${lines.length}: ${product.name.substring(0, 35)}...`);

            // Upload images and update references
            const uploadedImages = [];
            if (product.images && product.images.length > 0) {
                for (const img of product.images) {
                    const assetId = await uploadImage(img._sanityAsset);
                    if (assetId) {
                        uploadedImages.push({
                            _type: 'image',
                            _key: img._key,
                            asset: {
                                _type: 'reference',
                                _ref: assetId
                            }
                        });
                    }
                }
            }

            // Skip if no images uploaded
            if (uploadedImages.length === 0) {
                console.log(`\n   ⚠️ Skipping ${product.name} - no valid images`);
                errors++;
                continue;
            }

            // Update product with uploaded images
            product.images = uploadedImages;

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
    console.log('   PERFECT SANITY PRODUCT IMPORT');
    console.log(`   Project: ${projectId}`);
    console.log(`   Dataset: ${dataset}`);
    console.log('═══════════════════════════════════════════════════════════════');

    try {
        await deleteAllProducts();
        await importBrands();
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
