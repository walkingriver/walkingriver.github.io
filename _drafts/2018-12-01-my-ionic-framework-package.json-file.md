---
layout: post
title: My Ionic Framework package.json File
author: Michael D. Callaghan
tags:
- Ionie
- Mobile Development
- Release
comments: true
---
## A reusable `script` section for release builds

Like most software developers, I happen to be lazy. By that, I mean I hate doing the same repetitive
tasks over and over again. So I like to automate things wherever possible. Further, I often find
myself repeatedly looking for the same automation solutions, which is why I put those things
in a blog post. That way, I can find them again, and maybe help others. Today, I want to write about
the `script` section in my package.json file for my Ionic Framework projects.
<!--more-->

Let's face it, releasing your Ionic app to the App Store or Play Store is a painful process. There are
so many things you need to do.

- Make icons and splash screens for every platform
- Create a feature graphic for Android
- Provide an App Preview video for iOS
- Archive and upload your executable to the Apple store
- Sign your apk for Android

Today I'm going to focus on that last one. Did you know there is a pretty simple way to automate it?

Here is the relevant section of my `script` section.

```js
    "version": "cordova-version-sync",
    "ionic:build": "ionic-app-scripts build",
    "ionic:serve": "ionic-app-scripts serve",
    "prepare": "cp $HOME/.ssh/wr.keystore platforms/android && cp $HOME/.ssh/*.properties platforms/android",
    "release:android": "ionic cordova build android --release",
    "release:ios": "ionic cordova build ios --release",
    "release:both": "run-s release:android release:ios",
    "release": "run-s prepare version:patch release:both",
    "version:patch": "npm --no-git-tag-version version patch",
    "version:minor": "npm --no-git-tag-version version minor",
    "open:ios": "open platforms/ios/Park\\ Pursuit.xcodeproj/",
    "open:android": "open platforms/android/build/outputs/apk/release/"
```

Let's look at these scripts one at a time.

Supporting these scripts requires a few extra development dependencies added.

```js
    "cordova-version-sync": "^1.0.3",
    "npm-run-all": "^4.1.2",
```