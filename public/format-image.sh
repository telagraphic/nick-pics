#!/bin/bash

# ./format-image.sh (uses default quality of 80)
# ./format-image.sh -q 100 (uses quality of 100)

# Default quality setting
quality=80

# Parse command line arguments
while getopts "q:" opt; do
    case $opt in
        q) quality="$OPTARG"
        ;;
        \?) echo "Invalid option: -$OPTARG" >&2
            exit 1
        ;;
    esac
done

# Convert all supported image files in current directory to webp
for file in *.{jpg,jpeg,png}; do
    # Check if files exist (to handle case when no matches are found)
    [ -e "$file" ] || continue
    
    # Get filename without extension
    filename="${file%.*}"
    
    echo "Converting $file to $filename.webp (quality: $quality)"
    cwebp -q "$quality" "$file" -o "$filename.webp"
done

echo "Conversion complete!"
