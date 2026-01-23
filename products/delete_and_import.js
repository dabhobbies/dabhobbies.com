const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Sanity client configuration
const client = createClient({
    projectId: 'ko6ixh1i',
    dataset: 'dab-h4m9k2x7r8pda6_data',
    token: 'skhc1R5vuKEX3Wkm6UeGLpDUy3ctaae17KINhBPVwrF9OyjRPTruvDxCTOg7SgNwSeytagDdlwUtZ6LkhgcHgmU6VmdX2BINMPmTJkSQT3x94RHM97r5ds2Tt23h6UeHaaGwZGO8xMpYpfV2vjlEMqaZMErsliqhfFvs9whKWqWWAk9liEmP',
    useCdn: false,
    apiVersion: '2024-07-15',
});

async function deleteAllProducts() {
    console.log('Fetching all product IDs...');

    // Fetch all product IDs
    const products = await client.fetch(`*[_type == "product"]._id`);
    console.log(`Found ${products.length} products to delete.`);

    if (products.length === 0) {
        console.log('No products to delete.');
        return;
    }

    // Delete in batches
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const transaction = client.transaction();

        batch.forEach(id => {
            transaction.delete(id);
        });

        await transaction.commit();
        console.log(`Deleted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)} (${batch.length} products)`);
    }

    console.log(`✅ Successfully deleted all ${products.length} products.`);
}

async function main() {
    try {
        console.log('=== Step 1: Delete All Products ===\n');
        await deleteAllProducts();

        console.log('\n=== Step 2: Import New Products ===\n');
        console.log('Now run the following command to import:');
        console.log(`npx sanity dataset import ./products/sanity-products-ready.ndjson dab-h4m9k2x7r8pda6_data --replace`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
