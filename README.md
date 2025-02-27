
# Github Action for OpenResty

### `leafo/gh-actions-openresty`

[![Actions Status](https://github.com/leafo/gh-actions-openresty/workflows/test/badge.svg)](https://github.com/leafo/gh-actions-openresty/actions)

This action will build [OpenResty](https://openresty.org/en/) (or restore from build cache if it's
available) and install it system-wide to `/usr/local/openresty`.
`/usr/local/openresty/bin` is also added to `PATH` so you can execute `resty`,
`opm`, and `openresty` directly.


## Example


```yml
name: test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@master
    - uses: leafo/gh-actions-openresty@v2
      with:
        openrestyVersion: "1.27.1.1"

    - name: run resty
      run: resty -e 'print("hi from lua")'

    - name: run opm
      run: opm --cwd install leafo/pgmoon

    # This will install luarocks, configured to use luajit that comes with openresty
    - uses: leafo/gh-actions-luarocks@master
      with:
        withLuaPath: "/usr/local/openresty/luajit/"
```


## Inputs

### `openrestyVersion`

**Default**: `"1.27.1.1"`

The version to install, see https://openresty.org/en/download.html#source-code-releases for a list of available versions.

### `configureFlags`

**Default**: `"--with-pcre-jit --with-ipv6"`

Additional flags passed to the `./configure` step of the build. Note that if
you provide your own values, the defaults will be overwritten and not included.
Include them if that's what you want.

### `buildCache`

**Default**: `"true"`

Stores the binaries of the build into the build cache, which will be reused on
subsequent builds to substantially speed up setup time.

It's recommended to leave the build cache on if possible, as it will enable
OpenResty to install in just a few seconds after it has been built for the
first time in your project.

Changing the version number or compile flags will result in a new cache key and
force a full rebuild.

Disable this is the cached version is causing issues.

Set to `"false"` to disable.
