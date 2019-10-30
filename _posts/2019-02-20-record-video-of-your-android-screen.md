---
layout: post
title: Record Video of Your Android Screen with ADB (Updated)
author: Michael Callaghan
tags: 
- android 
- adb
- video
feature: assets/img/android-1000x420.jpg
cover_image: https://walkingriver.com/assets/img/android-1000x420.jpg
canonical_url: https://walkingriver.com/record-video-of-your-android-screen/
comments: true
---
Recently I needed to record a demo video for one of my apps running on an Android test device, an older Samsung Galaxy S4.
I had no idea how to do that.
Camtasia for the Mac supports capturing live video directly from iOS devices out of the box, but not Android. 
What to do? The instructions in this article describe one simple solution,
which should work on both MacOS and Windows.
<!--more-->

## Background
I've been working a lot lately on writing mobile apps using the [Ionic Framework](https://www.ionicframework.com). 
My goal is to be able to release apps for both iPhone and Android at roughly the same time. 
As part the submission process to both Google Play and the Apple App Store,
it is required (or at least highly recommended) to submit a demo video of
your app in action. That's easier said than done.

## Search
After a bit of searching, I found instructions on a few different sites. None of them had all of the steps I needed. 
So rather than trying to remember where I found everything, I figured I'd put all of the instructions in one place 
on my own blog so I could find it again easily.

## Prerequisites
* Android Debugging Bridge (adb) or Android SDK. If you are already doing Android
development, you probably already have one or both of these.
* USB to Phone cable (preferably the one that came with the device).

## Record the Screen
1. Connect the device to the computer via USB.
1. Open your favorite terminal emulator to the folder where you want the video to be saved.
1. Run the following command: 
```adb shell screenrecord /mnt/sdcard/Movies/test.mp4``` (Change `test.mp4` to anything you want). You may see some warnings, but shouldn't receive any errors. I put the video in the standard Movies folder to make it easy to find on the device, in case I want to preview it before copying to my computer.
1. Use the phone for whatever you want to record. Everything you do will be saved to that file `test.mp4`.
1. Press Ctrl+C to stop recording.

## Copy the Video to your Computer
1. Enter the following command at the terminal: `adb pull /mnt/sdcard/Movies/test.mp4 .` The path here should match the one from the `screenrecord` command.
Make sure you include the trailing dot at the end of that command.
1. Use the video any way you wish.

There might be a better way to do this, but I'm cheap and this is free. I did find other methods, mostly paid apps. If you know of something simpler, please let me know here or on twitter. I'm @walkingriver

