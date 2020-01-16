---
layout: post
title: Confessions of a Reluctant Ionic-React Fan
date: '2020-01-07'
author: Michael Callaghan
tags: 
- ionic 
- react
- angular
layout: post
feature: assets/img/react-v1.png
thumbnail: https://walkingriver.com/assets/img/react-v1.png
cover_image: https://walkingriver.com/assets/img/react-v1.png
canonical_url: https://walkingriver.com/ionic-react
published: true
---

What happens when a committed Angular developer crosses over and experiments with React, while working on an Ionic application? Would it work out well, or result in catastrophe? As it so happens, I did that exact thing over the 2019/20 New Year's break. I was asked to come up with some sample questions to test someone's knowledge of Ionic. "Angular or React?" I asked. "How about both?" was the reply. So I set out to create some Ionic questions, based on some real issues I had faced, creating both Angular and React examples. This meant learning at least some of Ionic-React. This post summarizes some of the things that I found pleasantly surprising.

<!--more-->

This is the first in a series on my experience with Ionic-React.

0. Confessions of a Reluctant Ionic-React Fan
1. [Ionic-React, a Brief Introduction](https://walkingriver.com/ionic-react-intro/)
2. _Coming Soon_

# Background 
First, a little background. Everyone who is familiar with me or my writing knows that I am a huge fan of the Ionic Framework. I discovered Ionic back in its v0.5 days, when I wanted to build a mobile app with Cordova, but also use AngularJS. As Ionic entered its adolescence with version 2, it matured from JavaScript and AngularJS to Angular 2 and TypeScript. This maturity continued into young adulthood with version 3, but big things were looming as adulthood approached.

## Framework Agnostic
Ionic version 4 officially introduced completely rewritten components. They were implemented as framework-agnostic web components, and written in Ionic's own newly-created Stencil compiler. 

Without going into too much detail, Stencil made it possible for Ionic to create their entire component library in a manner that would allow them to be reused, without regard to the framework chosen by the Ionic developer. In fact, starting with version 4, the Ionic components could be used without a framework at all! This was a huge milestone, and ultimately led to the creation of the Ionic-React library (and soon, and Ionic-Vue library).

# The Experiment
I decided to create two brand new Ionic projects so that I could make sure my questions had answers that actually work. 

## The Projects
I created two identical projects based on the Ionic sidemenu template, one with Ionic-Angular, and one with Ionic-React, using the following commands:

```bash
ionic start "SampleAngularApp" sidemenu --type=angular
```

```bash
ionic start "SampleReactApp" sidemenu --type=react
```

## Add a "Help" Page
Next, I wanted a blank page that I could use to quickly drop components onto. "Simple," I thought. I just need to run `ionic generate` in each project and create a "help" page.

### Ionic-Angular 
Inside the directory of the Ionic-Angular project, I ran the following command:

```bash
ionic generate page help

CREATE src/app/help/help-routing.module.ts (339 bytes)
CREATE src/app/help/help.module.ts (458 bytes)
CREATE src/app/help/help.page.scss (0 bytes)
CREATE src/app/help/help.page.html (123 bytes)
CREATE src/app/help/help.page.spec.ts (633 bytes)
CREATE src/app/help/help.page.ts (248 bytes)
UPDATE src/app/app-routing.module.ts (1954 bytes)
```

That is more than I needed, but it will do. 

### Ionic-React
Next I ran the same command from the Ionic-React project directory:

```bash
ionic generate page help

[ERROR] Cannot perform generate for React projects.
        
Since you're using the React project type, this command won't work. The
Ionic CLI doesn't know how to generate framework components for React
projects.
```

Well, that is unfortunate. 

I know that the Ionic CLI delegates much of its work to the Angular CLI behind the scenes, but I assumed it would have some scaffolding support for React. It does not. I spent the better part of the next hour trying to figure out which React CLI command to use to scaffold a new page, only to discover that it does not exist. In fact, there seems to be no standard way to do that. My Angular smugness level increased a little.

At that point, knowing that I just needed a blank page, I made a copy of the homepage file and blanked out its contents. It took me a little longer to figure out how to turn it into a "page" to which I could navigate, but I eventually got it to work. 

The fact that the page is a single .tsx file, rather than a folder of 4-6 files, was not lost on me. I appreciated that level of simplicity, though I should note that it does not appear to include any route information, unit tests, or module definitions. Other than the unit tests, I do not miss that level of complexity.

## Intellisense!
The first thing I chose to add was a simple button. I wanted to create a block-width button in the page footer that says "Click Me". Being more familiar with Ionic-Angular, I implemented it there first. 

```html
<ion-footer>
  <ion-toolbar>
    <ion-button expand="block" size="large" color="dark">
      Click Me!
    </ion-button>
  </ion-toolbar>
</ion-footer>
```

Opening up my Ionic-React page, however, I ran into a minor stumbling block. None of the tag names are the same. It did not like it when I simply copied and pasted the above code into my React page. It was right then that I noticed that the existing HTML components in the React page were similar to the Angular ones, but appeared to be all in PascalCase (sometimes mistakenly referred to as CamelCase) instead of kebob-case. That led me to guess that I had the right components, but the wrong casing. 

So I added a new line just after the closing `</IonContent>` tag. I began creating a footer by typing `<IonFo`, and the code editor offered to complete the tag for me as `<IonFooter></IonFooter>`! What is this voodoo black magic? Intellisense (code completion) in my Ionic page's markup? Other than some Ionic-specific code snippets, this was new to me*. 

My next pleasant surprise came just a few short seconds later, when I started the `<IonButton>` component. Not only did the IDE provide me with the opening and closing tags, imagine my delight when I received a dropdown list of all of the tag's attributes and their documentation. 

![IonButton](https://walkingriver.com/assets/img/ion-button.png)

Wow! Even the best snippets do not provide this level of code assistance. Given that I seldom remember all of the valid attributes and values, this feature alone could be worth all of the struggles I had to this point endured. 

Happy with my button, I continued with my next component, excited about what other joys I might find.

## Declarative vs Imperative

One of the issues I ran into back when I updated a project from Ionic v3 and v4 was a silly little problem with the `ToastController.create` function. The newer version returns a promise, and I had forgotten to `await` it. Thinking it would make a decent "what is wrong with this code" question, I created this tiny example in Ionic-Angular.

```typescript
ngOnInit() {
  this.presentToast();
}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'Your settings have been saved.',
    duration: 2000
  });
  toast.present();
}
```

Now I needed to create a React version. The trouble with that plan is that there is no ToastController in Ionic-React. In fact, React has none of these controller classes. A quick trip to the Ionic Component Documentation showed me the right way to do this.

```html
<IonToast
  isOpen={showToast}
  onDidDismiss={() => setShowToast(false)}
  message="Your settings have been saved."
  duration={2000}
/>
```

Notice that the React version is mostly declarative. Rather than injecting a controller into my component class, as I do in Angular, I simply declare an `<IonToast>` tag with attributes appropriately-bound to a local state variable. 

I ended up doing something very similar with a Loading control. The Angular code should look familiar, as it is almost identical to the Toast code.

```typescript
async ngOnInit() {
  const loading = await this.ionLoading.create(
    {
      duration: 5000,
      message: 'Please wait',
      translucent: true
    }
  );
  await loading.present();
}
```

The LoadingController is injected into the component class's constructor, and then quickly displayed during the `ngOnInit` function.

The React code, predictably, also resembles the `<IonToast>` markup. 

```html
<IonLoading isOpen={true}
  animated={true}
  duration={5000}></IonLoading>
```

Again, the amount of code/markup required to display the Loading component is so much more concise than the Angular code, it is almost ridiculous. 

I was left to wonder what else I might be missing.

## Simpler Templates

My next, and final, example, is the Ionic Modal component. To create and present a modal dialog in Ionic-Angular, you need to inject the ModalController into your component, and then write some code to display it and handle its events. 

```typescript
async presentModal() {
  const modal = await this.modalController.create({
    component: ModalComponent,
    componentProps: { value: 123 }
  });

  await modal.present();

  const data = await modal.onDidDismiss();
  console.log(data);
}
``` 

I am purposely omitting the code to call the `presentModal` function, which is pretty trivial. What is not trivial is the other thing I omitted from the above: Notice the ModalComponent passed into the `create` function? That defines everything about the contents of the modal. Where is that defined? 

As it turns out, I have to create a completely separate Angular component (`ng generate component ...`), with all of its ancillary files. If you are creating a large, independent, unit-testable component that you happen to want displayed as a modal dialog, this makes sense. If you want something simple, too bad. You still need to go through the ceremony. Sure, there are shortcuts you can take, such as inline styles and templates. You can also skip unit tests, which seems to be the default in the React code. But there is no getting around that imperative ModalController code above.

The React code, on the other hand, is about as dead-simple as it can be.

```html
<IonModal isOpen={showModal}>
  <p>This is modal content</p>
  <IonButton onClick={() => setShowModal(false)}>
    Close Modal
  </IonButton>
</IonModal>
```

That was defined completely inside the page that displays it, though I could have created a separate component and imported it. The point is that it is entirely my choice as to which path to take.

# Conclusion

There is much exploration to be done with Ionic-React, but I am impressed with what I have seen so far. If I discover any new nuggets, I can always come back and add them to this post. 

## Script in Markup
I still do not care for the entire premise behind what makes React work. I was taught to separate my concerns. Any non-trivial logic inside of my HTML markup rubs me the wrong way, and it is something I may never get over. That said, I appreciate some of the benefits provided by Ionic-React, and admit that some of the declarative metaphors offered are superior to the imperative Angular code.

## What the Future Holds
Fortunately, none of this information should make you feel discouraged about the alleged superiority of Ionic-React. Max Lynch, CEO of Ionic, recently said that the Ionic-Angular library would soon be updated to support a more declarative syntax. So if you are an Angular developer, as I am, you should be able to take advantage of that soon enough. For now, you may bask in the DI-goodness that is Angular, unit-test your components, and separate your concerns with confidence.

---
\* Actually, back in my ASP.NET days, this sort of thing was common. I had simply forgotten the joys of having the IDE doing this for me.