---
layout: post
title: Ionic-React, Upgrading to Ionic v5
date: '2020-01-17'
author: Michael D. Callaghan
tags: 
- ionic 
- react
- web
layout: post
feature: assets/img/react-v1.png
thumbnail: https://walkingriver.com/assets/img/react-v1.png
cover_image: https://walkingriver.com/assets/img/react-v1.png
canonical_url: https://walkingriver.com/ionic-react-5/
published: true
---

Ionic v5 has been released, right in the middle of the conversion of one of my Ionic apps to Ionic-React. So in this post, I will describe what I had to do to upgrade this work-in-progress to the latest version.

<!--more-->

This is the third in a series on my experience with Ionic-React.

0. [Confessions of a Reluctant Ionic-React Fan](https://walkingriver.com/ionic-react/)
1. [Ionic-React, a Brief Introduction](https://walkingriver.com/ionic-react-intro)
2. Ionic-React, Upgrading to Ionic v5
3. _Coming Soon_

# The Application
A few weeks back my "trusty" Mac Mini died. It simply would not power on. Fortunately, it was under warranty. A lot happened while I was waiting for it to be fixed and returned. One of those things was the official release of Ionic v5, including Ionic-React. So before I fully jump back into the app's conversion from Angular to React, I want to make sure it has the latest version of Ionic. 

As I mentioned previously, the app I am converting is called Bravo! It is a tiny app I wrote to help pass the time when waiting in line, on a road trip, or other times you find yourself with lots of time and little to do. You can download it here [for Android](http://bit.ly/android-bravo) or [for iOS](http://bit.ly/ios-bravo). 

# Ionic v5
With the release of Ionic v5, they changed the package name of the Ionic CLI. So that is a good place to start. You need to uninstall the old version, and then install the new version, globally.

```bash
npm -g uninstall ionic
npm -g install @ionic/cli
```

That done, we can proceed with upgrading the framework in the application.

# Upgrade npm Packages
The next thing I did was upgrade the Ionic-React libraries to the latest versions, along with v5 of the Ionic icons. Remember, the icons are in a separate package.

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

The error is on line 35. The context of this code is the list of pages to be displayed in the side-menu itself. It is an array of `AppPage` objects passed into the `Menu`.  The identifier `home` comes from the IonIcons package, and is exported as a string. However, the `AppPage` interface, which is where this error occurs, is defined this way:

```typescript
export interface AppPage {
  title: string;
  url: string;
  icon: object;
}
```

Apparently something has changed. The code is expecting an object, but is getting the exported string value. I went over to the [Ionic 5 Breaking Changes Notes](https://github.com/ionic-team/ionic/blob/master/BREAKING.md), but did not find anything that would explain this. 

# Create a New Ionic-React App?
On a whim, I decided to create a brand new Ionic-React project with v5 of the CLI, based on the side-menu project. It had a different strategy for creating and maintaining the menu. Rather than fight with it, I decided it would be better to try to adopt the newer style. 

The first thing I noticed is that the `Menu` object defines its own version of the `AppPage` interface. It looks like this:

```typescript
interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}
```

The new template also moves the `appPages` array into the Menu component, rather than the App component where it had been.

```typescript
const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  },
  {
    title: 'List',
    url: '/list',
    iosIcon: listOutline,
    mdIcon: listSharp
  }
];
```

The new interface replaces the `icon` field with two, `iosIcon` and `mdIcon`, both of which are strings. So that is one problem solved. I looked at the original code to generate the menus. It used to look like this:

```html
<IonItem routerLink={appPage.url} routerDirection="none">
  <IonIcon slot="start" icon={appPage.icon} />
  <IonLabel>{appPage.title}</IonLabel>
</IonItem>
```

The new version looks like this:

```html
<IonItem className={selectedPage === appPage.title ? 'selected' : ''}
  lines="none"
  routerLink={appPage.url}
  routerDirection="none">
  <IonIcon slot="start" icon={appPage.iosIcon} />
  <IonLabel>{appPage.title}</IonLabel>
</IonItem>
```

Notice that it simply sets the `icon` attribute to the value of the `iosIcon`. This is not what I was expecting, though. I have never seen or used the `icon` attribute before. I have always used `name`. 

Thinking I might be a little confused, I consulted the [Ionic React Docs](https://ionicframework.com/docs/api/item). As I thought, the docs indicate that the `<IonIcon>` component is supposed to have the icon specified using the `name` attribute. However, if you do that, you will see a deprecation warning that you should use `icon` instead. Ok, I guess the docs need to be updated. 

The [IonIcon v5 Release Notes](https://github.com/ionic-team/ionicons/blob/master/CHANGELOG.md) do not mention the `icon` at all, but instead specify that there are two different variants: one each for iOS and Material Design. Following those directions, I decided to change the `IonIcon` attributes to look like this.

```html
<IonIcon slot="start"
  ios={appPage.iosIcon}
  md={appPage.mdIcon}
/>
```

As soon as I did that, the icons vanished from the menu. Replacing the `ios` and `md` variants with the single `icon` caused the icons to reappear. It seems, at least with v5 of Ionic-React, you cannot specify variants, and must use `icon`. I decided to leave it in the `AppPage` interface, in case this gets fixed in the near future.

# Navigation Changes
The next change is to the app's page navigation, and appears to be a significant change from v4. The original navigation code in App.tsx looks like this:

```html
<Menu appPages={appPages} />
<IonRouterOutlet id="main">
  <Route path="/home" component={Home} exact={true} />
  <Route path="/home/list" component={List} exact={true} />
  <Route path="/" render={() => <Redirect to="/home"/> } exact={true} />
</IonRouterOutlet>
```

The `appPages` array, shown above, was defined in App.tsx, and simply passed to the menu. As I mentioned, it is now defined in the Menu itself, and the logic in App.tsx is completely different. In fact, it took me some time to understand the change.

```typescript
const [selectedPage, setSelectedPage] = useState('');
```
```html
<Menu selectedPage={selectedPage} />
<IonRouterOutlet id="main">
  <Route path="/page/:name" render={(props) => {
    setSelectedPage(props.match.params.name);
    return <Page {...props} />;
  }} exact={true} />
  <Route path="/" render={() => <Redirect to="/page/Inbox" />} exact={true} />
</IonRouterOutlet>
```

Now, instead of sending the array of pages, it sends the current page as `selectedPage` into the Menu. The page name is derived from the route parameters. I found this to be clever, because it reduces the number of `<Route>` components to two. I resisted this change, however. Digging deeper, this strategy only makes sense if your pages are all similar. It seems like a minor gain (fewer routes) in exchange for making it harder to understand. My compromise solution was a hybrid of the old code and the new code.

```html
 <Menu selectedPage={selectedPage} />
  <IonRouterOutlet id="main">
    <Route path="/home" 
           render={() => { setSelectedPage('Home'); return <Home />; }} exact={true} />
    <Route path="/list" 
           render={() => { setSelectedPage('List'); return <List />; }} exact={true} />
    <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
  </IonRouterOutlet>
```

I kept the concept of the `selectedPage`, but provided explicit routes. At the risk of a bit of redundancy, anyone who looks at my routes can tell exactly what is going on. I have two pages, and thus two actual routes. The third route is simply a catch-all to redirect to the home page.

# Style Updates
The last thing I needed to take care of is that `selected` class on the menu item. Recall that the `<IonItem>` definition for each menu item starts with this:

```html
<IonItem className={selectedPage === appPage.title ? 'selected' : ''}
```

The former side-menu template did not have that. The Menu.css file that is now included with v5 of the side-menu template contains 113 lines of styling. My CSS is "passable," and I figure they know what they are doing better than I do. I copied the entire thing and imported it into the top of my Menu.tsx file.

The styling had some extra padding at the top and bottom of the menu items, to make room for some extra content in the newer menu. I removed both the padding and the extra content. The resulting menu styling looks like this.

![Ionic-React v5](https://walkingriver.com/assets/img/bravo-react-ionic-5.png)

The current page is thus highlighted just as you might expect.

# Conclusion
This Ionic v4-v5 upgrade did not go as well as some of my others. That said, it was not extreme, and I managed to get it working pretty quickly. 

I am not the only one who has been struggling with Icon changes since v5 was released. There were a lot of people on Twitter sharing similar frustrations. From what I have seen, though, this has really been the only roadblock with the upgrade.

If you are interested in the complete set of changes I made to the project, you can review the [Pull Request](https://github.com/walkingriver/bravo-react/pull/3/files).

# What is Next?
Now that the upgrade to Ionic v5 is complete, here are some of the things that still need to be done to complete this project: 
- Finishing the Instructions Page
- Game Page 
- Game Card
- Footer Bar, Also Black
- Score Boxes

In my next post, I will try to get the UI working for the game page, even if there are no mechanics yet. 

The repository for this code is publicly hosted on GitHub, so you can follow my progress or even issue pull requests if you wish. 
https://github.com/walkingriver/bravo-react


