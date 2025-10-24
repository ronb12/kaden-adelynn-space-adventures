#!/usr/bin/env node

const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const buildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir: 'build',
  platform: 'browser',
  target: 'es2020',
  format: 'iife',
  globalName: 'KadenAdelynnGame',
  minify: isProduction,
  sourcemap: !isProduction,
  define: {
    'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
  },
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.ts': 'tsx',
    '.tsx': 'tsx',
    '.svg': 'text',
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.gif': 'dataurl',
    '.webp': 'dataurl',
  },
  external: [],
  plugins: [
    {
      name: 'copy-public-and-inject',
      setup(build) {
        build.onEnd(async (result) => {
          if (result.errors.length === 0) {
            const fs = require('fs');
            const path = require('path');
            const { execSync } = require('child_process');
            
            // Copy public files
            try {
              execSync('cp -r public/* build/', { stdio: 'inherit' });
              console.log('✅ Public files copied');
            } catch (error) {
              console.log('⚠️ Some public files may not exist');
            }
            
            // Inject script and CSS into HTML
            const htmlPath = path.join('build', 'index.html');
            if (fs.existsSync(htmlPath)) {
              let html = fs.readFileSync(htmlPath, 'utf8');
              
              // Add CSS link before closing head tag
              html = html.replace('</head>', '  <link rel="stylesheet" href="/index.css">\n  </head>');
              
              // Add script tag before closing body tag
              html = html.replace('</body>', '  <script src="/index.js"></script>\n  </body>');
              
              fs.writeFileSync(htmlPath, html);
              console.log('✅ Script and CSS injected into HTML');
            }
          }
        });
      },
    },
  ],
};

async function build() {
  try {
    console.log('🚀 Building with esbuild...');
    const startTime = Date.now();
    
    await esbuild.build(buildOptions);
    
    const endTime = Date.now();
    const buildTime = endTime - startTime;
    
    console.log(`✅ Build completed in ${buildTime}ms`);
    console.log('📦 Output directory: build/');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
