#!/usr/bin/env bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

for P in $(find $SCRIPT_DIR/packages -type d -mindepth 2 | gsort -V); do
  pushd $P > /dev/null
    V=$(basename "$PWD")

    npm view --json . versions | jq -e ". | index(\"$V\")" > /dev/null
    EXISTS="$?"

    if [ "$EXISTS" == "0" ]; then
      printf "skipping cause %s is already published to npm\n" "$PWD"
    else
      npm publish --access public
    fi
  popd > /dev/null
done
