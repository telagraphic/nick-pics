#!/bin/bash

# Check if input file is provided
if [ $# -eq 0 ]; then
    echo "Error: No input file provided"
    echo "Usage: $0 /path/to/input/video.mov [timestamp]"
    exit 1
fi

# Get the input filepath
input_filepath="$1"

# Extract filename without extension
filename=$(basename "$input_filepath")
filename_noext="${filename%.*}"

# Create output filenames
output_mp4="${filename_noext}.mp4"
output_webm="${filename_noext}.webm"
output_thumbnail="${filename_noext}.png"

echo "Processing $filename to MP4 and WebM..."

# Convert to MP4
ffmpeg -i "$input_filepath" -c:v libx264 -c:a aac -strict -2 "$output_mp4"

# Convert to WebM
ffmpeg -i "$input_filepath" -c:v libvpx-vp9 -b:v 1M -c:a libvorbis "$output_webm"

# Check if timestamp argument is provided
timestamp="${2:-0}"  # Default to 0 if not provided

# Create a thumbnail
ffmpeg -ss "$timestamp" -i "$input_filepath" -vframes 1 "$output_thumbnail"

echo "Conversion complete!"
echo "Created: $output_mp4"
echo "Created: $output_webm"
echo "Created: $output_thumbnail"