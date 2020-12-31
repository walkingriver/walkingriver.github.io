---
layout: post
title: Upgrading an AngularJS Project to Angular
date: '2020-12-30'
author: Michael D. Callaghan
tags: 
- TypeScript
- Angular
- Web Development
layout: post
feature: https://walkingriver.com/assets/img/angular-logo.png
thumbnail: https://walkingriver.com/assets/img/angular-logo.png
cover_image: https://walkingriver.com/assets/img/angular-logo.png
canonical_url: https://walkingriver.com/angularjs-to-angular/
published: true
---

For the past few months I have been involved with migrating an AngularJS 1.4 app to a more modern version of Angular. Below I will describe some of the processes, techniques, and issues I have encountered to make the migration successful.

<!--more-->

# Preparation

Before starting the migration, there are a few things that will make it easier, or harder, depending on your project's configuration.

## TypeScript

I was fortunate in that the entire AngularJS project I was migrating was already written in TypeScript. Each AngularJS controller was already a single class. If that had not been the case, I would still consider the controller itself to be a component in the new project.

## Routing

My project used the Angular UI router. In your new project, I recommend using the default app routing module. Make a note of each state or route in your app. Copy them down with their relative URLs so that you don't forget any.

## ControllerAs or $scope pattern

Your AngularJS project is probably built with one of two patterns: You either use `$scope` to reference variables on your controller, or you created a "view-model" object and referred to it by name in your template. With an Angular component, you will use neither. When you migrate your HTML templates, you will remove all instances of the view-model object. If you used `$scope`, you probably won't have to do anything to bind your variables.

## UI Directives

In one of my projects, all our UI directives were already written as components. In another, the one I am currently migrating, they are not. The good news is that UI components and directives migrate just as easily as pages. To Angular, they are all simply components.

## Bower Packages

Bower has all but been abandoned. Check your bower.json file and bower_components folder for any libraries you think you may need to keep. By now, most every bower package your old AngularJS project uses can be found in npm. Don't bother trying to find new versions until you know you need them. What I found is that I could ignore them mostly, finding them in npm as necessary.

# Start a new project

Starting with the latest Angular CLI, the first thing I did was create a brand new project with `ng new`. That provides a simple skeleton app, scaffolded with a single page and pre-configured routing.

# Migrate one page at a time

To migrate a page, I used the Angular CLI to create a page in the new project, using the same name as the old page. For example,

```bash
ng generate component ProductDetail
```

_Remember: All pages in Angular are components._

By default, this command creates four new files in a folder called product-detail:

- product-detail.component.html
- product-detail.component.ts
- product-detail.component.scss
- product-detail.component.spec.ts

It will also modify app.module.ts to reference your newly-created component.

## What about lazy-loaded page modules?

The project I migrated does not use lazy-loaded pages, but I recommend that you do so if you can. If I have time, I may convert this project to do that, but it's definitely out of scope for now.

# Copy the controller code into the component

The first thing I do with any page is copy the controller code from the old page into the new page's component class. An empty component class looks something like this:

```typescript
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
```

## Variables

First, find all all your variables in the old controller and copy them to top of the class, just above the constructor.

## Constructor and ngInject
My controllers were already written in TypeScript, so I started with a class that had a constructor. Everything being "injected" into my controller are listed as parameters to the class constructor. Those got copied and pasted into the TypeScript component class without modification.

If you are not using TypeScript in your AngularJS controller, you will still be able to find the list of items being injected into your controller by the array of dependencies being passed to your controller's function parameters. Simply copy those to your new component's constructor.

The trick at this point is to provide the appropriate `import` statement and types for each one. You may be able to put that off for a while, but eventually your component will need to know what those dependencies are. Each one will need to be matched to a type and an import at the top of the class file.

In one case, my existing page listed eight such dependencies. Each one was either a bower package, an Angular service, or an internal service. Fortunately, I was able to find an npm equivalent for each bower package. The Angular services were not quite as simple, and I will touch on them later. 

The others were services internal to the project. For those, I needed to migrate or replace them. Because those are project-specific, I can only offer very generic advice. 

Try to use your internal services as-is, if you can. If you cannot, you may need to mock them temporarily to get your page to render. 

You will probably have more than one call to AngularJS's $http service, which you will need to upgrade to Angular's HttpClient. That is not terribly difficult, but you may want to mock those services so that you can focus on one task at a time.

Another quirk is that all my older project's constructor parameters were tagged as `public`, which is not desirable in my opinion. When I copied them to the new component, I changed them to `private`. 

## Functions

Next, copy every function from your controller into the blank space between `ngOnInit()` and the final closing brace. 

If your controller contains any initialization logic, you may want to start with putting that into `ngOnInit()`. Try not to put too much logic into your constructor.

If you are fortunate enough to be copying TypeScript code, you won't need to do much more. But if you are copying JavaScript, you will need to remove the word `function` from each one of them. If your project has anonymous functions tied to controller variables, you may have a little extra work to do.

For example, my controller functions all looked like this:

```javascript
function doSomething() {
  ...
}
```

In this case, all I had to do was remove the word `function` and the rest of it could stay the same (for now).

However, your controller functions might look like this:

```javascript
var doSomething = function() {
  ...
}
```

In either case, my recommendation is that make all your functions look like this:

```typescript
doSomething() {
  ...
}
```

## Dealing with this

Once my functions were fixed, the next thing I discovered was that many of them had the following first line:

```javascript
var self = this;
```

The rest of the function referred to the variable `self` to read or write to variables on controller object itself. I won't go into the joys of `this` in JavaScript. You can find plenty of angry rants elsewhere for that. The good news is that this sort of thing simply isn't necessary with TypeScript classes, which is what your new component is.

So, to deal with that, the first thing I did was remove every line like the above. Then I converted all instances of `self.` to `this.` throughout the entire component. Yes, I used a blind find/replace, but so far it has never been an issue.

I also found some places in my code that calls into other functions as a callback to another function, like this:

```javascript
this.doCoolThingWithCallback(input, this.thingCallback.bind(this));
```

The reason for the `bind` is so that `this` is a reference to the caller inside `thingCallback`. With TypeScript, simply replace that with an anonymous arrow function, which solves the "this" problem.

```typescript
this.doCoolThingWithCallback(input, () => this.thingCallback());
```

## Calling controller functions

If you are following along, you may have some function calls flagged as errors because the functions are defined in your component. Simply prepend them with `this.` and you should be fine.

## Anonymous functions

The next thing I do is replace every anonymous function with an arrow function.

```javascript
service.getData()
  .then(function(data) {
    ...
  });
```

In the TypeScript component, that simply becomes this:

```typescript
service.getData()
  .then((data) => {
    ...
  });
```

# Promises
Many of my controllers use promises, and do so through the Bluebird library. TypeScript has built-in support for native Promises, so I have been able to remove Bluebird entirely.

## What about async and await?
If you are migrating older AngularJS to Angular with lots of promises, you might be tempted to convert them all to async and await. I did that at first. I strongly recommend you resist that temptation. At this point, your goal is not to refactor, but to migrate. You want to change as little code as possible. If you have promises that are working with `.then()`, keep them.

# Navigation parameters
My controller used `$stateParams`, which map nicely to Angular's ActivatedRoute. During the component's `ngOnInit()` function, I grab the snapshot from the ActivatedRoute and set the state parameters my component is already expecting.

For example, one component was looking for the following, injected into its original controller:

```typescript
  $stateParams: { storeId: string, subsetId: string };
```

I moved that definition out of the constructor and into the component itself as a variable. Then, I modified `ngOnInit` to look like this:

```typescript
  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    this.stateParams.storeId = snapshot.params.storeId;
    this.stateParams.subsetId = snapshot.params.subsetId;
  }
```

As you can also see, I also removed the `$` from the variable name, which I did safely using the variable refactor tooling in my code editor.

# Service refactorings
As I mentioned above, my page had some external dependencies injected into it. Those needed to be addressed. I still had some older AngularJS constructs being injected that I needed to fix.

## $q
The first was that `$q: ng.IQService` was referenced. For that, I can simply remove it entirely and change anywhere it's being used into a native TypeScript `promise`. For example, I had this use of `$q`:

```typescript
this.$q.all(promises).then(
  (data) => {
    this.getAllProductsSuccess(data);
  },
  (data) => {
    this.getAllProductsFailure(data);
  }
);
```

I replaced it with this instead:

```typescript
Promise.all(promises).then(
  (data) => {
    this.getAllProductsSuccess(data);
  },
  (data) => {
    this.getAllProductsFailure(data);
  }
);
```

In case it is not clear, the variable `promises` is defined as `Promise<any>[]`. I will eventually do something about the `<any>`, but for now it should be fine.

## $location
The old AngularJS LocationService is used in my controller, but I'm not entirely sure why. In the case of the page I'm currently migrating, it was better to use the router, which is what I did instead. I found this function in the old code:

```typescript
  navigateToListing()
    this.$location.path('/listing');
  }
```

That makes no sense to me, as I would prefer to use the router. So, I changed the constructor to get a reference to the Angular Router object with `private router: Router`, and changed the function to look like this instead.

```typescript
  navigateToListing()
    this.router.navigateByUrl('/listing');
  }
```

If the only call to this function was from a button in the HTML, I could also use a `[routerLink]` attribute instead and remove the function call entirely, like this:

```html
<button [routerLink]="/listing">Return to Listings</button>
```

## FormController
If the page you are migrating has a FormController, as did mine, you may have a little more work to do. I had never used this before, but this page has a pretty complex form, so I think I understand why they used it initially. 

The definition at the official AngularJS docs says:

> FormController keeps track of all its controls and nested forms as well as the state of them, such as being valid/invalid or dirty/pristine.

That sounds like Angular's Reactive Forms, so I immediately wondered whether I could replace the form with that. Peeking inside my template, I found many uses of `ng-model`, which performs two-way data binding from the form to the controller. That patterns sounds like Angular's Template-driven forms, so it required additional investigation.

The service was injected into my controller as `form: IFormController`. So, the first thing I wanted to do is find out how much it is used, which I did at the command line with grep.

```bash
 grep 'this.form' src/app/features/product-subset-detail/product-subset-detail.component.ts 
    this.form.$setPristine();
    this.form.$setPristine();
```

Well, that doesn't seem too bad. For now, I decided simply to delete the reference and comment those two lines. Had it been more involved, I would have looked into refactoring the form into a ReactiveForm. But, as I said earlier, you want to avoid heavy refactoring until after you get the page migrating and functioning at least at a basic level.

# Interfaces
If your AngularJS project is written with JavaScript, you won't have any interfaces. My project was in TypeScript, and had interfaces defined all over the place. During the migration process, I created a new folder just for them and copied each interface into its own file. This was absolutely unnecessary, but it cleaned up the code just a bit and made me happy.

# The template
With the controller migrated to a new component, it was time to turn my attention to the HTML template. My component code was free of compiler errors. Whether or not it works will still depend on whether or not I missed anything. 

## ViewModel or $scope
If your controller uses `$scope`, your data bindings are probably already correctly mapped to your view. If your controller uses a viewmodel pattern, as mine all do, you need to get rid of that reference everywhere it exists in your template. 

For example, my controllers all used a viewmodel object named for the page (rather than simply `vm` as I've seen many developers use). My data bindings all look like this:

```html
<span>Product Name: {{ProductDetailVm.productName}}</span>`
```

The quick solution was to use Find/Replace to remove all occurrences of `ProductDetailVm.` (don't forget the dot). After that, the above data binding looks like this.

```html
<span>Product Name: {{productName}}</span>`
```

Assuming I didn't miss anything, the component should already have a property named `productName`.

## Custom directives
At the very top of my first HTML template I found two separate custom directives. Those will obviously need to be dealt with at some point, but for now I chose to skip them.

## Angular directives
Angular directives are much simpler to convert, so I decided to start there. Most of these can be handled with a simple find/replace operation:

| AngularJS | Angular | Notes |
| -- | -- | -- |
| ui-sref | [routerLink] | 
| ng-if | *ngIf |
| ng-show | *ngIf | It might make more sense to use `*ngClass{hidden: condition}`)|
| ng-hide | *ngIf | It might make more sense to use `*ngClass{hidden: condition}`)|
| ng-repeat | *ngFor | Requires additional syntax changes, see below. |
| ng-model | [(ngModel)] |
| ng-class | ngClass |
| ng-click | (click) |
| ng-change | (change) |
| ng-disabled | [disabled] |
| ng-pattern | pattern |
| ng-maxlength | maxlength |

Granted, all of these will need to be revisited at some point to ensure that they do the right thing. There are a few extra steps to be taken once the attributes themselves were changed.

### ng-repeat and *ngFor
I had a data table, where each table row `<tr>` is repeated using `ng-repeat`. This construct needed to be migrated to use `*ngFor` with its modern syntax. It isn't hard, but it's also not a simple Find/Replace as many of these have been.

Before:
```html
  <tr ng-repeat="item in displayedCollection">
```

After:
```html
  <tr *ngFor="let item of displayedCollection">
```

As you can see, I replaced `ng-repeat` with `*ngFor` and fixed the looping expression.

### ngIf "gotchas"
Remember that `*ngIf` literally adds or removes elements from your page's DOM. This is important if you ever try to get a reference to an element from your component. 

For example, I found code in my old controller that manipulated an HTML element directly. It called `document.getElementById` to retrieve a reference to that element. I prefer to use Angular's `@ViewChild` decorator, as I find it to be a little cleaner. The "gotcha" is that if the element being referenced by `@ViewChild` happens to be hidden inside another element that has an `*ngIf`, it may not exist when you want to use it. 

For this reason, I prefer to keep my use of `*ngIf` limited to very small elements, or not use it at all. Instead, I prefer to show/hide elements with a CSS `hidden` class, which is simply defined as `.hidden { display:none; }` in my app's global style sheet. I find for most use cases, this works as well, if not better, than `*ngIf`.

## Custom components
My form contained a custom DatePicker component that does not work with Angular. Fortunately I was able to find a replacement that did, which did not require too much additional customization. 

I recommend that as you convert your pages, try to determine ahead of time whether or not you will be using a third-party component library (such as Ionic, Angular Material, Bootstrap, etc.). It might be easier if you take inventory of all the custom components in your existing application, and then decide how to replace them in the migrated app.

## Bootstrap Grid???
Speaking of Bootstrap, my AngularJS app makes heavy use of Bootstrap's grid system. At first I thought I would simply remove and it replace it with something else. The trouble was I did not quite know what that "something else" would be. I briefly considered using Ionic's `<ion-grid>`, as it is quite straightforward to use Ionic components selectively. The unused portions get "tree-shaken" out at build time. 

I also considered downloading a [customized version of Bootstrap 3.4](https://getbootstrap.com/docs/3.4/customize/), including only the grid system.

Then I stumbled on [a blog post by Chris Wachtman on replicating the Bootstrap grid system with CSS Grid](https://speckyboy.com/replicate-bootstrap-grid-using-css-grid/). The code looks pretty clean, so I'm going to give it a try. 

# Unit Testing
I still need to migrate all my unit tests. You do have unit tests in your app, right? I certainly do, and many of them will need some love. One anti-pattern I uncovered during this migration is that many of the functions that make http calls don't return the promise returned from the service. 

For example, consider this function: 

```typescript
  getProduct(): void {
    this.loading = true;
    this.myService.getProduct(
      this.productId
    ).toPromise()
      .then(
        (data) => {
          this.getProductSuccess(data);
        },
        (data) => {
          this.getProductFailure(data);
        }
      );
  }
```

The first thing you may notice is the call to `.toPromise()`. The call to `myService.getProduct()` returns an observable. When I migrated all my services, I decided to [embrace RxJS as much as possible](https://walkingriver.com/rxjs-select-rest/). However, for the purposes of migrating the individual pages, it was simpler to leave the promise handlers in place, at least for now. This function is essentially identical to the original from the AngularJS project, with the simple addition of the call to `.toPromise()`.

Every one of my service calls follows this same pattern. 
- Call the service
- Handle the success
- Or handle the failure

Have you spotted the problem yet? There are two remaining.

The first is that there is no `finally()` call to reset `this.loading`, which controls a visible loading indicator. That is handled in the both the success and failure functions. That's minor, however, to the glaring problem preventing me from testing these functions property.

The promise returned from `getProduct(...).toPromise()` is never returned! This makes testing the function extremely difficult. Fortunately, simply adding a return statement to the front of it fixes it, and has no negative side-effects. 

This is the current implementation:

```typescript
  getProduct(): void {
    this.loading = true;

    return this.myService.getProduct(
      this.productId
    ).toPromise()
      .then(
        (data) => {
          this.getProductSuccess(data);
        },
        (data) => {
          this.getProductFailure(data);
        }
      ).finally(() => {
        this.loading = false;
      });
  }
```

I still need to revisit and possibly rewrite every existing unit test, but that will be a topic for another time.

# What Next?
At this point, everything was migrated and it was time to fire it up to see how it looks. As you might guess, it still isn't perfect. However, it seems to be mostly functional. 

If you find any hints or tricks that work for you, which I did not address here, please let me know.

I hope that your migration goes well. 
