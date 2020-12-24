#!/usr/bin/env bash
cd "${0%/*}"
echo Fetching yoga-lichtquelle $1...
curl https://yoga-lichtquelle.s3.eu-central-1.amazonaws.com/$1/yoga-lichtquelle-build-$1.zip -L -o yogalichtquelle.zip
unzip -o yogalichtquelle.zip
