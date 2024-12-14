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