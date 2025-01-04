## Overview

Photo blog that supports displaying a short title, date, tag and a media file.

The media file could be an:

- pic
- pic-story
- video

```
type: pic|pic-story|video
```


Tags explain what the media file is about.

```
tags: ["tag1", "tag2", "tag3"]
```


A gallery view should allow the user to scroll left/left and up and down.

Color mode button.

Like button?


## Design

**Mobile layout:**

Use a grid for mobile layout column of 2.


**Desktop layout:**

Single column with a scroll snap.


## Technologies 

Use the IntersectionObserver API to detect when the user is scrolling near the photo and load the next or previous photo.
Use CSS Grid to display the photos in a grid.
Use CSS Scroll Snap to create a smooth scrolling experience.


Use IntersectionObserver to lazy load images and videos.
Use it to play the video when it is in view.


Use page navigations to animate between pages.



## Links

https://www.halfhalftravel.com/blogging-advice/host-images-at-scale.html
https://egghead.io/lessons/astro-refactor-a-react-astro-island-to-vanilla-js-to-ship-less-javascript
https://css-tricks.com/practical-css-scroll-snapping/
https://dribbble.com/tags/instagram-ui

## TODO


### Posts

Increase speed of scroll on desktop layout
How to refresh next 10 posts on scroll
How to pre-load videos
Animate images into view when scrolling down.


Layouts:

mobile-full-height
mobile-centered at 60vh





### Images

Hosting images and videos




- [x] Add basic scroll snap
- [x] Added js up/down arrow navigation to posts
- [ ] Add a debounce/throttle function for scroll snapping
- [ ] Increase speed of scroll on deskptop layout
- [x] Dynamically load posts from markdown files
- [x] How to create video post?
- [ ] Responsive images setup for hosted media
- [ ] Fix slider for images
- [ ] Add post variants
- [ ] Get images and videos




## Publish Process

### Pictures

1. Create working directory
2. Optimize and compress with ImageOptim
3. Move to public/assets/YYYY-MM-DD
4. Create markdown file in src/posts



**format-image.sh**

Convert optimized image to webp

```
sh format-image.sh publish/martini-rabbit-short.jpeg
```


### Videos

1. Create working directory
2. Run ffmpeg to create webm for andriod and mp4 for ios and desktop
3. Move to public/assets/YYYY-MM-DD
4. Create markdown file in src/posts


**format-video.sh**

Pass the video filepath to the script and use the filename for the input and output
First argument is the video filepath, second is the timestamp for the thumbnail

```
sh format-video.sh publish/martini-rabbit-short.mov 2.2
```