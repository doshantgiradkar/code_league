#!/usr/bin/env node
// Start both server and React app in development mode

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Code League development environment...\n');

// Start server
console.log('📦 Starting Gemini API server on port 3001...');
const server = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: true
});

// Wait a moment for server to start, then start React app
setTimeout(() => {
    console.log('\n⚛️  Starting React app on port 5173...');
    const client = spawn('npm', ['run', 'dev'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    // Handle cleanup on exit
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Shutting down...');
        server.kill();
        client.kill();
        process.exit(0);
    });
}, 2000);
