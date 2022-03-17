
# Github Action for OpenResty

### `leafo/gh-actions-openresty`

[![Actions Status](https://github.com/leafo/gh-actions-openresty/workflows/test/badge.svg)](https://github.com/leafo/gh-actions-openresty/actions)

This action will build OpenResty (or restore from build cache if it's
available) and install it system-wide to `/usr/local/openresty`.
`/usr/local/openresty/bin` is also added to `PATH` so you can execute `resty`,
`opm`, and `openresty` directly.


## Inputs

### `openrestyVersion`

**Default**: `"1.19.9.1"`

The version to install, see https://openresty.org/en/download.html#source-code-releases for a list of available versions.

### `configureFlags`

**Default**: `null`

Additional flags passed to the `./configure` step of the build.

### `buildCache`

**Default**: `"true"`

It's recommended to leave the build cache on if possible, as it will enable
OpenResty to install in just a few seconds after it has been built for the
first time in your project.

Changing the version number or compile flags will result in a rebuild.

Disable this is the cached version is causing issues.
