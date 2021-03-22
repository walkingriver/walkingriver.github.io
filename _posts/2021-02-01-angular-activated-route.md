---
layout: post
title: Angular ActivatedRoute to Page Route
date: '2021-02-01'
author: Michael D. Callaghan
tags: 
- Angular
- Routing
- RxJS
layout: post
feature: https://walkingriver.com/assets/img/angular-logo.png
thumbnail: https://walkingriver.com/assets/img/angular-logo.png
cover_image: https://walkingriver.com/assets/img/angular-logo.png
canonical_url: https://walkingriver.com/angular-activated-route
published: true
exclude_from_posts: true
---

How to tie changes to an HTML dropdown (select) to your page's URL and reactively respond to those changes, without forcing a page reload. Angular's ActivatedRoute and some basic RxJS make it easy to do.

<!--more-->

![Angular](https://walkingriver.com/assets/img/angular-logo.png)

# Background
On my page I have a dropdown control representing a set of "stores" in the application. When the user selects a new store from the dropdown, information about the newly-selected store is retrieved from a remote service and displayed on the screen.

```html
<select (change)="storeChanged($event)">
  <option *ngFor="let store in stores" [value]="store.id">
    {{store.name}}
  </option>
</select>
```

Wiring that up to the dropdown was as simple as implementing the appropriate event handler.

```typescript
storeChanged(event) {
  const storeId = event.detail.value;
  this.storeInfo = this.storeService.getStore(storeId);
}
```

# Page Refresh

As simple as this approach is, it does not lend itself to page refresh or bookmarking in the browser. The page URL never changes, so if you refresh the page, you have to select your store again. I admit that this is a minor annoyance, but what if there were a straightforward way to make that happen?

# ActivateRoute and Router

If your first thought was to change the page's route to include the store ID, give yourself a pat on the back. This approach makes a minor change to the dropdown's change event handler, and then sets up a subscription on the ActivatedRoute parameters. And as you will see shortly, the component will also navigate to a new route using the Angular Router.

Before making any further changes to the code, there are two classes that need to be imported at the top of the component file.

```typescript
import { ActivatedRoute, Router } from "@angular/router";
```

Both then need to be injected into the component's constructor.

```typescript
constructor(
  private route: ActivatedRoute,
  private router: Router,
  . . . // Other services injected
  ) {
```

## Change the Route

The next thing to do is to change the page's route to include the storeId. This will end up looking something like this in your routing module.

```typescript
// Before
  path: 'stores',
  component: StoreComponent
},

// After
{
  path: 'stores/:storeId',
  component: StoreComponent
},
{
  path: 'stores',
  component: StoreComponent
},
```

Place the original route without the storeID as the second route so that a route like `/stores/circuit-city/` is matched before `/stores`.

## Update the Change Event Handler

Next, update the dropdown component's change event handler to navigate to a new URL when the dropdown changes. It should end up looking something like this.

```typescript
storeChanged(event) {
  const storeId = event.detail.value;
  if (storeId) {
    return this.router.navigateByUrl(`stores/${storeId}`);
  }

  return this.router.navigateByUrl('stores');
}
```

The event handler first checks to see whether the selection has a value. If it does, it calls the Angular Router to navigate to the URL that includes the storeId. Otherwise, it navigates to the default route without the storeId.

The code that used to be there to load the selected store's details will be moved, as you will see next.

## Subscribe to the ActivatedRoute

To get everything working together, it is necessary to detect and respond to changes to the page's route. Angular will not force a page reload. You could do that, of course, but it would require bootstrapping of your entire application, and is absolutely the wrong thing to do here.

Instead, take advantage of the fact that ActivatedRoute provides a number of Observables to which you can subscribe. In this case, the only thing we care about are the route parameters, which are part of ActivatedRoute.params.

We can set up a subscription inside of `ngOnInit`.

```typeScript
ngOnInit(): {
  this.selectedStoreSubscription = this.route.params.subscribe(params => {
    const storeId = params.storeId || '';

    if (storeId) {
      this.storeInfo = this.storeService.getStore(storeId);
    } else {
      // Clear existing results
      this.storeInfo = null;
    }
  });
}
```

Now, any time the route changes, the subscription will receive a new set of params. If the params contain a storeId, it will load the new store. Otherwise, it will clear the existing storeInfo.

## Unsubscribe from the subscription
Because I am subscribing to an Observable with no specific completion, it is necessary to unsubscribe when the component is destroyed. For that, I can simply unsubscribe in the `ngOnDestroy` function.

```typescript
ngOnDestroy() {
  if (this.selectedStoreSubscription) {
    this.selectedStoreSubscription.unsubscribe();
  }
}
```

# Conclusion
After writing this code and being satisfied that it works as expected, I wondered whether or not I could have gotten similar results with an Angular async pipe, and completely dispensed with the subscription. I decided that even though it might be possible, it was probably not desirable. 

Almost every detail of the `storeInfo` would be data-bound on HTML view. I probably could have made it work, but this code is simple enough that I am happy with it as-is. It is easy to understand and easy to test, and there is no reason to change that.

# Angular Advocate

![Angular Advocate Book](https://walkingriver.com/assets/img/aa-3d-small.jpg)

If you are interested in more content like this, please consider my recently-released book, _Angular Advocate: How to Awaken the Champion Within and Become the Go-to Expert at Work_, available in a [Kindle Edition at Amazon](https://amzn.to/3p00l67) or [DRM-free on Gumroad](https://gum.co/angular-advocate).
