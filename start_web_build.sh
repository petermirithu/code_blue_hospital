#!/usr/bin/env bash
echo " "
echo "~ 🛠  Build and Deployment Script for Code Blue App 🚀"
echo " "
echo " "
echo "~ 🛠  Optimizing assets ... "
echo " "
npx expo-optimize
echo " "
echo "~ 🛠  Building Bundle ... "
echo " "
expo build:web --no-pwa
# cd web-build
# mkdir Pediatric_biomarker
# mv pwa Pediatric_biomarker
# mv fonts Pediatric_biomarker
# mv static Pediatric_biomarker
# mv asset-manifest.json Pediatric_biomarker
# mv favicon-16.png Pediatric_biomarker
# mv favicon-32.png Pediatric_biomarker
# mv favicon.ico Pediatric_biomarker
# mv serve.json Pediatric_biomarker
# cd Pediatric_biomarker/static/js
# rm -rf *.map
# echo " "
# echo "~ 🥳 Done Building project for Web Production! 🛠"
# echo " "