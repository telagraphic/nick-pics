#!/bin/bash

# Script to get dimensions of all jpg, jpeg, and png images in the current directory

# Check if ImageMagick is installed
if ! command -v identify &> /dev/null; then
    echo "ImageMagick is not installed. Please install it to use this script."
    exit 1
fi

# Iterate over each image file
for file in *.{jpg,jpeg,png,webp}; do
    # Check if files exist (to handle case when no matches are found)
    [ -e "$file" ] || continue
    
    # Get image dimensions
    dimensions=$(identify -format "%wx%h" "$file")
    
    # Print the filename and its dimensions
    echo "File: $file, Dimensions: $dimensions"
done