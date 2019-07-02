---
layout: post
title: Making Icons for a Capacitor/iOS Application
date: '2019-06-29T15:15:00.002-04:00'
author: Michael Callaghan
tags: ionic,capacitor,ios
layout: post
feature: assets/img/bravo-icons.png
thumbnail: https://walkingriver.com/assets/img/bravo-icons.png
cover_image: https://walkingriver.com/assets/img/bravo-icons.png
canonical_url: https://walkingriver.com/make-icons/
published: true
---

I recently upgraded one of my mobile games to Ionic 4 and Capacitor. One of the shortcomings I discovered was the lack of a simple tool to create the icons and splash screens. I imagine the Ionic team will eventually recitify this situation, but in the meantime I wanted to find an alternative. Given that I can be a cheap guy at times, I figured it would be best to build my own solution.

<!--more-->

> You can read about my [Ionic 3 - 4 and Capacitor experience here](https://walkingriver.com/ionic-3-to-4/).

I started with a PNG file of 1280x1280 pixels. I knew the Mac had some built-in command line tools that would do the heavy lifting for me, and Xcode provided me the file names and sizes I needed to generate. Armed with that informtation, the rest was easy. 

Here is my admittedly-simple shell script. 

```
##################################################################
# Make a bunch of iOS App icons from a Master
# Given an image at least 512x512 pixels named icon.png, resize and create a
# duplicate at each specified size. Add new sizes as needed. When finished,
# copy the resulting images into your Xcode iOS project.

mkdir ./AppIcon.appiconset/
sips -z 20 20 --out ./AppIcon.appiconset/AppIcon-20x20@1x.png icon.png
sips -z 40 40 --out ./AppIcon.appiconset/AppIcon-20x20@2x-1.png icon.png
sips -z 40 40 --out ./AppIcon.appiconset/AppIcon-20x20@2x.png icon.png
sips -z 60 60 --out ./AppIcon.appiconset/AppIcon-20x20@3x.png icon.png
sips -z 29 29 --out ./AppIcon.appiconset/AppIcon-29x29@1x.png icon.png
sips -z 58 58 --out ./AppIcon.appiconset/AppIcon-29x29@2x-1.png icon.png
sips -z 58 58 --out ./AppIcon.appiconset/AppIcon-29x29@2x.png icon.png
sips -z 87 87 --out ./AppIcon.appiconset/AppIcon-29x29@3x.png icon.png
sips -z 40 40 --out ./AppIcon.appiconset/AppIcon-40x40@1x.png icon.png
sips -z 80 80 --out ./AppIcon.appiconset/AppIcon-40x40@2x-1.png icon.png
sips -z 80 80 --out ./AppIcon.appiconset/AppIcon-40x40@2x.png icon.png
sips -z 120 120 --out ./AppIcon.appiconset/AppIcon-40x40@3x.png icon.png
sips -z 1024 1024 --out ./AppIcon.appiconset/AppIcon-512@2x.png icon.png
sips -z 120 120 --out ./AppIcon.appiconset/AppIcon-60x60@2x.png icon.png
sips -z 180 180 --out ./AppIcon.appiconset/AppIcon-60x60@3x.png icon.png
sips -z 76 76 --out ./AppIcon.appiconset/AppIcon-76x76@1x.png icon.png
sips -z 152 152 --out ./AppIcon.appiconset/AppIcon-76x76@2x.png icon.png
sips -z 167 167 --out ./AppIcon.appiconset/AppIcon-83.5x83.5@2x.png icon.png

```

As I said, pretty straightforward. With a little more time, I could probably come up with something more elegant, but this brute-force solution works well enough. It assumes you have a PNG file named icon.png, and it should be at least 512x512.



# Feedback Appreciated
Do you have any comments or questions? Did I make any mistakes in this post? Let me know on Twitter. I'm [@walkingriver](https://twitter.com/walkingriver).
