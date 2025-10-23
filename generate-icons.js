// Simple script to generate placeholder icons for PWA
// In a real project, you would use proper icon generation tools

const fs = require('fs');
const path = require('path');

// Create placeholder icon files (these would normally be actual images)
const iconSizes = [
  { size: '16x16', name: 'icon-16x16.png' },
  { size: '32x32', name: 'icon-32x32.png' },
  { size: '72x72', name: 'icon-72x72.png' },
  { size: '96x96', name: 'icon-96x96.png' },
  { size: '128x128', name: 'icon-128x128.png' },
  { size: '144x144', name: 'icon-144x144.png' },
  { size: '150x150', name: 'icon-150x150.png' },
  { size: '152x152', name: 'icon-152x152.png' },
  { size: '180x180', name: 'icon-180x180.png' },
  { size: '192x192', name: 'icon-192x192.png' },
  { size: '384x384', name: 'icon-384x384.png' },
  { size: '512x512', name: 'icon-512x512.png' }
];

// Create a simple SVG icon as placeholder
const createPlaceholderIcon = (size) => {
  const [width, height] = size.split('x').map(Number);
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#000033"/>
    <rect x="${width * 0.1}" y="${height * 0.1}" width="${width * 0.8}" height="${height * 0.8}" fill="#00aaff" rx="${width * 0.1}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width * 0.4}" fill="white" text-anchor="middle" dominant-baseline="central">🚀</text>
  </svg>`;
};

// Create favicon
const createFavicon = () => {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#000033"/>
    <rect x="3" y="3" width="26" height="26" fill="#00aaff" rx="3"/>
    <text x="16" y="20" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">🚀</text>
  </svg>`;
};

// Ensure icons directory exists
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generating placeholder icons...');

// Generate placeholder icons
iconSizes.forEach(icon => {
  const svgContent = createPlaceholderIcon(icon.size);
  const filePath = path.join(iconsDir, icon.name.replace('.png', '.svg'));
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Generated ${icon.name.replace('.png', '.svg')}`);
});

// Generate favicon
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
const faviconSvg = createFavicon();
fs.writeFileSync(faviconPath.replace('.ico', '.svg'), faviconSvg);
console.log('✅ Generated favicon.svg');

// Create browserconfig.xml
const browserconfigContent = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/icons/icon-150x150.svg"/>
            <TileColor>#00aaff</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

fs.writeFileSync(path.join(__dirname, 'public', 'browserconfig.xml'), browserconfigContent);
console.log('✅ Generated browserconfig.xml');

console.log('🎉 All placeholder icons generated successfully!');
console.log('📝 Note: For production, replace these SVG placeholders with actual PNG icons.');
