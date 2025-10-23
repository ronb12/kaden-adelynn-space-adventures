// Script to generate PNG versions of icons for better browser compatibility
const fs = require('fs');
const path = require('path');

// Create a simple PNG icon using a data URL approach
// For production, you would use a proper image generation library like sharp or canvas
const createPNGIcon = (size) => {
  const [width, height] = size.split('x').map(Number);
  
  // Create a simple SVG that can be converted to PNG
  const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#000033"/>
    <rect x="${width * 0.1}" y="${height * 0.1}" width="${width * 0.8}" height="${height * 0.8}" fill="#00aaff" rx="${width * 0.1}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width * 0.4}" fill="white" text-anchor="middle" dominant-baseline="central">🚀</text>
  </svg>`;
  
  // For now, we'll create a simple text file that represents the PNG
  // In a real implementation, you would convert SVG to PNG
  return `# PNG Icon ${size}\n# This is a placeholder for the actual PNG file\n# In production, convert the SVG to PNG format`;
};

// Icon sizes that need PNG versions
const iconSizes = [
  '16x16', '32x32', '72x72', '96x96', '128x128', 
  '144x144', '150x150', '152x152', '180x180', 
  '192x192', '384x384', '512x512'
];

// Ensure icons directory exists
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generating PNG icon placeholders...');

// Generate PNG icon placeholders
iconSizes.forEach(size => {
  const pngContent = createPNGIcon(size);
  const filePath = path.join(iconsDir, `icon-${size}.png`);
  
  // For now, create a text file as placeholder
  // In production, you would generate actual PNG files
  fs.writeFileSync(filePath, pngContent);
  console.log(`✅ Generated icon-${size}.png placeholder`);
});

console.log('🎉 PNG icon placeholders generated!');
console.log('📝 Note: Replace these with actual PNG files for production use.');
