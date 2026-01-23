const { createClient } = require('@sanity/client');

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

// Gaya tulisan anak motor - frasa gaul
const bikerPhrases = {
    opening: [
        "Buat lu yang doyan touring atau daily riding",
        "Nih bro, buat para rider sejati",
        "Buat kalian yang sering gas pol di jalanan",
        "Khusus buat rider yang ngerti kualitas",
        "Para sunmori warrior, merapat!",
        "Buat lu yang serius soal safety riding",
        "Rider-rider yang paham kenyamanan, wajib punya ini",
    ],
    quality: [
        "Kualitasnya ga perlu diragukan lagi bro",
        "Build quality-nya mantep banget",
        "Produk ini udah terbukti kualitasnya",
        "Material premium yang awet dipake",
        "Standar kualitas internasional nih",
    ],
    comfort: [
        "Dijamin nyaman banget dipake seharian",
        "Ergonomis dan ga bikin pegel",
        "Comfort level-nya juara",
        "Nyaman dipake buat jarak jauh maupun pendek",
    ],
    safety: [
        "Safety first, bro!",
        "Perlindungan maksimal untuk ride lu",
        "Proteksi yang bikin lu tenang di jalan",
        "Keamanan berkendara jadi prioritas utama",
    ],
    closing: [
        "Buruan checkout sebelum kehabisan!",
        "Jangan sampai nyesel ga punya!",
        "Gas langsung order, bro!",
        "Wajib masuk wishlist rider sejati!",
        "Yang serius riding, pasti butuh ini!",
    ]
};

// Category-specific content
const categoryContent = {
    helmets: {
        intro: "Helm yang lu pake itu cerminan karakter lu di jalan, bro!",
        features: [
            "Shell kokoh anti benturan keras",
            "Ventilasi optimal biar ga gerah",
            "Visor jernih anti kabut",
            "Inner lining yang bisa dicopot dan dicuci",
            "Padding empuk yang nyaman di kepala"
        ],
        benefits: [
            "Kepala lu aman, ride lu tenang",
            "Ga bikin pusing walau dipake lama",
            "Look yang keren bikin makin pede",
            "Cocok buat sunmori sampai touring jauh"
        ]
    },
    gloves: {
        intro: "Sarung tangan bukan cuma aksesoris, tapi perlindungan penting buat tangan lu!",
        features: [
            "Knuckle protector yang kokoh",
            "Palm grip yang anti-slip",
            "Material breathable biar ga keringetan",
            "Touch screen friendly",
            "Velcro strap yang adjustable"
        ],
        benefits: [
            "Grip ke gas dan kopling makin mantep",
            "Tangan terlindungi dari angin dan benturan",
            "Tetep bisa main HP tanpa lepas sarung tangan",
            "Nyaman dipake buat long ride"
        ]
    },
    jackets: {
        intro: "Jaket riding itu investasi, bro! Bukan cuma gaya, tapi juga proteksi!",
        features: [
            "Built-in protector di bahu dan siku",
            "Material tahan angin dan air",
            "Ventilasi yang bikin adem",
            "Reflective strip buat visibility malam hari",
            "Multiple pocket buat simpen barang"
        ],
        benefits: [
            "Body lu terlindungi maksimal",
            "Tetep adem walau riding di siang bolong",
            "Look yang keren dan profesional",
            "Tahan cuaca Indonesia yang unpredictable"
        ]
    },
    boots: {
        intro: "Kaki lu itu penting banget buat shifting dan braking, lindungi dengan boots yang bener!",
        features: [
            "Ankle protection yang solid",
            "Sole anti-slip",
            "Waterproof layer",
            "Shift pad yang awet",
            "Resleting atau velcro yang gampang dipake"
        ],
        benefits: [
            "Kaki aman dari benturan dan terjepit",
            "Grip ke footpeg makin mantep",
            "Tetep nyaman walau kehujanan",
            "Gampang dipake dan dicopot"
        ]
    },
    intercom: {
        intro: "Komunikasi itu penting banget buat riding bareng, apalagi touring!",
        features: [
            "Koneksi Bluetooth stabil",
            "Noise cancellation yang oke",
            "Battery life yang tahan lama",
            "Waterproof rating",
            "Pairing mudah dengan device lain"
        ],
        benefits: [
            "Ngobrol sama riding buddy tanpa ribet",
            "Denger musik sambil riding",
            "Terima telepon tanpa perlu berhenti",
            "Koordinasi rombongan jadi gampang"
        ]
    },
    accesories: {
        intro: "Aksesoris motor itu yang bikin riding experience lu makin komplit!",
        features: [
            "Build quality yang premium",
            "Desain yang fungsional",
            "Material yang awet",
            "Easy installation"
        ],
        benefits: [
            "Bikin motor lu makin kece",
            "Fungsional buat daily use",
            "Value for money yang oke banget",
            "Upgrade riding experience lu"
        ]
    },
    storage: {
        intro: "Buat touring atau daily, storage yang proper itu wajib punya!",
        features: [
            "Kapasitas yang lega",
            "Material tahan air",
            "Easy mounting system",
            "Lock system yang secure"
        ],
        benefits: [
            "Bawa barang banyak ga ribet",
            "Barang aman walau kehujanan",
            "Gampang dipasang dan dicopot",
            "Cocok buat touring panjang"
        ]
    },
    tires: {
        intro: "Ban itu satu-satunya kontak motor lu sama aspal, jangan main-main!",
        features: [
            "Compound berkualitas tinggi",
            "Pattern yang optimal",
            "Grip basah dan kering",
            "Durability yang tinggi"
        ],
        benefits: [
            "Grip maksimal di segala kondisi",
            "Handling motor jadi lebih responsive",
            "Awet dipake lama",
            "Safety berkendara meningkat"
        ]
    }
};

// Helper function to generate random item from array
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to generate unique key
function generateKey() {
    return Math.random().toString(36).substring(2, 12);
}

// Generate biker-style short description
function generateShortDescription(productName, brandTitle, categoryTitle) {
    const category = categoryTitle?.toLowerCase() || 'accesories';

    let desc = `${random(bikerPhrases.opening)}, ${productName}`;

    if (brandTitle && brandTitle !== 'Universal' && brandTitle !== 'Others') {
        desc += ` dari ${brandTitle}`;
    }

    desc += ` hadir buat melengkapi riding gear lu. ${random(bikerPhrases.quality)}. `;
    desc += random(bikerPhrases.closing);

    // Limit to 200 chars
    if (desc.length > 200) {
        desc = desc.substring(0, 197) + '...';
    }

    return desc;
}

// Generate biker-style long description
function generateLongDescription(productName, brandTitle, categoryTitle, specs = {}) {
    const category = categoryTitle?.toLowerCase() || 'accesories';
    const content = categoryContent[category] || categoryContent.accesories;

    let desc = '';

    // Opening
    desc += `🏍️ **${productName.toUpperCase()}**\n\n`;

    if (brandTitle && brandTitle !== 'Universal' && brandTitle !== 'Others') {
        desc += `${random(bikerPhrases.opening)}, **${productName}** dari **${brandTitle}** siap nemenin perjalanan lu!\n\n`;
    } else {
        desc += `${random(bikerPhrases.opening)}, **${productName}** siap jadi partner setia di setiap ride lu!\n\n`;
    }

    // Category intro
    desc += `${content.intro}\n\n`;

    // Features section
    desc += `## 🔧 FITUR UNGGULAN\n\n`;
    const features = specs.specialFeatures?.length > 0 ? specs.specialFeatures : content.features;
    features.slice(0, 5).forEach(f => {
        desc += `✅ ${f}\n`;
    });
    desc += '\n';

    // Specs if available
    if (specs.materials?.length > 0 || specs.certification || specs.weight) {
        desc += `## 📋 SPESIFIKASI\n\n`;
        if (specs.materials?.length > 0) {
            desc += `• **Material:** ${specs.materials.join(', ')}\n`;
        }
        if (specs.certification) {
            desc += `• **Sertifikasi:** ${specs.certification}\n`;
        }
        if (specs.weight && specs.weight > 0) {
            desc += `• **Berat:** ${specs.weight < 1 ? (specs.weight * 1000).toFixed(0) + 'g' : specs.weight.toFixed(2) + ' kg'}\n`;
        }
        desc += '\n';
    }

    // Benefits section
    desc += `## 💪 KENAPA HARUS PUNYA?\n\n`;
    content.benefits.forEach(b => {
        desc += `🔥 ${b}\n`;
    });
    desc += '\n';

    // Quality assurance
    desc += `## ⭐ JAMINAN KUALITAS\n\n`;
    desc += `${random(bikerPhrases.quality)}. ${random(bikerPhrases.comfort)} `;
    desc += `${random(bikerPhrases.safety)}\n\n`;

    // Closing
    desc += `---\n\n`;
    desc += `💨 **${random(bikerPhrases.closing)}**\n\n`;
    desc += `🛒 _Ready stock, langsung kirim! Jangan sampai kehabisan, bro!_`;

    return desc;
}

// Convert to Portable Text
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
                text: paragraph.replace(/\n/g, ' ').replace(/\*\*/g, '').replace(/[#_]/g, '').trim(),
                marks: []
            }
        ]
    }));
}

// Main function to update descriptions
async function updateDescriptions() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   UPDATE DESKRIPSI PRODUK - GAYA ANAK MOTOR 🏍️');
    console.log(`   Project: ${projectId}`);
    console.log(`   Dataset: ${dataset}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // Fetch all products with their related data
        console.log('📦 Fetching products from Sanity...');

        const products = await client.fetch(`
      *[_type == "product"]{
        _id,
        name,
        brand->{title},
        category->{title},
        materials,
        certification,
        specialFeatures,
        weight
      }
    `);

        console.log(`   Found ${products.length} products to update.\n`);

        let updated = 0;
        let errors = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            try {
                process.stdout.write(`\r   Updating ${i + 1}/${products.length}: ${product.name?.substring(0, 35) || 'Unknown'}...`);

                // Generate new descriptions
                const shortDesc = generateShortDescription(
                    product.name,
                    product.brand?.title,
                    product.category?.title
                );

                const longDesc = generateLongDescription(
                    product.name,
                    product.brand?.title,
                    product.category?.title,
                    {
                        materials: product.materials,
                        certification: product.certification,
                        specialFeatures: product.specialFeatures,
                        weight: product.weight
                    }
                );

                // Update product with patch (tidak upload ulang gambar!)
                await client
                    .patch(product._id)
                    .set({
                        description: convertToPortableText(shortDesc),
                        longDescription: convertToPortableText(longDesc)
                    })
                    .commit();

                updated++;

            } catch (error) {
                console.log(`\n   ❌ Error updating ${product._id}: ${error.message}`);
                errors++;
            }
        }

        console.log(`\n\n✅ Update complete!`);
        console.log(`   Successfully updated: ${updated} products`);
        console.log(`   Errors: ${errors}`);

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('   DONE! Deskripsi produk udah diupdate dengan gaya anak motor 🔥');
        console.log('═══════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

updateDescriptions();
