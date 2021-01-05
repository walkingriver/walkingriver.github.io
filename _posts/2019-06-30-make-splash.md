---
layout: post
title: Making Splash Screens for a Capacitor/Android Application
date: '2019-06-30'
author: Michael D. Callaghan
tags: 
- ionic 
- capacitor
- ios
layout: post
feature: assets/img/bravo-icons.png
thumbnail: https://walkingriver.com/assets/img/bravo-icons.png
cover_image: https://walkingriver.com/assets/img/bravo-icons.png
canonical_url: https://walkingriver.com/make-splash/
exclude_from_posts: true
published: true
---

This is a follow-up to my post from yesterday, about making icons and splash screens for Ionic/Capacitor apps. Turns out, making a splash screen for iOS was simple. Just drop three 2732x2732 files into the project, and Xcode takes care of the rest. Likewise, Android Studio will take a large png file and make you a set of perfect icons. But making Android splash screens was harder, so I recreated my pattern from yesterday and made a script to do the hard stuff for me.

<!--more-->

> You can read about my [Ionic 3 - 4 and Capacitor experience here](https://walkingriver.com/ionic-3-to-4/){:target="_blank"}.

To create the Android splash screen, I started with the same 2732x2732 PNG file I used for the iOS project. Using the same `sips` command I had used yesterday, and the file sizes Android Studio and Capacitor gave me, I came up with this version of the shell script. 

```
#!/bin/bash

###### 
# Make a bunch of Android splash screens Master image.
# Given an image at least 1920x1920 pixels named splash.png, resize and create a
# duplicate at each specified size. Add new sizes as needed. When finished,
# copy the resulting images into your Android project, under the res folder.

mkdir -p ./res
function resize {
  w=$2
  h=$3

  echo $1 into $4

  [ -d "./res/$4" ] || mkdir ./res/$4

  if [[ $w -ge $h ]]; then
    sips -Z $w -c $h $w --out ./res/$4/splash.png $1
  else
    sips -Z $h -c $h $w --out ./res/$4/splash.png $1
  fi
}

resize $1 480 320 drawable
resize $1 800 480 drawable-land-hdpi
resize $1 480 320 drawable-land-mdpi
resize $1 1280 720 drawable-land-xhdpi
resize $1 1600 960 drawable-land-xxhdpi
resize $1 1920 1280 drawable-land-xxxhdpi
resize $1 480 800 drawable-port-hdpi
resize $1 320 480 drawable-port-mdpi
resize $1 720 1280 drawable-port-xhdpi
resize $1 960 1600 drawable-port-xxhdpi
resize $1 1280 1920 drawable-port-xxxhdpi
```

Like yesterday's script to create iOS icons, this one is pretty straightforward. It is a lot of brute force, and assumes a happy path. Unlike yesterday's, this one actually allows you to specify the splash screen to be converted, and it will then build the appropriate `res` folder. Simply take those files and drop them into your Android Capacitor project. You'll find them in `./android/src/app/main/res`.
