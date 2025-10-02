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

// --- Data Source (41 Keywords mapped to 21 Unique Slugs) ---
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

// --- Helper Functions ---

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
    let h2Topic, mainBenefit, howToStep, faqQuestion;

    if (type === 'file_size') {
        h2Topic = `Achieving the Perfect ${primaryKeyword.toUpperCase()} File Size`;
        mainBenefit = `This is essential for uploads to platforms that enforce strict file size limits, like government portals or email attachments. Our tool uses smart compression and scaling to help you hit the exact <strong>${primaryKeyword}</strong> target while preserving maximum quality.`;
        howToStep = `Simply input the target size (e.g., '500 KB') or the desired pixel dimensions into the respective fields.`;
        faqQuestion = `Will resizing to ${primaryKeyword} affect my image quality?`;
    } else if (type === 'unit_based') {
        h2Topic = `The High-Precision ${primaryKeyword.toUpperCase()} Tool`;
        mainBenefit = `Converting from pixels to units like inches or millimeters is critical for printing and professional documentation. Our resizer handles this complex conversion instantly and accurately.`;
        howToStep = `Use our advanced options to specify the desired physical unit (inches, mm, cm) and the required DPI/PPI.`;
        faqQuestion = `How does OpusTools convert pixels to ${primaryKeyword}?`;
    } else if (type === 'stretch') {
        h2Topic = `Advanced ${primaryKeyword.toUpperCase()} Functionality`;
        mainBenefit = `The ability to stretch an image is required for specific background or banner designs. We provide this feature while offering controls to minimize distortion artifacts.`;
        howToStep = `Enter different values for width and height to force the image stretch.`;
        faqQuestion = `Is stretching an image bad for quality?`;
    } else {
        h2Topic = `Exact Pixel ${primaryKeyword.toUpperCase()} Resizer`;
        mainBenefit = `You need exact pixel matches for avatars, social media banners, or web assets. Our tool focuses on preserving your image's aspect ratio while hitting the precise <strong>${primaryKeyword}</strong> dimensions.`;
        howToStep = `Enter the target width and height in pixels. For example, enter '256' for both fields for the <strong>${primaryKeyword}</strong> conversion.`;
        faqQuestion = `What is the best way to resize an image to ${primaryKeyword}?`;
    }

    const keywordListHtml = allKeywords.length > 1
        ? `<h3 class="${classes.seoSubtitle}">Related Image Resizer Keywords</h3>
           <p>Our tool addresses all related search queries, including variations like: <strong>${allKeywords.join(', ')}</strong>.</p>`
        : '';

    // Full HTML structure using the passed dynamic class names (Fix for Error 2)
    return `
        <h2 class="${classes.seoTitle}">${h2Topic}</h2>
        <p class="${classes.description}">${mainBenefit}</p>

        <h3 class="${classes.seoSubtitle}">How to Use the OpusTools Resizer for ${primaryKeyword}</h3>
        <p>
            <ol>
                <li><strong>Upload:</strong> Drag and drop your image file into the tool above.</li>
                <li><strong>Specify:</strong> ${howToStep}</li>
                <li><strong>Resize:</strong> Click the "Resize Image" button.</li>
                <li><strong>Download:</strong> Your newly resized file will be available in seconds.</li>
            </ol>
        </p>

        ${keywordListHtml}

        <h2 class="${classes.seoTitle}">Frequently Asked Questions (FAQ) about ${primaryKeyword}</h2>
        <div class="${classes.faqItem}">
            <h3 class="${classes.seoSubtitle}">${faqQuestion}</h3>
            <p>For dimension-based resizing, we maintain the highest quality possible. For file-size targets (like <strong>${primaryKeyword}</strong>), some intelligent compression is required, but our algorithms prioritize minimal visual loss. Always use a high-resolution source image for the best results.</p>
        </div>
        
        <div class="${classes.relatedLinks}">
          <h2>Related Tools & Guides</h2>
          <p>You may also be interested in:</p>
          <ul>
            <li><a href="/tools/image-compressor">Image Compressor</a> - Make your resized image even smaller for faster loading.</li>
            <li><a href="/tools/image-converter">Image Converter</a> - Change your image to JPG, PNG, and more after resizing.</li>
            <li><a href="https://opustools.xyz/blog/the-ultimate-image-resizer-guide" target="_blank" rel="noopener noreferrer">Read our complete guide on Mastering Image Resizing</a></li>
          </ul>
        </div>
    `;
};

// --- Main Export Functions ---

// Returns the full data needed by the Server Component
export function getToolDataBySlug(slug: string) {
    const mainKeyword = dynamicData.primary_keywords[slug];
    if (!mainKeyword) return null;

    const formattedKeyword = mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1);
    const primaryTitle = `Free Online Tool to ${formattedKeyword}`;

    return {
        // 1. Metadata & Titles
        title: `${primaryTitle} - OpusTools`,
        description: `Use our free, fast, and secure online tool to instantly ${mainKeyword} without losing quality. Perfect for all file types and for achieving precise dimensions or file sizes.`,
        // 2. Data for Server Component logic
        h1Text: primaryTitle,
        introParagraph: `When you need to ${mainKeyword}, precision is key. Our online resizer is designed for high-accuracy pixel, unit, and file size resizing, ensuring you meet all your specific upload requirements.`,
        mainKeyword: mainKeyword, // Important for calling getDepthContent
    };
}

export function getSlugs() {
    return Object.keys(dynamicData.primary_keywords).map(slug => ({ slug }));
}