---
layout: post
title: Ionic-React, Upgrading to Ionic v5
date: '2020-01-14'
author: Michael Callaghan
tags: 
- ionic 
- react
- web
layout: post
feature: assets/img/react-v1.png
thumbnail: https://walkingriver.com/assets/img/react-v1.png
cover_image: https://walkingriver.com/assets/img/react-v1.png
canonical_url: https://walkingriver.com/ionic-react-nav-style/
published: false
---

A few weeks back my "trusty" Mac Mini died. It simply would not power on. Fortunately, it was under warranty. A lot happened while I was waiting for it to be fixed and returned. One of those things was the official release to Ionic v5, including Ionic-React. This post will show what I had to do to upgrade this work-in-progress to the latest version.

<!--more-->

This is the third in a series on my experience with Ionic-React.

0. [Confessions of a Reluctant Ionic-React Fan](https://walkingriver.com/ionic-react/)
1. [Ionic-React, a Brief Introduction](https://walkingriver.com/ionic-react-intro)
2. Ionic-React, Upgrading to Ionic v5
3. _Coming Soon_

# The Application
As I mentioned previously, the app I am reproducing is called Bravo! It is a tiny app I wrote to help pass the time when waiting in line, on a road trip, or other times you find yourself with lots of time and little to do. You can download it here [for Android](http://bit.ly/android-bravo) or [for iOS](http://bit.ly/ios-bravo). 

# Ionic-React v5

# Upgrade npm Packages
The first thing I did was upgrade the Ionic-React libraries to the latest versions. I also upgraded the Ionic icons to v5

```bash
npm install @ionic/react@latest @ionic/react-router@latest ionicons@latest
```

If you leave off the `@latest`, you will get the highest version matching your current _major version_, which in my case, was v4. 

# See What Broke
Once those libraries were upgraded, I ran a quick `ionic serve` to see what broke. I was not disappointed, and the TypeScript compiler granted my wish with the following error message:

```bash
[react-scripts] /Users/michael/git/bravo-react/src/App.tsx
[react-scripts] TypeScript error in /Users/michael/git/bravo-react/src/App.tsx(35,5):
[react-scripts] Type 'string' is not assignable to type 'object'.  TS2322
[react-scripts]     33 |     title: 'Home',
[react-scripts]     34 |     url: '/home',
[react-scripts]   > 35 |     icon: home
[react-scripts]        |     ^
[react-scripts]     36 |   },
[react-scripts]     37 |   {
[react-scripts]     38 |     title: 'List',
```

The error is on line 35. The context of the code is the list of pages to be displayed in the side-menu itself. It is an array of `AppPage` and passed into the `Menu`.  The identifier `home` comes from the IonIcons package, and is exported as a string. However, the `AppPage` interface, which is where this error occurs, is defined this way:

```typescript
export interface AppPage {
  title: string;
  url: string;
  icon: object;
}
```

Apparently something has changed. The code is expecting an object, but is getting the exported string value. I went over to the [Ionic 5 Breaking Changes Notes](https://github.com/ionic-team/ionic/blob/master/BREAKING.md), but did not find anything that would explain this. 

# Create a New Ionic-React App?
On a whim, I decided to create a brand new Ionic-React project with v5 of the CLI, based on the side-menu project. It had a different strategy for creating and maintaining the menu. Rather than fight with it, I decided it would be better to adopt the newer style. 

The first thing I noticed is that the `Menu` object defines its own version of the `AppPage` interface. It looks like this.

```typescript
interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}
```

Given that this is all about the icons, I looked at the code it was using to generate the menus. The icon section does not match the interface. 

```tsx
<IonIcon slot="start" icon={appPage.iosIcon} />
```

Notice that it simply sets the `icon` attribute to the value of the `iosIcon`. It did not take long to figure out why. I decided to change the `IonIcon` attributes to look like this.

```tsx
<IonIcon slot="start"
  icon={appPage.icon}
  ios={appPage.iosIcon}
  md={appPage.mdIcon}
/>
```

As soon as I did that, the icons vanished from the menu. Removing the `ios` and `md` variants caused the icons to reappear. It seems, at least with v5 of Ionic-React, you cannot specify variants, and must stick with `icon`. I decided to leave it in the `AppPage` interface, in case this gets fixed in the near future. In the meantime, I decided to follow their lead and stick with using the iosIcon (not that it matters).

# Style Updates
Next, I need to see what adding that class does. I imagine it highlights the selected page somehow. 

# Conclusion

These are some of the things that still need to be done. 
- Finishing the Instructions Page
- Game Page 
- Game Card
- Footer Bar, Also Black
- Score Boxes

In my next post, I will try to get the UI working for the game page, even if there are no mechanics yet. 

The repository for this code is publicly hosted on GitHub, so you can follow my progress or even issue pull requests if you wish. 
https://github.com/walkingriver/bravo-react


