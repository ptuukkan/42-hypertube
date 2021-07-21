#!/bin/sh
npm run build
cp -r build/* ../backend/public
