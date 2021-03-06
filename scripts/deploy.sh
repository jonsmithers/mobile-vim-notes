#!/bin/bash
cd "$(dirname "$0")/.."
rm -r ./dist/* # preserve .git folder for deploying to gh-pages
node_modules/webpack/bin/webpack.js
cp dist-index.html ./dist/index.html
mkdir ./dist/cdn-downloads/
cp -r ./cdn-downloads/ ./dist/
cp --parents node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js ./dist/

sha=`git show-ref HEAD -s`
cd ./dist
git add --all
git commit -m "Deploy $sha"

echo "TO DEPLOY:"
echo "cd dist/; git push"
