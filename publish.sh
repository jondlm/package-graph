#!/usr/bin/env bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

for P in $(find $SCRIPT_DIR/packages -type d -mindepth 2 | gsort -V); do
  pushd $P > /dev/null
  npm publish --access public
  popd > /dev/null
done
