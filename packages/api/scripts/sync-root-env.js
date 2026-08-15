const fs = require('fs')
const path = require('path')

const rootEnvPath = path.resolve(__dirname, '../../../.env')
const localEnvPath = path.resolve(__dirname, '../.env.local')

if (!fs.existsSync(rootEnvPath)) {
  console.warn(`[sync-root-env] Root env not found at ${rootEnvPath}`)
  process.exit(0)
}

fs.copyFileSync(rootEnvPath, localEnvPath)
console.log(`[sync-root-env] Copied ${rootEnvPath} -> ${localEnvPath}`)