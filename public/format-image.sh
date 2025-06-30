#!/bin/bash

# ./format-image.sh (uses default quality of 80)
# ./format-image.sh -q 100 (uses quality of 100)
# ./format-image.sh -r (resizes images to a minimum width of 1200px before conversion)

# Default quality setting
quality=80
resize=false

# Define input and output directories
input_dir="public/process"
output_dir="public/processed"

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

# Check if input directory exists
if [ ! -d "$input_dir" ]; then
    echo "Input directory '$input_dir' does not exist."
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$output_dir"

# Convert all supported image files in the input directory to webp
for file in "$input_dir"/*.{jpg,jpeg,png}; do
    # Check if files exist (to handle case when no matches are found)
    [ -e "$file" ] || continue
    
    # Get filename without extension and path
    filename=$(basename "$file")
    filename_no_ext="${filename%.*}"
    
    # Create temporary file for resizing if needed
    temp_file=""
    if $resize; then
        temp_file=$(mktemp)
        echo "Resizing $filename..."
        
        # Get image dimensions
        dimensions=$(identify -format "%wx%h" "$file")
        width=$(echo "$dimensions" | cut -d'x' -f1)
        height=$(echo "$dimensions" | cut -d'x' -f2)
        
        # Resize based on orientation
        if [ "$width" -gt "$height" ]; then
            # Landscape: resize to width of 1200px
            echo "  Landscape image: resizing to width of 1200px"
            convert "$file" -resize 1200x "$temp_file"
        else
            # Portrait: resize to height of 1200px
            echo "  Portrait image: resizing to height of 1200px"
            convert "$file" -resize x1200 "$temp_file"
        fi
        
        input_file="$temp_file"
    else
        input_file="$file"
    fi
    
    echo "Converting $filename to $filename_no_ext.webp (quality: $quality)"
    
    # Convert to WebP format
    cwebp -q "$quality" -mt "$input_file" -o "$output_dir/$filename_no_ext.webp"
    
    # Check if conversion was successful
    if [ $? -eq 0 ]; then
        echo "  ✓ Successfully converted $filename"
    else
        echo "  ✗ Failed to convert $filename"
    fi
    
    # Clean up temporary file if created
    if [ -n "$temp_file" ] && [ -f "$temp_file" ]; then
        rm "$temp_file"
    fi
done

echo "Conversion complete! Processed images saved to '$output_dir'"
