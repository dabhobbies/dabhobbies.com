const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configuration from .env.local
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

const inputFile = path.join(__dirname, 'sanity-products-ready.ndjson');

async function deleteAllProducts() {
  console.log('🗑️  Fetching all product IDs...');

  const products = await client.fetch(`*[_type == "product"]._id`);
  console.log(`   Found ${products.length} products to delete.`);

  if (products.length === 0) {
    console.log('   No products to delete.');
    return 0;
  }

  // Delete in batches
  const batchSize = 100;
  let deleted = 0;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();

    batch.forEach(id => {
      transaction.delete(id);
    });

    await transaction.commit();
    deleted += batch.length;
    console.log(`   Deleted ${deleted}/${products.length} products...`);
  }

  console.log(`✅ Successfully deleted all ${products.length} products.\n`);
  return products.length;
}

async function importProducts() {
  console.log('📦 Reading products from file...');

  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  const lines = fileContent.trim().split('\n').filter(line => line.trim());

  console.log(`   Found ${lines.length} products to import.\n`);

  // Import in batches
  const batchSize = 50;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < lines.length; i += batchSize) {
    const batch = lines.slice(i, i + batchSize);
    const transaction = client.transaction();

    for (const line of batch) {
      try {
        const product = JSON.parse(line);
        transaction.createOrReplace(product);
      } catch (e) {
        console.error(`   Error parsing line: ${e.message}`);
        errors++;
      }
    }

    try {
      await transaction.commit();
      imported += batch.length;
      console.log(`   Imported ${imported}/${lines.length} products...`);
    } catch (e) {
      console.error(`   Batch error: ${e.message}`);
      errors += batch.length;
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Successfully imported: ${imported - errors} products`);
  if (errors > 0) {
    console.log(`   Errors: ${errors}`);
  }

  return imported - errors;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   SANITY PRODUCT IMPORT');
  console.log(`   Project: ${projectId}`);
  console.log(`   Dataset: ${dataset}`);
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    console.log('=== Step 1: Delete All Existing Products ===\n');
    await deleteAllProducts();

    console.log('=== Step 2: Import New Products ===\n');
    await importProducts();

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('   ALL DONE! 🎉');
    console.log('═══════════════════════════════════════════════════════');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
