const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables from root .env.local
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
    console.log("Loaded root .env.local environment variables successfully in emulator.");
  }
} catch (err) {
  console.warn("Failed to load root .env.local file in emulator:", err.message);
}

// Intercept firebase-admin
const mockAdmin = require('./mock-firebase-admin');
require.cache[require.resolve('firebase-admin')] = {
  id: require.resolve('firebase-admin'),
  filename: require.resolve('firebase-admin'),
  loaded: true,
  exports: mockAdmin
};

// Capture the express app passed to onRequest
let capturedApp = null;
const mockFunctionsHttps = {
  onRequest: (options, app) => {
    if (typeof options === 'function') {
      capturedApp = options;
    } else {
      capturedApp = app;
    }
    return capturedApp;
  }
};

require.cache[require.resolve('firebase-functions/v2/https')] = {
  id: require.resolve('firebase-functions/v2/https'),
  filename: require.resolve('firebase-functions/v2/https'),
  loaded: true,
  exports: mockFunctionsHttps
};

// Load functions/index.js
require('./index');

if (!capturedApp) {
  console.error("Failed to capture Express app from functions/index.js");
  process.exit(1);
}

// Wrap the capturedApp in a mainApp to route all emulator requests correctly
const mainApp = express();
mainApp.use(cors({ origin: '*' }));
mainApp.use(express.json());

mainApp.use((req, res, next) => {
  console.log(`[Incoming Request] ${req.method} ${req.url}`);
  next();
});

mainApp.use('/hernova-13f01/us-central1/api', capturedApp);

const PORT = 5001;
mainApp.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Mock Firebase Emulator running at:`);
  console.log(`  http://127.0.0.1:${PORT}/hernova-13f01/us-central1/api`);
  console.log(`======================================================\n`);
});
