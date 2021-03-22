---
layout: post
title: To RxJS or Not to RxJS
date: '2020-10-12'
author: Michael D. Callaghan
tags: 
- TypeScript
- Angular
- Web Development
layout: post
feature: /assets/img/rxjs.png
thumbnail: /assets/img/rxjs.png
cover_image: /assets/img/rxjs.png
canonical_url: https://walkingriver.com/rxjs-select-rest/
published: true
exclude_from_posts: true
---

I am currently working on a project to uplift some AngularJS code to Angular 10. On a recent code review there were some concerns that came up about the heavy use of RxJS. I will attempt to address those concerns in this post.

<!--more-->

Of particular note were the following assertions:
1.	RxJS is hard to learn/read.
2.	RxJS is hard to test.

# Hard to Learn
Admittedly RxJS has a steep learning curve. That said, it should only take an week or so to become accustomed to using it. Once you understand the basics, the more esoteric operators are mostly a matter of finding them. There is a great website that makes this easier, which is where I found the `fromEvent` and `combineLatest` operators I use below. https://rxjs.dev/operator-decision-tree

# Hard to Test
Testing Angular is itself often an exercise in frustration. The key is knowing what to test and what not to test. I wrote a [blog post on that very subject](https://walkingriver.com/stop-testing-my-code/). Some people go overboard and try to achieve 100% code coverage. I have found that more than about 80-85% is usually counter-productive. Often, people will write brittle (or worse, useless) tests to try to hit some magical coverage number.

RxJS is no more difficult to test than Angular, assuming you write your code to be testable in the first place. This is not always the case, especially when you try to do too much with it at once. My strategy is to create observables that do one thing that I can explain in a comment. For example:

-	Convert input event into stream of search terms.
-	Make web service call on selection change.

These sorts of observables are reasonably straightforward to write and test. More importantly, they are also straightforward to read and to modify.

# The Code
The code in question includes a custom dropdown with search capability. The idea is that you can bind a very long list of items and either select one or search for one by name. The component fires a custom DOM event, `selected-changed`, to indicate that the user has made a new selection.

The dropdown represents a list of "stores." Whenever a store is selected, the app needs to make a web request to load products associated with that store. 

Though it renders and behaves like an HTML `<select>` tag, it does not actually contain a `<select>` element. Fortunately, this turned out to be irrelevant. 

The first challenge was to figure out what event was being thrown. The docs showed that I could use `(selected-change)="storeChange($event)`, so I wired it up to see what the event looks like. It seemed to be exactly what I had hoped: a custom DOM event.

The next step was to create an Observable I could subscribe to. I created a component variable I could use to subscribe to the event using Angular's `@ViewChild` decorator.

```typescript
@ViewChild('storeList') storeListDropdown: ElementRef;
```

That led to this small bit of code: 

```typescript
this.storeChanged$ = fromEvent(this.storeListDropdown.nativeElement, 'selected-changed')
  .pipe(tap(x => {
    console.log(x);
  }));
```

Now I could verify whether or not I could truly subscribe to these custom events. A quick test showed that indeed I could. Hurdle one cleared.

## Make the service call
Next, I needed to take the newly-selected value and use it to make a service call. For various reasons, I cannot show the actual call here, but I think I can show enough to get my point across.

## I only care about selections
It is possible for the user to select nothing, at which point I do not want to make a service call. So I added a filter to the observable's pipe to ensure I am only getting selections.

```typescript
this.storeChanged$ = fromEvent<CustomEvent>(this.storeListDropdown.nativeElement, 'selected-changed')
  .pipe(
    filter(x => x.detail?.value?.length),
    tap(x => {
      console.log(x.detail.value[0].value);
    }));
```

With that I was able to confirm that it only fired when the user selects something. There is another use case to clear the results if the user selects nothing, but that is not currently important. 

## Make the web call
Next up was to make the web service call. I modified the `tap` function to set a component variable that holds the selection, then added a `switchMap` to call an Angular service that hides the actual HTTP call. Now it looks like this.

```typescript
this.storeChanged$ = fromEvent<CustomEvent>(this.storeListDropdown.nativeElement, 'selected-changed')
  .pipe(
    filter(x => x.detail?.value?.length),
    tap(x => {
      this.selectedStore = x.detail.value[0].value;
    }),
    switchMap(x => this.getProducts(this.selectedStore))
  );
```

I could drop the `tap` and done both the variable assignment and the service call inside of the `switchMap` operator. I may eventually do that, but for now I like the way that each step is visually separated.

## Search filter
A single "store" in this project could return anywhere from 0 to potentially hundreds or thousands of products. Each record is small, so for now, we are keeping the filtering of products entirely client-side. To support that, the UI has a search box. Entering anything in the search box should cause the records to be filtered to those records matching the value entered. This called for another observable, which I will show in its entirety.

```typescript
this.searchFilterChanged$ = fromEvent<InputEvent>(this.searchBox.nativeElement, 'input')
  .pipe(
    // tslint:disable-next-line: no-magic-numbers
    debounceTime(300),
    map(_ => {
      this.searchFilter = this.searchBox.nativeElement.value;

      return this.searchFilter;
    }),
    distinctUntilChanged(),
    startWith('')
  );
```

As you can see, I start by creating an observable from the HTML `input` event. That fires an event for every change to the text box. This stream is then sent through another RxJS pipe to do the following:

1. The observable is "debounced" so that any value is delayed by 300ms. This prevents the events from coming in too fast as the user types. 
1. The `distinctUntilChanged` operator ensures that only changes to the value are sent. In other words, if the user repeated presses the space bar and the backspace key in rapid succession, resulting in no change to the text box, my code will never see it. It is unlikely, but possible.
1. Inside of `map`, I assign the value of the `<input>` element to a component variable named `searchFilter` and return that value. This successfully converts the event into a string I can use as a search value later.
1. The final operator is `startWith('')`, which will be important later. This initializes the observable stream with an empty string value.

## Pager component
My final component is another custom one that handles paging. As I said, the results of the web service can potentially contain thousands of records, so I want to provide a user a simple way of paging through those results. Like my other custom component, it also fires a `CustomEvent` called `nav-selected`. I again used `fromEvent` and set it up similarly to the first one.

```typescript
this.pagerChanged$ = fromEvent<CustomEvent>(this.pager.nativeElement, 'nav-selected')
  .pipe(
    map(x => x.detail.currentPage),
    startWith(1)
  );
```

This is the simplest of the bunch. Inside its pipe, I map the details from the custom event into the page the user selected. Once again, I start the stream with a default value.

## Combine them all
Why did I go through all of this instead of simply using angular event binding? This is why. Now that each event is its own individual stream of events, they can easily be combined using the RxJS operator `combineLatest`. This operator accepts an array of observables as its input and returns a single observable. As its name implies, this observable fires when any of its input observable values changes. Whenever that happens, the subscriber gets the latest value of each of its constituent observables.

The caveat for this operator is that it will not emit an event until each observable in its input array has fired at least once. This is why each of my observables above (except the first one) used `startWith` to set an initial value. The store dropdown did not need one because until the user selects a store, there is no reason to do anything.

How does this all work in practice? Every time the user selects a new store, changes the search filter, or selects a new page on the pager, my subscriber gets the most recent value of each of those three observables. Here is the code.

```typescript
this.filteredProducts$ = combineLatest([
  this.storeChanged$,
  this.searchFilterChanged$,
  this.pagerChanged$
]).pipe(
    map(([products, search, page]) => this.filterProducts(products, search, page))
  );
```

Inside of the `map` operator, you can see that each value from the array of observables is passed into its arrow function. I pass those values into a pure function on my component called `filterProducts`. This function handles the filter and paging on the `products` array to return a new array of products.

Keep in mind that the return of `combineLatest`, which is assigned to `this.filteredProducts$`, is itself an observable. This is important because of what happens next.

## Inside the template
Because of the composition of these three independent observables into a single observable, binding to its results is almost trivial. Inside my HTML template, I have the following markup inside an HTML `<table>` tag.

```html
<tr *ngFor="let product of filteredProducts$ | async">
  ...
</tr>
```

By using Angular's `async` pipe, I never need to subscribe or unsubscribe to the observable. Angular handles all that for me. Whenever any of the three source observables changes, the table will update to reflect those changes.

## The benefit of this approach 
I started down this path of using RxJS for user events because I wanted to isolate each event and hide the irrelevant details from its consumers. By using `fromEvent` I am able to tweak and modify each event to get exactly the behavior I am looking for, separate from the others.

With that, the final observable created with `combineLatest` requires no additional manipulation. I can pass the values to a pure function to get exactly the data to be displayed, and then bind that data with a simple `*ngFor` and `async` pipe. 

Testing each observable stream independently from the others also becomes almost trivial.

What I really like most about this approach, though, is how extensible it is. When I first wrote this code, I only had the custom dropdown and the text input box for searching. It was all working properly when I decided to add the custom pager control. The result was that I was able to include the pager, set up and test its custom event, and then simply wire it up to the `combineLatest` operator by adding it to the input array. Then I added it as an input to my `filterProducts` function.

# What Do Others Think?
I double-checked my philosophy with some people I consider experts, both inside and outside of team. Here are some of the responses I received (mostly paraphrased):

-	That code is awesome!
-	For me it's a tradeoff between simplicity (Angular's event bindings) and power (RxJS fromEvent). In the majority of cases I only need the simple event bindings. As soon as you try doing something special (debounce, filter, delay, etc.), use RxJS.
-	Observables are a heavy pill to swallow. If you get why you'd use it (sync/async feel the same, pure function pipelines of data, deterministic, easier to unit test), cool. Otherwise, hide in the Model layer so dev can play away from 'em elsewhere. 
-	I struggled for a long time to understand RxJs (still don't get everything) but once I had a use case, it was a no-brainer to use the library. 
-	Every time I have to touch rxjs code it's a major PITA and source of bugs for me. I'm not intelligent enough to understand it, no matter how many rxjs tutorials I read. 

Interestingly, some suggested that learning to use state management with NgRx might result in a lower learning curve than raw RxJS. My experience has been the opposite.

Ultimately, I recommend that you use the best tool for the job. If that means going a little outside of your comfort zone to learn RxJS, so be it. 

Everything you see above took about three days start-to-finish to get right, including the unit tests I have not shown. When I began, I knew almost nothing about any of these RxJS operators I ended up using.
