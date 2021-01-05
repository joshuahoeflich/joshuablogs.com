#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

# Blog {{{
npm install --prefix "$PROJECT_ROOT"/build/bundle
npm run build --prefix "$PROJECT_ROOT"/build/bundle
node "$PROJECT_ROOT"/build/bundle/dist/index.js
# }}}

# joke-generator {{{
npm install --prefix "$PROJECT_ROOT"/apps/joke-generator/
npm run build --prefix "$PROJECT_ROOT"/apps/joke-generator/
mkdir -p "$PROJECT_ROOT"/apps/apps/joke-generator
cp -r "$PROJECT_ROOT"/apps/joke-generator/build/* "$PROJECT_ROOT"/apps/apps/joke-generator
# }}}

cp -r "$PROJECT_ROOT"/apps/apps "$PROJECT_ROOT"/dist
