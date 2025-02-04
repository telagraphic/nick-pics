#!/bin/bash

# ./format-image.sh (uses default quality of 80)
# ./format-image.sh -q 100 (uses quality of 100)
# ./format-image.sh -r (resizes images to a minimum width of 1200px before conversion)

# Default quality setting
quality=80
resize=false

# Parse command line arguments
while getopts "q:r" opt; do
    case $opt in
        q) quality="$OPTARG"
        ;;
        r) resize=true
        ;;
        \?) echo "Invalid option: -$OPTARG" >&2
            exit 1
        ;;
    esac
done

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it to use this script."
    exit 1
fi

# Convert all supported image files in current directory to webp
for file in *.{jpg,jpeg,png}; do
    # Check if files exist (to handle case when no matches are found)
    [ -e "$file" ] || continue
    
    # Get filename without extension
    filename="${file%.*}"
    
    # Resize image if the flag is set
    if $resize; then
        echo "Resizing $file to a minimum width of 1200px..."
        convert "$file" -resize 1200x "$file"
    fi
    
    echo "Converting $file to $filename.webp (quality: $quality)"
    cwebp -q "$quality" "$file" -o "$filename.webp"
done

echo "Conversion complete!"
