#!/usr/bin/env bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

for P in $(find $SCRIPT_DIR/packages -type d -mindepth 2 | gsort -V); do
  pushd $P > /dev/null
    V=$(basename "$PWD")

    NAME=$(cat package.json | jq -r ".name")
    INTEGRITY=$(npm view --json "$NAME@$V" dist.integrity | tr -d '"')

    printf "%-30s %s %s\n" "$NAME" "$V" "$INTEGRITY"
  popd > /dev/null
done
