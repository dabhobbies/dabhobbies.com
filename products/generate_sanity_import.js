const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const outputFile = path.join(rootDir, 'sanity-products.ndjson');

const products = [];
const ids = new Set();

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (file.startsWith('.')) return; // skip hidden files
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Find all docx files as anchors for products
const allFiles = getAllFiles(rootDir);
const productDocxFiles = allFiles.filter(f => f.endsWith('.docx') && !path.basename(f).startsWith('~$'));

console.log(`Found ${productDocxFiles.length} product descriptions (.docx). Processing...`);

productDocxFiles.forEach(docxPath => {
  try {
    const dirPath = path.dirname(docxPath);
    const folderName = path.basename(dirPath);

    // Calculate depth and structure relative to root
    const relPath = path.relative(rootDir, dirPath);
    const pathParts = relPath.split(path.sep);

    // Safety check for depth to ensure we are inside Category/Product
    // Expected: [Category, ProductGroup, ...Variant?]
    // If length is 1, it's directly in Category? Unusual but possible.
    if (pathParts.length < 1) {
      console.warn(`Skipping ${relPath} - Root level?`);
      return;
    }

    const categoryName = pathParts[0];
    // If path has only 1 part (e.g. Products/Jackets/Item.docx), then ProductGroup is undefined?
    // Let's assume pathParts[1] is ProductGroup if it exists, otherwise use folderName
    const productGroupName = pathParts.length > 1 ? pathParts[1] : folderName;

    // Determine Title
    // Based on user feedback: "Level 1 is Category, Level 2 is Product".
    // But data shows Variants are nested deeper.
    // To identify the specific item, we use the folder name containing the docx.
    // This handles both "Flat" (Level 2 has docx) and "Nested" (Level 3 has docx).
    let title = folderName;

    // Get Images in the same folder
    const images = fs.readdirSync(dirPath)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !f.startsWith('.'))
      .map(f => path.join(dirPath, f));

    // Extract Text
    let xml = '';
    try {
      xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: 'utf8' });
    } catch (e) {
      console.error(`Failed to separate xml from docx: ${docxPath}`);
      return;
    }

    // Parse XML using regex to extract text content
    const tokens = xml.match(/(<w:t[^>]*>.*?<\/w:t>|<w:br\/>|<w:p[^>]*>)/g) || [];
    let fullDescription = tokens.map(token => {
      if (token.startsWith('<w:br')) return '\n';
      if (token.startsWith('<w:p')) return '\n';
      if (token.startsWith('<w:t')) {
        return token.replace(/<[^>]+>/g, '');
      }
      return '';
    }).join('');

    // Clean up excessive newlines
    fullDescription = fullDescription.replace(/\n+/g, '\n').trim();

    // Extract Metadata from Description
    let price = 0;
    const priceMatch = fullDescription.match(/Harga\s*:\s*Rp\.?\s*([\d\.]+)/i);
    if (priceMatch) {
      price = parseInt(priceMatch[1].replace(/\./g, ''), 10);
    }

    let sizes = [];
    const sizeMatch = fullDescription.match(/Size\s*:\s*([^\n]+)/i);
    if (sizeMatch) {
      // Handle "M, L, XL" or "M/L/XL"
      sizes = sizeMatch[1].split(/[,\/]/).map(s => s.trim()).filter(s => s.length > 0);
    }

    // Generate a robust ID
    let safeId = relPath.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Ensure uniqueness
    let counter = 1;
    let originalId = safeId;
    while (ids.has(safeId)) {
      safeId = `${originalId}-${counter++}`;
    }
    ids.add(safeId);

    const product = {
      _type: 'product',
      _id: safeId,
      title: title,
      slug: { _type: 'slug', current: safeId },
      category: categoryName,
      price: price,
      sizes: sizes,
      description: fullDescription,
      images: images.map(img => ({
        _type: 'image',
        _sanityAsset: `image@file://${img}`
      }))
    };

    products.push(product);

  } catch (err) {
    console.error(`Error processing ${docxPath}:`, err.message);
  }
});

fs.writeFileSync(outputFile, products.map(p => JSON.stringify(p)).join('\n'));
console.log(`Exported ${products.length} products to ${outputFile}`);
