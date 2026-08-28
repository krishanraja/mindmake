/**
 * Favicon Generator Script
 * 
 * Generates all required favicon sizes from the source mindmake-icon.png
 * 
 * Run: npm run generate-favicons
 */

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Source icon (the green gradient Mindmake icon)
const sourceIcon = path.join(publicDir, 'mindmake-icon.png');

// All favicon sizes needed for complete browser/device support
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 70, name: 'favicon-70x70.png' },      // Windows tile
  { size: 96, name: 'favicon-96x96.png' },
  { size: 144, name: 'favicon-144x144.png' },   // Windows tile
  { size: 150, name: 'favicon-150x150.png' },   // Windows tile
  { size: 180, name: 'apple-touch-icon.png' },  // Apple Touch Icon
  { size: 192, name: 'favicon-192x192.png' },   // Android Chrome
  { size: 310, name: 'favicon-310x310.png' },   // Windows tile
  { size: 512, name: 'favicon-512x512.png' },   // PWA/Android
];

async function generateFavicons() {
  console.log('🎨 Generating favicons from:', sourceIcon);
  
  // Check if source exists
  try {
    await fs.access(sourceIcon);
  } catch {
    console.error('❌ Source icon not found:', sourceIcon);
    process.exit(1);
  }

  const sourceBuffer = await fs.readFile(sourceIcon);
  
  // Generate each size
  for (const { size, name } of sizes) {
    const outputPath = path.join(publicDir, name);
    
    // Determine if this icon needs an opaque background
    // iOS apple-touch-icon requires opaque background
    // Windows tiles work better with backgrounds
    const needsBackground = name === 'apple-touch-icon.png' || 
                           name.includes('favicon-70x70') ||
                           name.includes('favicon-144x144') ||
                           name.includes('favicon-150x150') ||
                           name.includes('favicon-310x310');
    
    if (needsBackground) {
      // Create a dark background and composite the icon on top
      const background = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 10, g: 10, b: 11, alpha: 255 } // #0A0A0B background
        }
      }).png().toBuffer();
      
      // Resize the icon
      const resizedIcon = await sharp(sourceBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent for resize
        })
        .png()
        .toBuffer();
      
      // Composite icon onto dark background
      await sharp(background)
        .composite([{ input: resizedIcon, blend: 'over' }])
        .png()
        .toFile(outputPath);
    } else {
      // Generate with transparent background
      await sharp(sourceBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background
        })
        .png()
        .toFile(outputPath);
    }
    
    console.log(`✅ Generated: ${name} (${size}x${size})${needsBackground ? ' [with background]' : ' [transparent]'}`);
  }

  // Generate ICO file (contains 16x16, 32x32, 48x48)
  console.log('🔧 Generating favicon.ico...');
  
  const icoBuffer = await pngToIco([
    path.join(publicDir, 'favicon-16x16.png'),
    path.join(publicDir, 'favicon-32x32.png'),
    path.join(publicDir, 'favicon-48x48.png'),
  ]);
  
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✅ Generated: favicon.ico (16x16, 32x32, 48x48)');
  
  // Generate transparent 32x32 as a fallback favicon.png
  await sharp(sourceBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background
    })
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('✅ Generated: favicon.png (32x32 fallback, transparent)');
  console.log('\n🎉 Favicon generation complete!');
  console.log('\n📝 Test your favicons at: https://realfavicongenerator.net/favicon_checker');
}

generateFavicons().catch(console.error);

