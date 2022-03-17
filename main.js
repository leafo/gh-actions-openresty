
const core = require("@actions/core")
const exec = require("@actions/exec")
const io = require("@actions/io")
const tc = require("@actions/tool-cache")
const cache = require("@actions/cache")

const path = require("path")

const BUILD_PREFIX = ".openresty"

const makeCacheKey = (openrestyVersion, configureFlags) => `openresty-${openrestyVersion}-${process.platform}-${process.arch}-${configureFlags}`

const main = async () => {
  const openrestyVersion = core.getInput('openrestyVersion', { required: true })
  const configureFlags = core.getInput('configureFlags')

  const extractPath = path.join(process.cwd(), BUILD_PREFIX, `openresty-${openrestyVersion}`)

  const cachePaths = [".openresty"]
  const cacheKey = makeCacheKey(openrestyVersion, configureFlags || "")

  let restoredCache = null

  if (core.getInput('buildCache') == 'true') {
    restoredCache = await cache.restoreCache(cachePaths, cacheKey)
    core.notice(`Cache restored: ${restoredCache}`)
  }

  if (!restoredCache) {
    const sourceTar = await tc.downloadTool(`https://openresty.org/download/openresty-${openrestyVersion}.tar.gz`)

    await io.mkdirP(extractPath)
    await tc.extractTar(sourceTar, BUILD_PREFIX)

    const configureFlagsArray = []
    if (configureFlags) {
      configureFlagsArray.push(configureFlags)
    }

    await exec.exec(`./configure"`, configureFlagsArray, {
      cwd: extractPath
    })

    await exec.exec(`make`, ["-j"], {
      cwd: extractPath
    })
  }

  await exec.exec(`sudo make install`, undefined, {
    cwd: extractPath
  })

  if (core.getInput('buildCache') == 'true') {
    core.notice(`Storing into cache...`)
    try {
      await cache.saveCache(cachePaths, cacheKey)
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
