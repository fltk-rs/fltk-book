#!/bin/bash

mdbook clean
echo "cleaned"
mdbook build
echo "builded"
cp ./CNAME ./docs/CNAME
echo "CNAME builded"

git add .
echo "git added"
