import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const commitDate = execSync('git log -1 --format=%cd').toString().trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.GIT_HASH": JSON.stringify(commitHash),
    "import.meta.env.GIT_DATE": JSON.stringify(commitDate),
    "import.meta.env.GIT_BRANCH": JSON.stringify(branch),
  },
  plugins: [react()],
})
