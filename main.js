
const core = require("@actions/core")
const exec = require("@actions/exec")
const io = require("@actions/io")
const tc = require("@actions/tool-cache")

const path = require("path")

const BUILD_PREFIX = ".openresty"

const makeCacheKey = openrestyVersion => `openresty-${openrestyVersion}-${process.platform}-${process.arch}`

const main = async () => {
  const openrestyVersion = core.getInput('openrestyVersion', { required: true })

  const extractPath = path.join(process.cwd(), BUILD_PREFIX, `openresty-${openrestyVersion}`)

  const cachePaths = [".openresty"]
  const cacheKey = makeCacheKey(openrestyVersion)

  let restoredCache = null

  if (core.getInput('buildCache') == 'true') {
    restoredCache = await cache.restoreCache(cachePaths, cacheKey)
    core.info(`Cache restored: ${restoredCache}`)
  }

  if (!restoredCache) {
    const sourceTar = await tc.downloadTool(`https://openresty.org/download/openresty-${openrestyVersion}.tar.gz`)

    await io.mkdirP(extractPath)
    await tc.extractTar(sourceTar, BUILD_PREFIX)

    await exec.exec(`./configure"`, undefined, {
      cwd: extractPath
    })

    await exec.exec(`make`, undefined, {
      cwd: extractPath
    })
  }

  await exec.exec(`sudo make install`, undefined, {
    cwd: extractPath
  })

  if (core.getInput('buildCache') == 'true') {
    core.info(`Storing into cache...`)
    try {
      await ch.saveCache(cachePaths, cacheKey)
    } catch (e) {
      core.warning(`Failed to save to cache (continuing anyway): ${e}`)
    }
  }

  core.addPath("/usr/local/openresty/bin")

  // TODO: delete the .openresty folder
}


main().catch(err => {
  core.setFailed(`Failed to install OpenResty: ${err}`);
})
