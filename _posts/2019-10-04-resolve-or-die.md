---
layout: post
title: Resolve or Die - Error Handling Strategies for Loading Data in Angular
date: '2019-10-04T05:15:00.002-04:00'
author: Michael Callaghan
tags: angular,discussion,development
layout: post
feature: assets/img/angular-logo.png
thumbnail: https://walkingriver.com/assets/img/angular-logo.png
cover_image: https://walkingriver.com/assets/img/angular-logo.png
canonical_url: https://walkingriver.com/resolve-or-die
published: true
---

Angular Route Guards are great. Is the user authenticated? No? The guarded page won't load. Is the user authenticated, but not a member of the appropriate authorization group? Also denied. Route Guards make this easy. They follow the Single Responsibility Principle, can be mocked for unit testing, and all is right with the world. What about Route Resolvers? Where do they fit in?

<!--more-->

# Route Resolvers
Route Resolvers are similar to the Route Guards, with a subtle difference. Instead of keeping the user from rendering the page, a resolver ensures that certain conditions are met before the route completes. Resolvers are typically used to preload data that a given page requires, before the page loads. The general thinking seems to be that there is no reason to show the user a page that is not complete, or still has data to be loaded. 

Imagine a scenario where you have a page that displays order status for the person viewing your site. You might have a route that looks like this...

```
/orderstatus/:orderId
```

Of course you would have a Route Guard to ensure that the logged-in user matches the order being requested. That is the easy part, but do you also need a Route Resolver, to ensure the order details are loaded before showing the page? I think the answer is, "it depends."

# What Data Are You Loading?
In the above scenario, you need to load the order details: what items are on the order, which of those items have been shipped or on back-order, and the tracking information for the items that have been shipped. There may be other details your system has to load. Maybe the item descriptions and payment information come from other systems, and you want to display those, too. The questions you need to ask yourself are which data items are so important that you will not even want to display the page without them? And what if you cannot load those items?

The answer to the first question is really an application design decision. Do you want to ensure that all of the order details have been successfully loaded before the Order Status Page appears? Or is it acceptable to render the page partially, and allow the order details to appear as its data is returned?

If the order status typically takes less than a second to load completely, waiting for it might be acceptable. 

# What If There Are Errors?
Depending on which pattern you choose, you then need to decide what to do in the event that one or more pieces of data cannot be loaded. A service could be down, the network could be flaky, etc. It really does not matter. What do you do? 

## Give up on error
If you are using a Route Resolver, and it encounters an unhandled exception, the route will not resolve, and your page will simply not render. This is obviously not ideal, and you should throw out this idea immediately.

You could catch and log the error, setting the data being loaded to an empty or default object, and then letting the resolver complete successfully. If you do that, you need to think of what the rendered page would look like. Is it still useful for the person trying to load the page? If the answer is yes, then perhaps this is an acceptable solution. You can actually make this choice a case-by-case decision, based on the importance of data being loaded. If it is not "mission critical", go ahead and let the page load.

## Redirect to an error page
On the other hand, maybe your data is so critical that not a smidgen of the page should appear until it is all available. If any missing piece of data causes the page to be useless, consider redirecting to an error page with an explanation of what went wrong. You could optionally provide a link on the error page, allowing the user to retry. After all, it may have been a temporary blip. 

# Maybe not use a resolver
Going back to the Order Status scenario, there is really only one piece of data that would make the entire page useless. And even then, if the page renders without this data, and instead displays an inline error, what is the ultimate harm? 

Allow me to suggest another option. Consider not using a Route Resolver at all. 

## Loading Indicator
A common pattern I have seen is to render the complete page, but with no data. The page displays a "Loading" indicator of some sort while the order details are retrieved, with the page in a non-interactive state. Once the details are available, the indicator disappears and the user can interact with the page at that point. This is a pretty common pattern, which we have all seen.

## Skeleton Text
Yet another pattern renders the page with skeleton text, gray text bars in place of where the details will eventually appear. The page is fully interactive, giving the impression of faster performance, while the order details load. As the data is loaded successfully, it replaces the skeleton text. Any piece of data that fails to load could be replaced with an error message and a retry link.

Either of these alternative patterns can be handled by kicking off the data load during `ngOnInit`, calling into the same data service the Route Resolver would call. This strategy maintains a proper separation of concerns, and allows the service to be mocked during testing. 

# Demo
Here is a demo I created to show all three of these options side-by-side. The demo consists of three Angular page components, each attempting to load some data from a common service. The service simply waits 3.5 seconds and throws an error.  

![Options Demo](/assets/img/resolve-or-die.gif)

If you wish to see the code, here is [the repo on GitHub](https://github.com/walkingriver/resolve-or-die).

# Summary
Here are some ~~rules~~ guidelines I have come up with when deciding how best to load asynchronous data:

1. If your page absolutely cannot be shown unless/until all data is loaded, use a resolver.
    - Do not ignore errors in your resolver, or your page will not render and the user will be stuck in limbo.
    - Redirect the user to an error page, optionally with a retry button.
1. If your page is still somewhat useful with partial data, load the data asynchronously in `ngOnInit`.
    - Use skeleton text or a loading indicator.

Review the demo video to see how each one behaves, and choose the option that works best for your projects.

# Feedback Appreciated
Do you have any comments or questions? Did I miss your favorite pattern? Did I make any mistakes in this post? Let me know on Twitter. I'm [@walkingriver](https://twitter.com/walkingriver).
