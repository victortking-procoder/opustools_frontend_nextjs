// src/lib/dynamic-utils.ts

// --- Type Definitions ---
interface DynamicData {
    primary_keywords: { [key: string]: string };
    all_keywords: { [key: string]: string[] };
}

// Interface for classes passed from the Server Component
interface ClassNames {
    seoTitle: string;
    description: string;
    seoSubtitle: string;
    faqItem: string;
    relatedLinks: string;
}

// --- Data Source ---
const dynamicData: DynamicData = {
    "primary_keywords": {
        "resize-image-in-inch": "image resizer inches",
        "resize-image-to-1000x1000": "1000x1000 images",
        "resize-image-to-100x100": "100x100 image",
        "resize-image-to-1024x1024": "1024x1024 image",
        "resize-image-to-1024x576": "1024x576",
        "resize-image-to-128x128": "128 x 128",
        "resize-image-to-150x150": "150 x 150",
        "resize-image-to-2-mb": "compress image to 2mb",
        "resize-image-to-200x200": "200x200",
        "resize-image-to-256x256": "256 x 256",
        "resize-image-to-400x400": "400x400 image",
        "resize-image-to-500-kb": "500kb",
        "resize-image-to-500x500": "500x500 image",
        "resize-image-to-50x50-mm": "50x50",
        "resize-image-to-512x512": "512x512 image",
        "resize-image-to-600x600": "600x600 pixels",
        "resize-image-to-64x64": "64x64 image converter",
        "resize-image-to-800x800": "800 x 800",
        "resize-image-to-840x840": "840 x 840 pixels",
        "resize-image-to-8x10-inch": "8x10 in cm",
        "stretch-image-online": "photo stretcher"
    },
    "all_keywords": {
        "resize-image-in-inch": [ "image resizer inches" ],
        "resize-image-to-1000x1000": [ "1000x1000 images", "1000 x 1000", "1000x100" ],
        "resize-image-to-100x100": [ "100x100 image" ],
        "resize-image-to-1024x1024": [ "1024x1024 image" ],
        "resize-image-to-1024x576": [ "1024x576" ],
        "resize-image-to-128x128": [ "128 x 128", "128x128" ],
        "resize-image-to-150x150": [ "150 x 150", "150x150" ],
        "resize-image-to-2-mb": [ "compress image to 2mb" ],
        "resize-image-to-200x200": [ "200x200" ],
        "resize-image-to-256x256": [ "256 x 256", "256x256", "256 x 256 image", "256x256 image" ],
        "resize-image-to-400x400": [ "400x400 image", "400 x 400" ],
        "resize-image-to-500-kb": [ "500kb", "500kb images" ],
        "resize-image-to-500x500": [ "500x500 image", "500 x 500", "500x500" ],
        "resize-image-to-50x50-mm": [ "50x50", "50x50=" ],
        "resize-image-to-512x512": [ "512x512 image", "512x512 images", "512x512" ],
        "resize-image-to-600x600": [ "600x600 pixels", "600 x 600", "600 x 600 pixels" ],
        "resize-image-to-64x64": [ "64x64 image converter", "64x64 image", "64 x 64" ],
        "resize-image-to-800x800": [ "800 x 800" ],
        "resize-image-to-840x840": [ "840 x 840 pixels" ],
        "resize-image-to-8x10-inch": [ "8x10 in cm", "8x10 photo size" ],
        "stretch-image-online": [ "photo stretcher" ]
    }
};

// --- Helper Functions for Intent and Related Links ---

const ALL_SLUGS = Object.keys(dynamicData.primary_keywords);

/**
 * Selects a random, unique subset of slugs for internal linking.
 * @param currentSlug - The slug of the current page, which is excluded.
 * @param count - The number of random slugs to return (default 10).
 */
const getRandomRelatedSlugs = (currentSlug: string, count: number = 10): { slug: string, keyword: string }[] => {
    const availableSlugs = ALL_SLUGS.filter(slug => slug !== currentSlug);
    
    // Create a copy for shuffling
    const slugsToShuffle = [...availableSlugs];

    // Fisher-Yates shuffle
    for (let i = slugsToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slugsToShuffle[i], slugsToShuffle[j]] = [slugsToShuffle[j], slugsToShuffle[i]];
    }

    const selectedSlugs = slugsToShuffle.slice(0, count);

    return selectedSlugs.map(slug => ({
        slug: slug,
        keyword: dynamicData.primary_keywords[slug]
    }));
};

const getKeywordType = (slug: string) => {
    if (slug.includes('kb') || slug.includes('mb')) return 'file_size';
    if (slug.includes('inch') || slug.includes('mm')) return 'unit_based';
    if (slug.includes('stretch')) return 'stretch';
    return 'dimension_based';
};

// Generates the deep HTML content, using passed classes for correct styling
export const getDepthContent = (primaryKeyword: string, slug: string, classes: ClassNames) => {
    const type = getKeywordType(slug);
    const allKeywords = dynamicData.all_keywords[slug] || []; 
    let h2Topic, mainBenefit, howToStep, faqQuestion, faqAnswer;

    // --- DEEP INTENT CONTENT REWRITE ---
    if (type === 'file_size') {
        h2Topic = `Bypass Upload Limits: Smart Compression to Exactly ${primaryKeyword.toUpperCase()}`;
        mainBenefit = `You need a precise file size—not just smaller. This is critical for university application portals, email attachments, or job submissions that enforce strict limits (e.g., must be under <strong>${primaryKeyword}</strong>). Our tool uses intelligent lossy and lossless compression to hit your target size with minimal visual impact.`;
        howToStep = `Simply input the target size (e.g., '500 KB') or use the slider for size control. Our system handles the pixel reduction and compression simultaneously.`;
        faqQuestion = `How does OpusTools resize an image to a specific file size like ${primaryKeyword}?`;
        faqAnswer = `Our proprietary algorithm analyzes the image content and applies the highest possible compression factor required to reach the target size, prioritizing visual quality until the final size constraint is met. It's a precise balance of pixel scaling and data reduction.`;
    } else if (type === 'unit_based') {
        h2Topic = `The Print-Ready Solution: Accurate ${primaryKeyword.toUpperCase()} Converter`;
        mainBenefit = `Digital pixels don't easily translate to physical prints. If you are preparing a document, passport photo, or poster, you need the reliable conversion of pixels to inches/mm based on DPI. Our tool locks in the physical size, ensuring your printed output is perfect.`;
        howToStep = `Upload your image, select 'Inches' or 'MM' as the unit, and specify the desired DPI (dots per inch), usually 300 for high-quality printing.`;
        faqQuestion = `Why do I need to worry about DPI when converting to ${primaryKeyword}?`;
        faqAnswer = `DPI (dots per inch) is the critical link between pixels and physical size. A high DPI (like 300) for a <strong>${primaryKeyword}</strong> photo ensures the image doesn't look pixelated when printed, as the tool adjusts the resolution accordingly.`;
    } else if (type === 'stretch') {
        h2Topic = `Creative Control: How to ${primaryKeyword.toUpperCase()} for Banners and Design`;
        mainBenefit = `Stretching or warping an image is a specific design requirement, often for background banners, unique thumbnails, or fitting a non-standard aspect ratio. Our stretcher allows you to force a width/height mismatch while providing visual feedback to manage distortion.`;
        howToStep = `Enter different values for width and height in the resizing fields (e.g., 800 width, 200 height) to force the stretch and preview the result before saving.`;
        faqQuestion = `Can stretching an image completely ruin its quality?`;
        faqAnswer = `Stretching will always introduce distortion, as pixels are interpolated. We use advanced scaling methods to minimize blockiness, but it is best used when visual fidelity can be compromised for a specific layout need.`;
    } else { // dimension_based
        h2Topic = `Pixel-Perfect Precision: Instantly Resize to ${primaryKeyword.toUpperCase()}`;
        mainBenefit = `Whether it's an exact avatar size, a social media post, or a specific platform requirement (like <strong>${primaryKeyword}</strong>), precision matters. Our tool ensures your image hits the exact pixel dimensions every time, maintaining aspect ratio unless you override it.`;
        howToStep = `Enter the target width and height in the pixel fields. For common square dimensions like <strong>${primaryKeyword}</strong>, simply enter the value in one field, and the other will auto-populate to maintain scale.`;
        faqQuestion = `What kind of images typically require a ${primaryKeyword} size?`;
        faqAnswer = `Square dimensions like <strong>${primaryKeyword}</strong> are standard for user avatars, small icons, specific social media thumbnails (like certain parts of LinkedIn/Twitter profiles), and many application submission forms.`;
    }

    // Generate the list of related keywords for completeness and depth (All 41 keywords)
    const keywordListHtml = allKeywords.length > 1
        ? `<h3 class="${classes.seoSubtitle}">Related Search Queries Handled by This Tool</h3>
           <p>This tool is designed to meet all variations of this size requirement, including search terms like: ${allKeywords.map(k => `<strong>${k}</strong>`).join(', ')}.</p>`
        : '';

    // Generate 10 random related dynamic pages (NEW REQUIREMENT)
    const relatedLinks = getRandomRelatedSlugs(slug, 10);
    
    // HTML block containing the 10 random internal links
    const internalLinksHtml = `
        <div class="${classes.relatedLinks}">
          <h2 class="${classes.seoTitle}">Explore 10 Related Resizing Tools (Internal Linking)</h2>
          <p class="${classes.description}">Need a different size? Our tool library covers every common dimension, unit, and file size requirement. Click a link below to jump straight to the exact tool you need:</p>
          <ul>
            ${relatedLinks.map(link => `
                <li><a href="/tools/image-resizer/${link.slug}" title="Resize image to ${link.keyword}">${link.keyword.charAt(0).toUpperCase() + link.keyword.slice(1)} Resizer Tool</a></li>
            `).join('')}
          </ul>
        </div>
    `;

    // Full HTML structure for the server component
    return `
        <h2 class="${classes.seoTitle}">${h2Topic}</h2>
        <p class="${classes.description}">${mainBenefit}</p>

        <h3 class="${classes.seoSubtitle}">Step-by-Step Guide for Resizing</h3>
        <p>
            The process is fast, simple, and requires no software download:
            <ol>
                <li><strong>Upload:</strong> Drag and drop your image file into the tool above.</li>
                <li><strong>Specify Requirements:</strong> ${howToStep}</li>
                <li><strong>Process:</strong> Click "Resize Image" and wait seconds.</li>
                <li><strong>Verify & Download:</strong> Check the size in the preview and download your high-quality resized file.</li>
            </ol>
        </p>

        ${keywordListHtml}

        <h2 class="${classes.seoTitle}">Frequently Asked Questions (FAQ)</h2>
        <div class="${classes.faqItem}">
            <h3 class="${classes.seoSubtitle}">${faqQuestion}</h3>
            <p>${faqAnswer}</p>
        </div>
        
        ${internalLinksHtml}

        <div class="${classes.relatedLinks}">
          <h2 class="${classes.seoTitle}">Complementary Tools</h2>
          <p>These essential tools complement your resizing needs:</p>
          <ul>
            <li><a href="/tools/image-compressor">Image Compressor</a> - Reduce file size further without changing dimensions.</li>
            <li><a href="/tools/image-converter">Image Converter</a> - Convert formats like PNG to JPG.</li>
            <li><a href="https://opustools.xyz/blog/the-ultimate-image-resizer-guide" target="_blank" rel="noopener noreferrer">The Ultimate Image Resizer Guide (External Link)</a></li>
          </ul>
        </div>
    `;
};

// --- Main Export Functions ---

// getToolDataBySlug now returns content with deep intent
export function getToolDataBySlug(slug: string) {
    const mainKeyword = dynamicData.primary_keywords[slug];
    if (!mainKeyword) return null;

    const formattedKeyword = mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1);
    const primaryTitle = `Resize Image to ${formattedKeyword} - Online Tool`;
    
    // Deep Intent Metadata Rewrites
    let description;
    const type = getKeywordType(slug);

    if (type === 'file_size') {
        description = `Instantly resize your images to exactly ${mainKeyword} to bypass any upload limits. Our smart compressor maintains the best quality while hitting your precise file size target.`;
    } else if (type === 'unit_based') {
        description = `Convert image size from pixels to ${mainKeyword} with perfect DPI accuracy for printing documents, passports, or professional photo paper. Free and instant conversion.`;
    } else if (type === 'stretch') {
        description = `Use our online image stretcher to force resize your image to fit non-standard banners or backgrounds. Quickly distort and scale your photo to ${mainKeyword}.`;
    } else { // dimension_based
        description = `Need an exact size? Use our free tool to precisely resize your image to ${mainKeyword}. Perfect for social media avatars, profile headers, or application forms.`;
    }

    return {
        // 1. Metadata & Titles
        title: `${primaryTitle} - OpusTools`,
        description: description,
        // 2. Data for Server Component logic
        h1Text: `Free Online Tool to Resize Image to ${formattedKeyword}`,
        introParagraph: `When your project demands an exact size of ${mainKeyword}, our tool provides pixel-perfect accuracy. Use it to quickly transform your photo for any digital or print requirement.`,
        mainKeyword: mainKeyword,
    };
}

export function getSlugs() {
    return Object.keys(dynamicData.primary_keywords).map(slug => ({ slug }));
}