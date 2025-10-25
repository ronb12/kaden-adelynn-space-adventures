#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Kaden & Adelynn Space Adventures Multiplayer Server...\n');

// Check if server directory exists
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found. Please ensure the server files are in place.');
  process.exit(1);
}

// Check if package.json exists
const packageJsonPath = path.join(serverDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Server package.json not found. Please ensure the server is properly set up.');
  process.exit(1);
}

// Install dependencies if node_modules doesn't exist
const nodeModulesPath = path.join(serverDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing server dependencies...');
  
  const npmInstall = spawn('npm', ['install'], {
    cwd: serverDir,
    stdio: 'inherit',
    shell: true
  });
  
  npmInstall.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully');
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🌐 Starting multiplayer server...');
  console.log('📡 WebSocket server will be available at: ws://localhost:8080');
  console.log('🌍 HTTP server will be available at: http://localhost:8080');
  console.log('💾 Data persistence enabled');
  console.log('🔄 Auto-save every 30 seconds');
  console.log('\nPress Ctrl+C to stop the server\n');
  
  const server = spawn('node', ['multiplayer-server.js'], {
    cwd: serverDir,
    stdio: 'inherit',
    shell: true
  });
  
  server.on('close', (code) => {
    console.log(`\n🛑 Server stopped with code ${code}`);
  });
  
  server.on('error', (error) => {
    console.error('❌ Server error:', error);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
  });
}
