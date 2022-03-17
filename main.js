
const core = require("@actions/core")
const exec = require("@actions/exec")
const io = require("@actions/io")
const tc = require("@actions/tool-cache")

const path = require("path")

const BUILD_PREFIX = ".openresty"

const main = async () => {
  const openrestyVersion = core.getInput('openrestyVersion', { required: true })

  const extractPath = path.join(process.cwd(), BUILD_PREFIX, `openresty-${openrestyVersion}`)
  
  const sourceTar = await tc.downloadTool(`https://openresty.org/download/openresty-${openrestyVersion}.tar.gz`)
  
  await io.mkdirP(extractPath)
  await tc.extractTar(sourceTar, BUILD_PREFIX)

  await exec.exec(`./configure"`, undefined, {
    cwd: extractPath
  })

  await exec.exec(`make`, undefined, {
    cwd: extractPath
  })

  await exec.exec(`sudo make install`, undefined, {
    cwd: extractPath
  })

  core.addPath("/usr/local/openresty/bin")
}


main().catch(err => {
  core.setFailed(`Failed to install OpenResty: ${err}`);
})
