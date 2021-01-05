#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

npm run build --prefix "$PROJECT_ROOT"/build/bundle
node "$PROJECT_ROOT"/build/bundle/dist/index.js

cp -r "$PROJECT_ROOT"/apps/apps "$PROJECT_ROOT"/dist
