---
layout: post
title: Ionic-React, a Brief Introduction
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
canonical_url: https://walkingriver.com/ionic-react-intro/
published: true
---

The other day I made a post I titled Confessions of a Reluctant Ionic-React Fan". That post contained some snippets that got added to the default Ionic SideMenu template, but it neglected to provide any real functionality. In this post, I will attempt to recreate using Ionic-React a subset of one of my existing Ionic v4 apps written in Angular. 

<!--more-->

This is the second in what I hope to be a series on my experience with Ionic-React.

0. ["Confessions of a Reluctant Ionic-React Fan"](https://walkingriver.com/ionic-react/)
1. Ionic-React, a Brief Introduction
2. _Coming Soon_

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

```bash
ionic serve
```

Although the Ionic CLI does not (yet?) support React as thoroughly as it does Angular, this at least should work. If your system's default web browser does not open on its own, simply open http://localhost:8100 to see the app. You can leave it open, as Ionic will ensure your app will recompile and reload the browser automatically for you.

It is a standard Ionic sample app with a menu and a split-pane view. This means that when the app window is wide enough, like on a desktop browser, side menu will be visible all the time. When the window is narrower, less than 992 pixels wide, the menu will collapse into a standard hamburger menu. The menu shows two pages, home and list. Clicking either will navigate to the appropriate page. This is enough to get us started.

# Instructions
We will remove everything on the home page inside the `<IonContent>...</IonContent>` and replace it with some general game instructions. 

## Slider
My instruction cards are implementing using the `ion-slides` component. The current code looks like this, which is what I need to replicate.

### ion-sides (Angular)
```html
<ion-slides 
  #slider 
  pager="true" 
  (ionSlideDidChange)="onSlideChange($event)">
  <ion-slide>
  . . .
  </ion-slide>
</ion-slides>
```

There are multiple `ion-slide` objects inside a single `ion-slides` wrapper. The wrapper has an identifier that I can reference from the Angular component code through a `@ViewChild` decorator, which is Angular-specific. Only a single option is specified, `pager`, displaying a series of small gray dots at the bottom of the slider. My slider raises a single event I care about, `onIonSlideDidChange`. This event fires whenever the slide has changed (duh!).

I was originally going to omit it from this experiment, but realized that responding to HTML events is a pretty basic task. It has also provided me with my first real challenge. 

### IonSlides (React)
First and foremost, you cannot simply copy and paste the markup from the Angular project's HTML file into a React project's TSX file. If you try, you get a bunch of unknown component errors. Why? The tag names are different from Ionic-Angular and Ionic-React. 

After that realization, this is what I managed to get working to start.

```html
<IonSlides pager={true} onIonSlideDidChange={ionSlideChanged}>
  <IonSlide>
    01. Placeholder
  </IonSlide> 
  <IonSlide>
    02. Placeholder
  </IonSlide>
</IonSlides>
```

The good news is that Ionic-React gives you amazing intellisense and code completion out of the box, at least in Visual Studio Code. The Ionic team did a great job in that regard. So it did not take much time for me to figure out how adjust my markup.

### onIonSlideDidChange
Where I ran into trouble was in wiring up that event handler. It is not complicated. In Angular, it is a method on my component class.

```typescript
async onSlideChange() {
  this.showSkip = !(await this.slider.isEnd());
}
```

 It simply controls the visibility of a "Skip" link in the header, which I will show shortly. This link should be visible unless the slider is showing the last slide, indicated by `isEnd()`. That function is asynchronous, so it must be awaited. 

 Getting this to work in React has been a challenge, and I am sure that someone will point out that my ultimate solution is not the "best practice." That is fine, as I am more than willing to learn.

 Here is what eventually worked for me.

 ```tsx
let [showSkip, setSkip] = React.useState(true);

const ionSlideChanged = (event: CustomEvent) => {
  const target: any = event.target;
  setSkip(!target.swiper.isEnd);
}
```

The first line, which is what took me so long to get right, "returns a stateful value, and a function to update it." This is a basic React hook, and provides a way to set and alter the component state. I want React to understand that this variable means something to the UI, and this is how that is done. I tell React to give me some state by calling `React.useState(true)`. The `true` parameter is the initial state value. That function returns two values, the state variable itself, and a function I can call to update it. In this instance, I now have a local variable that controls the visibility of my Skip button. 

The function `ionSlideChanged` is called whenever the slide is changed. This function needs to set the value of `showSkip` based on whether or not the final slide is showing. Unlike the Angular version, I do not seem to have a strongly-typed way to reach into the ion-slides component. Instead, I need to retrieve the target of the HTML event (In React, the `IonSlides` component), and then find its internal `swiper` field (that took a while to discover), and check its `isEnd` value. It is here that the Angular code wins hands-down.

### onIonSlideDidChange (Alternative)
[Kevin Clark](https://twitter.com/KClarkADSTech) commented on Twitter that there are a couple of ways to get strong typing in this function. His first suggestion, that I use `event.detail`, did not work for me. It always had a `null` value. His second suggestion, however, worked perfectly. The new version of the function is here:

```typescript
async function ionSlideChanged(event: CustomEvent) {
  const target = event.target as HTMLIonSlidesElement;
  setSkip(! await target.isEnd());
}
```

Now it looks almost exactly like the Angular version. I simply needed to coerce the `event.target` to be an `HTMLIonSlidesElement`. Once I did that, I could await a call to its `isEnd()` function, and use that value. 

The Angular version is slightly more concise, because I already had a strongly-typed reference to the slides element in my component code:

```typescript
@ViewChild('slider') slider: IonSlides;
```

## Toolbar and Buttons
Now let us look at that Skip button and how it is shown or hidden. The Angular code for the entire header looks like this:

```html
<ion-header no-shadow>
  <ion-toolbar color="dark">
    <ion-title>Bravo!</ion-title>
    <ion-buttons slot="end" *ngIf="showSkip">
      <ion-button routerDirection="root" 
                  routerLink="/game" 
                  color="light">Skip</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```

It is missing a menu button, but that was an early design decision. In the React version, I will leave it visible. Most users will expect it, so it makes sense to have it. The header is specified as not having a shadow. It consists of a dark toolbar, containing the application title and single button, the Skip button. 

The Skip button is light colored, and declares itself to be a navigation link to the "game" page, which is not yet implemented. Notice that the `ion-buttons` component contains an `*ngIf` to display or not, depending on the value of the `showSkip` variable. This concept is not replicated in React, so this was my second challenge.

### Skip Button, First Attempt
After a few web searches and much trial and error, I ended up creating the button as its own component, defined as a constant inside the HomePage component. It looks like this.

```tsx
const skipButton = () => {
  if (showSkip) {
    return (
      <IonButton routerDirection="forward" 
                 routerLink="/game" 
                 color="light">Skip
      </IonButton>
      );
  } else {
    return (<span></span>);
  }
}
```

It is simple enough to understand, even if not nearly as concise as an `*ngIf` expression. That is not inside the toolbar, though, right? To insert it into my header, I needed to include it in the markup in the appropriate place. This is my complete header markup.

```html
<IonHeader>
  <IonToolbar>
    <IonButtons slot="start">
      <IonMenuButton />
    </IonButtons>
    <IonTitle>Home</IonTitle>
    <IonButtons slot="end">
      {skipButton()}
    </IonButtons>
  </IonToolbar>
</IonHeader>
```

You can see the call to the `skipButton()` function inside the `<IonButtons>` tag.

This is a little more abstraction and encapsulation than I would prefer for a simple "show/hide button" construct. But I was unable to find a better solution. 

### A Better Approach
Thanks to [Ely Lucas](https://twitter.com/elylucas), who commented on my pull request, I was able to eliminate the `skipButton()` function entirely by using what he suggested would be "kinda like [Angular's] ngIf." Instead of a separate function, we can simply evaluate the `skipButton` value directly inside the `<IonButtons>` element, as follows.

```html
<IonButtons slot="end">
  {showSkip && <IonButton
    routerDirection="forward"
    routerLink="/game"
    color="light">Skip </IonButton>}
</IonButtons>
```

The entire `<IonButton>` definition is included with the markup where it is used. However if `showSkip` is not "truthy," JavaScript's short-circuiting of the conditional expression will prevent the right side of the `&&` from being evaluated. Thus, if `showSkip` is `false`, nothing will be displayed. Now the only reason to have a separate definition for the `skipButton` would be  to use it in more than one place on the page. This is much better.

## IonCard
The next thing I want to do is flesh out the instructions themselves. In the Angular version, I use an `<ion-card>` that looks like this.

```html
<ion-card>
  <div class="concert bg"></div>
  <ion-card-header class="item item-header item-text-wrap">
    <ion-card-title>Welcome to Bravo!</ion-card-title>
  </ion-card-header>
  <ion-card-content class="item item-body">
    <p>
      This is an 'on-the-go' party game for those long waits in 
      theme park lines or long road trips.</p>
    <p>
      It is a card game for you and small group of friends. 
      When you start, you will be given a word or a category
      and one of the following subject areas: 
      Song Lyrics, Song Title, Movie Quote, Movie Title, 
      TV Show Quote, TV Show Title , or Book Title</p>
    <p>
      If you play it in public, you may just find people around 
      you offering their own song suggestions.</p>
  </ion-card-content>
</ion-card>
```

I will forgo any discussion about the custom CSS classes for now and simply concentrate on the markup. It is a typical card component, with a header and some content. Each card is the only child component of each of the `ion-slide` components. I will provide the entire content below, but for now I want to concentrate on what one of them looks like when converted to React.

```html
<IonCard>
  <div className="concert bg"></div>
  <IonCardHeader class="item item-header item-text-wrap">
    <IonCardTitle>Welcome to Bravo!</IonCardTitle>
  </IonCardHeader>
  <IonCardContent class="item item-body">
    <p>
      This is an 'on-the-go' party game for those long waits
      in theme park lines or long road trips.</p>
    <p>
      This is a card game for you and small group of friends. When you start, 
      you will be given a word or a category and one of the 
      following subject areas: Song Lyrics , Song Title , 
      Movie Quote , Movie Title , TV Show Quote, TV Show Title , or Book Title</p>
    <p>
      If you play it in public, you may just find people around you 
      offering their own song suggestions.</p>
  </IonCardContent>
</IonCard>
```

For some reason I do not understand, this code will not compile if the `div` on the second line contains a `class` attribute. Instead, I had to replace `class` with `className`. Then it compiled. Other than that minor glitch, this was reasonably straightforward.

For completeness, here is my entire `<IonSlides>` definition, in case you are following along:

```html
<IonSlides pager={true} onIonSlideDidChange={ionSlideChanged}>
  <IonSlide>
    <IonCard>
      <div className="concert bg"></div>
      <IonCardHeader class="item item-header item-text-wrap">
        <IonCardTitle>Welcome to Bravo!</IonCardTitle>
      </IonCardHeader>
      <IonCardContent class="item item-body">
        <p>This is an 'on-the-go' party game for those long waits in theme park lines or long road trips.</p>
        <p>This is a card game for you and small group of friends. When you start, you will be given a word or a
          category
          and one of the following subject areas: Song Lyrics , Song Title , Movie Quote , Movie Title , TV Show Quote
, TV Show Title , or Book Title</p>
        <p>If you play it in public, you may just find people around you offering their own song suggestions.</p>
      </IonCardContent>
    </IonCard>
  </IonSlide>

  <IonSlide>
    <IonCard>
      <div className="song bg"></div>
      <IonCardHeader>
        <IonCardTitle>Song Lyrics</IonCardTitle>
      </IonCardHeader>
      <IonCardContent class="item item-body">
        <p>On these cards, it's up to each player to come up with and sing the lyrics from a song, containing the
          word
          (or
          subject) at the top of the card.
  </p>
        <p>
          You can repeat a song from another card, but everyone working on the same card should use a unique song
          for
          this card.
  </p>
        <p>
          Sing loudly enough to be heard; in fact, the louder the better.
  </p>
      </IonCardContent>
    </IonCard>
  </IonSlide>

  <IonSlide>
    <IonCard>
      <div className="song bg"></div>
      <IonCardHeader>
        <IonCardTitle>Song Title</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>On these cards, you don't sing, but simply state the title of a song containing the word (or about the
          subject)
          at the top of the card.
  </p>
        <p>
          You can repeat a song from another card, but everyone working on the same card should use a unique song
          for
          this card.
  </p>
        <p>
          This one should be easier than singing, but maybe not.
  </p>
      </IonCardContent>
    </IonCard>
  </IonSlide>

  <IonSlide>
    <IonCard>
      <div className="movie bg"></div>
      <IonCardHeader>
        <IonCardTitle>Movie or TV Quote</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>"Go ahead, make my day." In your best actor's voice, quote a line from a
          movie or TV show containing the word (or about the subject) at the top of the card.
  </p>
        <p>
          As with the other cards, don't repeat the same quote on a single card.
  </p>
        <p>
          This is your chance to ham it up in front of strangers, so don't waste it.
  </p>
      </IonCardContent>
    </IonCard>
  </IonSlide>

  <IonSlide>
    <IonCard>
      <div className="movie bg"></div>
      <IonCardHeader>
        <IonCardTitle>Movie or TV Show Title</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>Show your Hollywood trivia smarts. Name a movie or TV show title containing
          the word (or about the subject) at the top of the card.
  </p>
        <p>
          As with the other cards, don't repeat the same title on a single card.
  </p>
        <p>
          Keep your wits about you, because this one is harder than it might seem. </p>
      </IonCardContent>
    </IonCard>
  </IonSlide>

  <IonSlide>
    <IonCard>
      <div className="book bg"></div>
      <IonCardHeader>
        <IonCardTitle>Book Title</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>Perhaps literary novels (or comic books) are your thing. Name a book title
          containing the word (or about the subject) at the top of the card.
  </p>
        <p>
          As with the other cards, don't repeat the same book on a single card.
  </p>
        <p>
          Some estimates put the number of books ever published at almost 135 Million!
    You should have plenty of titles from which to choose.</p>
      </IonCardContent>
    </IonCard>
  </IonSlide>

  <IonSlide>
    <IonCard>
      <div className="concert bg"></div>
      <IonCardHeader>
        <IonCardTitle>Conclusion</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>Assign each player (or team) a color. There are six, so you shouldn't run out.
  </p>
        <p>
          When someone gets an answer right, meaning they've managed to convince the rest of the players, tap that
          person's color at
          the bottom of the screen to award them a point.
  </p>
        <p>
          You get to decide when to draw the next card. There are no hard and fast rules. It's just for fun after all.
          That's really all
          there is to it. Go forth and have fun!
  </p>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton routerDirection="root" routerLink="/game">
              Continue
        <IonIcon name="arrow-forward"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonCardContent>
    </IonCard>
  </IonSlide>

</IonSlides>
```

# Conclusion
That is enough for a first pass. I got the scaffolding and one page configured and functional, though it is not anything near complete. So far, there are benefits to the React version, though some things do seem harder. I did not even touch upon unit testing the component code, which I find frustrating but manageable in Angular. 

These are some of the things that still need to be done. 
- Game Page 
- Game Card
- Footer Bar, Also Black
- Score Boxes

In my next post, I will try to get the UI working for the game page, even if there are no mechanics yet. 

The repository for this code is publicly hosted on GitHub, so you can follow my progress or even issue pull requests if you wish. 
https://github.com/walkingriver/bravo-react


