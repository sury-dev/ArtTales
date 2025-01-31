import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Run npm install in the parent folder
  console.log('Installing dependencies in the parent folder...');
  execSync('npm install', { cwd: path.join(__dirname, './client'), stdio: 'inherit' });

  // Run npm install in the root folder
  console.log('Installing dependencies in the root folder...');
  execSync('npm install', { stdio: 'inherit' });

} catch (error) {
  console.error('Error during installation:', error);
  process.exit(1);
}
