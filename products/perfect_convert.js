const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'sanity-products.ndjson');
const outputFile = path.join(__dirname, 'perfect-products.ndjson');

// Brand database - known brands and variations
const brandDatabase = {
    // Helmets
    'zeus': 'Zeus',
    'smk': 'SMK',
    'kyt': 'KYT',
    'nhk': 'NHK',
    'ink': 'INK',
    'agv': 'AGV',
    'shoei': 'Shoei',
    'arai': 'Arai',
    // Gloves
    '7gear': '7Gear',
    'contin': 'Contin',
    'inventzo': 'Inventzo',
    'northy': 'Northy',
    'respiro': 'Respiro',
    'scoyco': 'Scoyco',
    'suomy': 'Suomy',
    'voltz': 'Voltz',
    // Accessories
    'kewig': 'Kewig',
    'motobar': 'Motobar',
    'motowolf': 'Motowolf',
    'kilap': 'Kilap Premium',
    'kilap premium': 'Kilap Premium',
    'motul': 'Motul',
    'ptt': 'PTT',
    'rhodey': 'Rhodey',
    'liqui moly': 'Liqui Moly',
    'aofly': 'AOFLY',
    'kdeam': 'KDEAM',
    'acetato': 'Acetato',
    'herorider': 'Herorider',
    'sozzy': 'SOZZY',
    // Boots
    'rvr': 'RVR',
    // Storage/Cargo
    'imof': 'IMOF',
    'posh': 'POSH',
    'raw': 'RAW',
    'xhaor': 'Xhaor',
    'gma': 'GMA',
    // Jackets
    'prostreet': 'Prostreet',
    'alpinestars': 'Alpinestars',
    'dainese': 'Dainese',
    // Intercom
    'parani': 'Parani',
    'sena': 'Sena',
    'cardo': 'Cardo',
    'lexin': 'Lexin',
    'airide': 'Airide',
    'ejeas': 'EJEAS',
    'freedconn': 'Freedconn',
    'fodsports': 'Fodsports',
    'moman': 'MOMAN',
    // Tires
    'dunlop': 'Dunlop',
    'maxxis': 'Maxxis',
    'metzeler': 'Metzeler',
    'pirelli': 'Pirelli',
    'swallow': 'Swallow',
    // Phones/Holders
    'gub': 'GUB',
    'joyroom': 'Joyroom',
    'osopro': 'OsoPro',
    'rock bros': 'Rockbros',
    'rockbros': 'Rockbros',
    // Others
    'future eyes': 'Future Eyes',
    'rashguard': 'Rashguard',
    'ls2': 'LS2',
};

// Category descriptions for generating product descriptions
const categoryDescriptions = {
    'helmets': {
        short: 'helm berkualitas tinggi dengan desain stylish dan perlindungan maksimal',
        intro: 'Helm berkualitas premium yang dirancang untuk memberikan perlindungan maksimal dan kenyamanan saat berkendara.'
    },
    'gloves': {
        short: 'sarung tangan motor dengan grip kuat dan perlindungan optimal',
        intro: 'Sarung tangan motor berkualitas tinggi yang memberikan perlindungan dan kenyamanan saat berkendara.'
    },
    'jackets': {
        short: 'jaket motor dengan proteksi lengkap dan desain stylish',
        intro: 'Jaket motor premium dengan perlindungan lengkap yang cocok untuk touring maupun penggunaan sehari-hari.'
    },
    'boots': {
        short: 'sepatu boot motor dengan perlindungan kaki dan kenyamanan maksimal',
        intro: 'Sepatu boot motor yang dirancang khusus untuk memberikan perlindungan dan kenyamanan saat berkendara.'
    },
    'intercom': {
        short: 'intercom helm untuk komunikasi jernih saat berkendara',
        intro: 'Sistem intercom helm berkualitas tinggi untuk komunikasi yang jernih dan nyaman antar pengendara.'
    },
    'accesories': {
        short: 'aksesoris motor berkualitas untuk melengkapi perjalanan Anda',
        intro: 'Aksesoris motor pilihan yang akan membuat perjalanan Anda lebih nyaman dan menyenangkan.'
    },
    'storage': {
        short: 'solusi penyimpanan praktis untuk motor Anda',
        intro: 'Perlengkapan penyimpanan motor yang praktis dan berkualitas untuk kebutuhan touring Anda.'
    },
    'pants': {
        short: 'celana motor dengan proteksi dan kenyamanan maksimal',
        intro: 'Celana motor berkualitas dengan perlindungan yang optimal untuk perjalanan yang aman.'
    },
    'vest': {
        short: 'rompi motor dengan visibilitas tinggi dan perlindungan ekstra',
        intro: 'Rompi motor berkualitas yang meningkatkan visibilitas dan memberikan perlindungan tambahan.'
    },
    'protector': {
        short: 'protektor body untuk perlindungan maksimal saat berkendara',
        intro: 'Protektor body berkualitas tinggi untuk perlindungan maksimal terhadap benturan.'
    },
    'rainsuit': {
        short: 'jas hujan motor yang tahan air dan nyaman dipakai',
        intro: 'Jas hujan motor berkualitas yang menjaga Anda tetap kering dalam kondisi hujan.'
    },
    'tires': {
        short: 'ban motor berkualitas dengan grip maksimal dan daya tahan tinggi',
        intro: 'Ban motor premium dengan teknologi terkini untuk performa dan keamanan berkendara yang optimal.'
    }
};

// Extract brand from description text
function extractBrandFromDescription(description) {
    if (!description) return null;

    const desc = description.toLowerCase();

    // Check for brand patterns in description
    const brandPatterns = [
        /brand\s*(?:name)?\s*:?\s*([a-zA-Z0-9\s]+?)(?:\n|$)/i,
        /^([A-Z][A-Za-z0-9]+)\s+/,
    ];

    for (const brand of Object.keys(brandDatabase)) {
        if (desc.includes(brand.toLowerCase())) {
            return brandDatabase[brand];
        }
    }

    return null;
}

// Extract brand from folder path
function extractBrandFromPath(imagePath) {
    if (!imagePath) return null;

    // Extract folder name from image path
    const parts = imagePath.split('/');
    const productFolder = parts[parts.length - 2]; // Get parent folder
    const categoryFolder = parts[parts.length - 3]; // Get category folder

    // Try to find brand in folder name
    for (const brand of Object.keys(brandDatabase)) {
        if (productFolder.toLowerCase().includes(brand.toLowerCase())) {
            return brandDatabase[brand];
        }
    }

    return null;
}

// Extract proper product name from folder path
function extractProductName(product) {
    if (!product.images || product.images.length === 0) {
        return product.title || product.name || 'Unknown Product';
    }

    const imagePath = product.images[0]._sanityAsset || '';
    const parts = imagePath.split('/');

    // Get the product folder name (second to last element)
    const productFolder = parts[parts.length - 2];

    // Get the variant (from current title if it's a color/variant)
    const currentTitle = product.title || product.name || '';
    const colorVariants = ['Black', 'White', 'Grey', 'Red', 'Blue', 'Green', 'Yellow', 'Orange',
        'Matt Black', 'Gloss Black', 'Navy', 'Camo', 'Khaki', 'FFGirBlue'];

    // If current title is just a color/variant, use folder name
    if (colorVariants.some(v => v.toLowerCase() === currentTitle.toLowerCase())) {
        // For helmet variants under a parent folder structure
        const parentFolder = parts[parts.length - 3];

        // Check if parent is a model folder (contains model numbers)
        if (/\d/.test(parentFolder) && parentFolder.toLowerCase() !== 'helmets') {
            return `${parentFolder} ${currentTitle}`;
        }

        return `${productFolder} ${currentTitle}`;
    }

    // If product folder seems better than title (folder has brand name)
    if (productFolder && productFolder !== currentTitle) {
        // Check if folder has more info
        const folderWords = productFolder.split(/[\s-]+/);
        const titleWords = currentTitle.split(/[\s-]+/);

        if (folderWords.length >= titleWords.length) {
            return productFolder;
        }
    }

    return currentTitle || productFolder || 'Unknown Product';
}

// Parse specifications from description
function parseSpecifications(description) {
    const specs = {
        materials: [],
        colors: [],
        sizes: [],
        weight: null,
        features: [],
        certification: null
    };

    if (!description) return specs;

    const lines = description.split('\n');

    for (const line of lines) {
        const cleanLine = line.trim();
        const lowerLine = cleanLine.toLowerCase();

        // Extract materials
        if (lowerLine.includes('material') || lowerLine.includes('bahan')) {
            const materialMatch = cleanLine.match(/(?:material|bahan)\s*:?\s*(.+)/i);
            if (materialMatch) {
                specs.materials.push(materialMatch[1].trim());
            }
        }

        // Extract colors
        if (lowerLine.includes('warna') || lowerLine.includes('color')) {
            const colorMatch = cleanLine.match(/(?:warna|color)\s*:?\s*(.+)/i);
            if (colorMatch) {
                const colors = colorMatch[1].split(/[,\/]/).map(c => c.trim()).filter(c => c);
                specs.colors.push(...colors);
            }
        }

        // Extract weight
        if (lowerLine.includes('berat') || lowerLine.includes('weight')) {
            const weightMatch = cleanLine.match(/(\d+(?:\.\d+)?)\s*(?:kg|gram|g)/i);
            if (weightMatch) {
                let weight = parseFloat(weightMatch[1]);
                if (lowerLine.includes('gram') || lowerLine.includes('±')) {
                    weight = weight / 1000; // Convert grams to kg
                }
                specs.weight = weight;
            }
        }

        // Extract sizes
        if (lowerLine.includes('size') || lowerLine.includes('ukuran')) {
            const sizeMatch = cleanLine.match(/(?:size|ukuran)\s*:?\s*(.+)/i);
            if (sizeMatch) {
                const sizes = sizeMatch[1].split(/[,\/]/).map(s => s.trim()).filter(s => s);
                specs.sizes.push(...sizes);
            }
        }

        // Extract certification
        if (lowerLine.includes('sni') || lowerLine.includes('dot') || lowerLine.includes('ece')) {
            const certMatch = cleanLine.match(/(DOT|SNI|ECE\s*\d+\.?\d*)/gi);
            if (certMatch) {
                specs.certification = certMatch.join(', ');
            }
        }

        // Extract features (lines starting with -, +, or *)
        if (/^[-+*•]\s*/.test(cleanLine)) {
            const feature = cleanLine.replace(/^[-+*•]\s*/, '').trim();
            if (feature.length > 5 && feature.length < 100) {
                specs.features.push(feature);
            }
        }
    }

    return specs;
}

// Generate short description (max 200 chars, marketing-friendly)
function generateShortDescription(productName, brand, category, specs) {
    const categoryKey = category.toLowerCase();
    const catDesc = categoryDescriptions[categoryKey] || categoryDescriptions['accesories'];

    let desc = '';

    if (brand && brand !== 'Universal' && brand !== 'Others') {
        desc = `${productName} dari ${brand} - ${catDesc.short}.`;
    } else {
        desc = `${productName} - ${catDesc.short}.`;
    }

    // Add key feature if available
    if (specs.certification) {
        desc += ` Bersertifikasi ${specs.certification}.`;
    }

    // Truncate to 197 chars + "..."
    if (desc.length > 200) {
        desc = desc.substring(0, 197) + '...';
    }

    return desc;
}

// Generate long description (full marketing text)
function generateLongDescription(productName, brand, category, specs, originalDesc) {
    const categoryKey = category.toLowerCase();
    const catDesc = categoryDescriptions[categoryKey] || categoryDescriptions['accesories'];

    let desc = `${catDesc.intro}\n\n`;

    if (brand && brand !== 'Universal' && brand !== 'Others') {
        desc += `${productName} dari ${brand} hadir dengan kualitas premium yang dirancang untuk memenuhi kebutuhan berkendara Anda.\n\n`;
    } else {
        desc += `${productName} hadir dengan kualitas premium yang dirancang untuk memenuhi kebutuhan berkendara Anda.\n\n`;
    }

    // Add specifications section
    if (specs.materials.length > 0 || specs.certification || specs.features.length > 0) {
        desc += '**SPESIFIKASI:**\n';

        if (specs.materials.length > 0) {
            desc += `• Material: ${specs.materials.join(', ')}\n`;
        }

        if (specs.certification) {
            desc += `• Sertifikasi: ${specs.certification}\n`;
        }

        if (specs.weight) {
            desc += `• Berat: ${specs.weight < 1 ? (specs.weight * 1000) + 'g' : specs.weight + ' kg'}\n`;
        }

        if (specs.colors.length > 0) {
            desc += `• Warna: ${specs.colors.join(', ')}\n`;
        }

        desc += '\n';
    }

    // Add features section
    if (specs.features.length > 0) {
        desc += '**FITUR UNGGULAN:**\n';
        specs.features.slice(0, 5).forEach(f => {
            desc += `• ${f}\n`;
        });
        desc += '\n';
    }

    // Add benefits section
    desc += '**KEUNGGULAN:**\n';
    desc += '• Kualitas premium dengan standar internasional\n';
    desc += '• Desain ergonomis untuk kenyamanan maksimal\n';
    desc += '• Cocok untuk penggunaan sehari-hari maupun touring\n';

    return desc;
}

// Get category ID based on category name
function getCategoryId(categoryName) {
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

    return categoryMapping[categoryName.toLowerCase()] || '7de54f97-769a-4efc-a1cc-f0ce7c10b72e';
}

// Get brand ID - we'll create brands on the fly
function getBrandId(brandName) {
    const slug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `productBrand-${slug}`;
}

// Helper function to generate a unique key
function generateKey() {
    return Math.random().toString(36).substring(2, 12);
}

// Convert plain text to Portable Text format
function convertToPortableText(text) {
    if (!text || typeof text !== 'string') return [];

    const paragraphs = text.split('\n\n').filter(p => p.trim());

    return paragraphs.map(paragraph => ({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        markDefs: [],
        children: [
            {
                _type: 'span',
                _key: generateKey(),
                text: paragraph.replace(/\n/g, ' ').trim(),
                marks: []
            }
        ]
    }));
}

// Main processing
function processProducts() {
    console.log('🚀 Starting Perfect Product Conversion\n');
    console.log('='.repeat(60));

    const inputContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = inputContent.trim().split('\n').filter(line => line.trim());

    console.log(`📦 Found ${lines.length} products to process\n`);

    const outputLines = [];
    const brands = new Set();
    const stats = {
        processed: 0,
        brandsExtracted: 0,
        namesImproved: 0,
        errors: 0
    };

    for (let i = 0; i < lines.length; i++) {
        try {
            const product = JSON.parse(lines[i]);

            // 1. Extract proper product name
            const originalName = product.title || product.name;
            const properName = extractProductName(product);

            if (properName !== originalName) {
                stats.namesImproved++;
            }

            // 2. Extract brand
            let brand = null;
            const imagePath = product.images?.[0]?._sanityAsset || '';

            // Try from folder path first
            brand = extractBrandFromPath(imagePath);

            // Then try from description
            if (!brand) {
                brand = extractBrandFromDescription(product.description);
            }

            // Then try from product name
            if (!brand) {
                for (const key of Object.keys(brandDatabase)) {
                    if (properName.toLowerCase().includes(key)) {
                        brand = brandDatabase[key];
                        break;
                    }
                }
            }

            if (!brand) {
                brand = 'Universal';
            } else {
                stats.brandsExtracted++;
                brands.add(brand);
            }

            // 3. Parse specifications
            const specs = parseSpecifications(product.description);

            // 4. Get category
            const category = product.category || 'Accesories';

            // 5. Generate descriptions
            const shortDesc = generateShortDescription(properName, brand, category, specs);
            const longDesc = generateLongDescription(properName, brand, category, specs, product.description);

            // 6. Build final product object
            const finalProduct = {
                _type: 'product',
                _id: product._id,
                name: properName,
                slug: {
                    _type: 'slug',
                    current: product.slug?.current || product._id
                },
                images: product.images?.map(img => ({
                    _type: 'image',
                    _key: generateKey(),
                    _sanityAsset: img._sanityAsset
                })) || [],
                brand: {
                    _type: 'reference',
                    _ref: getBrandId(brand)
                },
                category: {
                    _type: 'reference',
                    _ref: getCategoryId(category)
                },
                description: convertToPortableText(shortDesc),
                longDescription: convertToPortableText(longDesc),
                price: product.price || 0,
                rating: Math.floor(Math.random() * 2) + 4,
                reviewCount: Math.floor(Math.random() * 50),
                sizes: specs.sizes.length > 0 ? specs.sizes : (product.sizes?.length > 0 ? product.sizes : ['Universal']),
                colors: specs.colors.length > 0 ? specs.colors : ['Black'],
                gender: 'Unisex',
                materials: specs.materials.length > 0 ? specs.materials : undefined,
                certification: specs.certification || undefined,
                specialFeatures: specs.features.length > 0 ? specs.features.slice(0, 5) : undefined,
                weight: specs.weight || 0.5
            };

            // Clean undefined fields
            Object.keys(finalProduct).forEach(key => {
                if (finalProduct[key] === undefined) {
                    delete finalProduct[key];
                }
            });

            outputLines.push(JSON.stringify(finalProduct));
            stats.processed++;

            // Progress
            if ((i + 1) % 50 === 0) {
                process.stdout.write(`\r   Processed ${i + 1}/${lines.length} products...`);
            }

        } catch (error) {
            console.error(`\n❌ Error processing line ${i + 1}: ${error.message}`);
            stats.errors++;
        }
    }

    // Write output
    fs.writeFileSync(outputFile, outputLines.join('\n') + '\n');

    // Create brands file
    const brandsArray = Array.from(brands).map(brandName => ({
        _type: 'productBrand',
        _id: getBrandId(brandName),
        title: brandName,
        slug: {
            _type: 'slug',
            current: brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
    }));

    fs.writeFileSync(
        path.join(__dirname, 'brands-to-import.ndjson'),
        brandsArray.map(b => JSON.stringify(b)).join('\n') + '\n'
    );

    // Print summary
    console.log('\n\n' + '='.repeat(60));
    console.log('✅ CONVERSION COMPLETE!\n');
    console.log(`📊 Statistics:`);
    console.log(`   • Products processed: ${stats.processed}`);
    console.log(`   • Names improved: ${stats.namesImproved}`);
    console.log(`   • Brands extracted: ${stats.brandsExtracted}`);
    console.log(`   • Unique brands found: ${brands.size}`);
    console.log(`   • Errors: ${stats.errors}`);
    console.log(`\n📁 Output files:`);
    console.log(`   • Products: ${outputFile}`);
    console.log(`   • Brands: ${path.join(__dirname, 'brands-to-import.ndjson')}`);
    console.log('\n🔧 Brands discovered:');
    Array.from(brands).sort().forEach(b => console.log(`   • ${b}`));
    console.log('\n' + '='.repeat(60));
}

processProducts();
