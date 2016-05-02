#!/bin/bash
set -e

git submodule update --recursive --init

for module in ./modules/*;
do
    cd ${module}
    if [ -f setup.sh ];
    then
        bash setup.sh
    fi
    cd -
done
