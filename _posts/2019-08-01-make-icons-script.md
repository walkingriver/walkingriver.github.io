---
layout: post
title: Shell Script to Make Icons for a Capacitor/iOS Application
date: '2019-08-01T15:15:00.002-04:00'
author: Michael D. Callaghan
tags: 
- ionic 
- capacitor
- ios
layout: post
feature: assets/img/pp-icons.png
thumbnail: https://walkingriver.com/assets/img/pp-icons.png
cover_image: https://walkingriver.com/assets/img/pp-icons.png
canonical_url: https://walkingriver.com/make-icons-script/
published: true
---

This is a follow-up to my post about creating iOS App Store icons for an Ionic/Capacitor application. I improved the script to make it a little easier for anyone to use. 
<!--more-->

> The [original post describing the problem is here](https://walkingriver.com/make-icons/){:target="_blank"}.

## How it works
The script works by using a built-in image manipulation command line utility, sips. For each icon size needed, the script calls sips to resize a common png, and copies the result to the appropriate folder and filename. 

Should Apple change the filenames and sizes in the future, all you'd have to do is keep that list up to date.

Here is my updated shell script. 

```
#!/bin/bash

##################################################################
# Make a bunch of iOS App icons from a Master
# Given an image at least 512x512 pixels named icon.png, resize and create a
# duplicate at each specified size. Add new sizes as needed. When finished,
# copy the resulting images into your Xcode iOS project.

OUTDIR=ios/App/App/Assets.xcassets/AppIcon.appiconset

# Make sure there is an iOS directory already
if [ ! -d ./ios ] 
  then
    echo Add iOS App first
    exit 1
fi

if [ ! -f icon.png ]
  then
    echo Please add a PNG image named icon.png to this folder and re-run this script.
    exit 1
fi

echo Making $OUTDIR if it does not already exist.
[ -d $OUTDIR ] || mkdir -p $OUTDIR

echo Generating Icons...

sips -z 20 20 --out $OUTDIR/AppIcon-20x20@1x.png icon.png
sips -z 40 40 --out $OUTDIR/AppIcon-20x20@2x-1.png icon.png
sips -z 40 40 --out $OUTDIR/AppIcon-20x20@2x.png icon.png
sips -z 60 60 --out $OUTDIR/AppIcon-20x20@3x.png icon.png
sips -z 29 29 --out $OUTDIR/AppIcon-29x29@1x.png icon.png
sips -z 58 58 --out $OUTDIR/AppIcon-29x29@2x-1.png icon.png
sips -z 58 58 --out $OUTDIR/AppIcon-29x29@2x.png icon.png
sips -z 87 87 --out $OUTDIR/AppIcon-29x29@3x.png icon.png
sips -z 40 40 --out $OUTDIR/AppIcon-40x40@1x.png icon.png
sips -z 80 80 --out $OUTDIR/AppIcon-40x40@2x-1.png icon.png
sips -z 80 80 --out $OUTDIR/AppIcon-40x40@2x.png icon.png
sips -z 120 120 --out $OUTDIR/AppIcon-40x40@3x.png icon.png
sips -z 512 512 --out $OUTDIR/AppIcon-512@2x.png icon.png
sips -z 120 120 --out $OUTDIR/AppIcon-60x60@2x.png icon.png
sips -z 180 180 --out $OUTDIR/AppIcon-60x60@3x.png icon.png
sips -z 76 76 --out $OUTDIR/AppIcon-76x76@1x.png icon.png
sips -z 152 152 --out $OUTDIR/AppIcon-76x76@2x.png icon.png
sips -z 167 167 --out $OUTDIR/AppIcon-83.5x83.5@2x.png icon.png
```

To use it, first make sure you're on a Mac.

1. Copy the above script into the topmost folder of your Ionic project. Name the file `make-icons.sh`.
1. Make the script executable with `chmod +x make-icons.sh`
1. Add Capacitor integrations and an iOS platform if you haven't already done so. For more information on that, see [my post on Adding Capacitor](https://walkingriver.com/ionic-3-to-4/){:target="_blank"}.
1. Add a PNG image called `icon.png` in the same folder. This image should be at least 1024x1024, and should contain no rounded corners or transparency.
1. Execute `./make-icons.sh`.
1. Open ios/App/App/Assets.xcassets/AppIcon.appiconset/ to see your icons.
1. Enjoy!


