# Requirements

Photo blog that supports displaying a short title, date, tag and a media file.

1. The media file could be an:

- pic
- pic-story (multiple images)
- video

```
images:
    path: '/assets/dog-park.png'
    alt: 'Sparky at Dog Park'
```

```
images:
    - path: '/assets/dog-park.png'
      alt: 'Sparky at Dog Park'
    - path: '/assets/dog-park.png'
      alt: 'Sparky at Dog Park'
```

```
video:
    path: '/assets/dog-park.mp4'
    alt: 'Sparky at Dog Park'
```


2.Tags explain what the media file is about.

```
tags: ["food", "park", "fam"]
```

3. Menu for home, tags, and favorites

- Home for stream of all posts
- Tags for all posts with that tag
- Favorites for all posts that have been favorited



## Design

### Posts

Layouts:

standard: 66% height on mobile and desktop
fill: 100% height on mobile but 66% on desktop



## Images

https://medium.com/@truszko1/picture-tags-vs-img-tags-their-uses-and-misuses-4b4a7881a8e1

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


### DO


- [ ] Animate text when scrolling into view?
  - setup gsap
  - setup scroll trigger
  - setup split text
  - test on netlify and mobile
- [ ] register domain name
- [ ] image hosting!
- [ ] lazy load images
- [ ] setup video playing



### DONE

- [x] tested post standard and fill layouts for mobile and desktop
- [x] added pub date to posts
- [x] refactor markup and styles for simpler html for standard and fill layouts
- [x] Add scroll to long titles
- [x] Add full page image class
- [x] Add basic scroll snap
- [x] Added js up/down arrow navigation to posts
- [x] Dynamically load posts from markdown files
- [x] How to create video post?



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


## Mobile testing


```
ngrok http 4321
```