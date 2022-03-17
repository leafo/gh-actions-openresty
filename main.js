
const core = require("@actions/core")
const exec = require("@actions/exec")
const io = require("@actions/io")
const tc = require("@actions/tool-cache")

const path = require("path")

const BUILD_PREFIX = ".openresty"

const main = async () => {
  const openrestyVersion = core.getInput('openrestyVersion', { required: true })

  const luaRocksExtractPath = path.join(process.cwd(), BUILD_PREFIX, `luarocks-${luaRocksVersion}`)
  
  const sourceTar = await tc.downloadTool(`https://openresty.org/download/openresty-${openrestyVersion}.tar.gz`)
  
  await io.mkdirP(luaRocksExtractPath)
  await tc.extractTar(sourceTar, INSTALL_PREFIX)
}



main().catch(err => {
  core.setFailed(`Failed to install OpenResty: ${err}`);
})
