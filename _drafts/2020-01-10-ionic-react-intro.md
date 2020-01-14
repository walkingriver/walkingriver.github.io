---
layout: post
title: Ionic-React, a Brief Introduction
date: '2020-01-03'
author: Michael Callaghan
tags: 
- ionic 
- react
- web
layout: post
feature: assets/img/
thumbnail: https://walkingriver.com/assets/img/
cover_image: https://walkingriver.com/assets/img/
canonical_url: https://walkingriver.com/ionic-react-intro-1/
published: false
---

The other day I made a post I titled ["Confessions of a Reluctant Ionic-React Fan"](https://walkingriver.com/ionic-react/). That post contained some snippets that got added to the default Ionic SideMenu template, but it neglected to provide any real functionality. In this post, I will attempt to recreate using Ionic-React a subset of one of my existing Ionic v4 apps written in Angular. 

<!--more-->

# The Application
The app I want to reproduce is called Bravo! It is a tiny app I wrote to help pass the time when waiting in line, on a road trip, or other times you find yourself with lots of time and little to do. You can download it here [for Android](http://bit.ly/android-bravo) or [for iOS](http://bit.ly/ios-bravo). 

# Create the Project
The first thing you need to do is ensure you have the latest version of the Ionic CLI. I will assume you are running Node 10 or higher already.

```bash
npm install -g ionic@latest
```

Next, create an Ionic React app. I will use the `sidemenu` template to get the scaffolding for a collapsible "hamburger" menu. 

```bash
ionic start bravo-react sidemenu --type=react
```

Fire up the app to see what it looks like.

```base
ionic serve
```

Although the Ionic CLI does not (yet?) support React as thoroughly as it does Angular, this at least should work. If your system's default web browser does not open on its own, simply open http://localhost:8100 to see the app. You can leave it open, as Ionic will ensure your app will recompile and reload the browser automatically for you.

It is a standard Ionic sample app with a menu and a split-pane view. This means that when the app window is wide enough, like on a desktop browser, side menu will be visible all the time. When the window is narrower, less than 992 pixels wide, the menu will collapse into a standard hamburger menu. The menu shows two pages, home and list. Clicking either will navigate to the appropriate page. This is enough to get us started.

# Instructions
We will remove everything on the home page inside the `<IonContent>...</IonContent>` and replace it with some general game instructions. 

## Slider
My instruction cards are implementing using the ion-slider component. The Angular code looks like this, which is what I need to replicate.

```html
<ion-slides #slider pager="true" (ionSlideDidChange)="onSlideChange($event)">
  <ion-slide>
  . . .
  </ion-slide>
</ion-slides>
```

There are multiple ion-slide objects inside a single ion-slides wrapper. The wrapper has an identifier that I can reference from the Angular component code through a ViewChild decorator. Only a single option is specified, displaying a pager at the bottom of the slider as a series of small gray dots. My slider raises a single event I care about, onSlideChange. This event fires whenever the slide has changed.

That event handler simply controls the visibility of a "Skip" link in the header. This link should be visible unless the slider is showing the last slide, indicated by `isEnd()`. That function is asynchronous, so it must be awaited. 

```typescript
async onSlideChange() {
  this.showSkip = !(await this.slider.isEnd());
}
```

I was originally going to omit it from this experiment, but realized that responding to HTML events is a pretty basic task.

The only


### IonSlides

## IonCard

## Toolbar and Buttons


# "Game" Page 
Replace the List page with a Game Page

## Black Background

## Game Card

# Footer Bar, Also Black

# Score Boxes