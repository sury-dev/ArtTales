import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('Building the client...');
  execSync('npm run build', { cwd: path.join(__dirname, './client'), stdio: 'inherit' });


} catch (error) {
  console.error('Error during installation:', error);
  process.exit(1);
}
