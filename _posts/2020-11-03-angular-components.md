---
layout: post
title: A Simple Angular Component
date: '2020-11-03'
author: Michael D. Callaghan
tags: 
- TypeScript
- Angular
- Web Development
layout: post
feature: https://walkingriver.com/assets/img/angular-logo.png
thumbnail: https://walkingriver.com/assets/img/angular-logo.png
cover_image: https://walkingriver.com/assets/img/angular-logo.png
canonical_url: https://walkingriver.com/angular-components/
published: true
---

Angular components do not need to be complicated. In fact, with a little HTML and CSS, it is reasonably straightforward to build a component you can reuse in all your projects. I will detail the creation of a "Loading" indicator.

<!--more-->

On one of my projects I needed to display a small screen that simply tells the user that data is being loaded from a remote service. Angular makes this almost too easy.

# Create the Component
To create the component, I used the Angular CLI.

```bash
npx ng generate component Loading --spec=false --dry-run
```

The output is essentially the same with either.

```bash
CREATE src/app/loading/loading.component.scss (0 bytes)
CREATE src/app/loading/loading.component.html (26 bytes)
CREATE src/app/loading/loading.component.ts (272 bytes)
```

This command asks the Angular CLI to generate anew component named "Loading", not to bother generating a test file (I will explain why not shortly) and then simply show me what the command will do (--dry-run). 

I almost always do a dry run before having the CLI generate anything for me. That way, I can what files it will create and modify and where it will put them. On some projects I like to organize components differently than the default. Seeing the file paths before creation gives me a chance to correct them, simply by pre-pending the path to the name of the component.

In this case, I am comfortable with the component living in its own folder under `app`, so I can rerun the command without the `--dry-run` flag.

```bash
npx ng generate component Loading --spec=false          

CREATE src/app/loading/loading.component.scss (0 bytes)
CREATE src/app/loading/loading.component.html (26 bytes)
CREATE src/app/loading/loading.component.ts (272 bytes)
```

A note about the `npx` prefix: I need to add this to the command because my `ng` is not installed globally. Using `npx` causes the Angular CLI installed in my project's node_modules folder to be used.

# Component Code
This is the simplest part because there really is no logic to speak of. I am simply creating a visual component with no other behavior.

Inside the file `loading.component.ts`, the generated code looks like this:

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
```

As I said, there is not much here. After the two imports is the `@Component` decorator, which defines how the component will be implemented. `selector` defines the custom component's HTML tag. This is how the component will be placed on a page.

```html
<app-loading></app-loading>
```

The next two lines tell the Angular compiler (and us) where to find the markup and styles for the component, respectively.

Next is the class body itself, consisting of two empty functions. I need neither of those, so will delete them entirely, replacing them with two variables.

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  @Input() label = '';
  @Input() shown = false;
}
```

The `@Input` decorators tell Angular to expose those two variables as attributes on the custom HTML tag.

`label` will be bound to some text in the HTML so that I can tell the user exactly _what_ is loading. If you do not need that, you could eliminate it entirely. 

`shown` allows the host to show or hide the component as necessary. Something like this:

```html
<app-loading label="Loading data now..." [shown]="isLoading">
```

With this example markup, I have hard-coded the loading message, but have bound the `shown` attribute to a variable on the host component. Whenever `isLoading` is true, the loading component will be visible; otherwise it will be hidden. That is all the host needs to be concerned with. How the visibility is implemented inside the loading component is irrelevant to the host.


# Markup
Now let us take a look at the markup. This, too, is pretty simple, almost trivial.

```html
<div class="wrapper" [ngClass]="{hidden: !shown}">
  <img src="/assets/img/loading.gif">
  <h1>Please Wait While We Complete Your Request</h1>
  <p>{{label}}</p>
</div>
```

The component consists of a single `<div>` with a class called `wrapper`. We will see more of that in the next section on styling. Inside this `<div>` are three more elements: 

![Loading image](/assets/img/loading.gif)

1. An `<img>` tag pointing at an animated gif. This is one I am not really happy with. I would prefer to isolate the image so that using this component is a simple matter of dropping it into another project. However, this is not about component reuse. If it were, I would probably encode the image as a BASE-64 string and include it directly in the `<img>` tag itself.
1. A title represented by an `<h1>` tag containing a hard-coded message to the user.
1. The final piece of content is a `<p>` tag with its text bound to the `@Input() label` field on the component. Whatever the host component passes as the `label` attribute will be displayed here.

# Styling
The real magic happens in the component's stylesheet. I will show the entire thing, followed by an explanation of the relevant sections. The stylesheet is SCSS, but it really does not need to be. The code uses no specific SCSS features, and should probably be renamed with the .css extension. I will leave that as an exercise for the reader.

```css
h1 {
  line-height: 30px;
  font-size: 24px;
}

img {
  width: 74px;
  height: 74px;
  display: inline-block;
}

.hidden {
  display: none;
}

.wrapper {
  text-align: center;
  position: absolute;
  z-index: 9000;
  width: 480px;
  height: 326px;
  top: 100px;
  left: 50%;
  margin-left: -215px;
  background-color: #ffffff;
  outline: 9999px solid rgba(217, 217, 217, 0.95); 
  font-weight: 400;
  line-height: 18px;
  padding: 60px 20px 20px 20px;
}
```

## h1
The first rule is for the `<h1>` tag, and it is pretty straightforward. It simply sets the font-size to 30px, and the line-height to a slightly lower value. These values do not materially change the component. They are purely aesthetic and you could change them to reflect your own personal style. One thing of note is that the Loading Component will inherit its host's font selection, whatever that may be.

## img
The image tag, as I mentioned above, is hard-coded to a specific animated gif. The style sheet sets its size to be a 74px square, and sets it to display as an inline-block. Without that rule, CSS would not honor the width and height.

## .hidden
The component's visibility is driven by this class. The wrapping `<div>` either does or does not have this class set, based on the value of the `shown` attribute. 

Why did I not put the `hidden` class on the host and let the host handle it directly? The reason I wanted to use `shown` is so that I could change the visibility implementation at will, without changing any of the host code. 

For example, I could add some CSS animation or implement some other complex code, all without the host components even knowing about it. They would continue to set `[shown]` as they do now.

## .wrapper
This is the big one, so I will show the code again for convenience, explaining it as I go.

```css
.wrapper {
  text-align: center;
  position: absolute;
  z-index: 9000;
```

These first lines are just a bit of setup. They indicate that everything inside the wrapper will be centered, text and images both. The component will be positioned at an absolute position on the screen. The `z-index` of 9000 is a relative position of depth. Elements with larger numbers appear "on top of" or "in front of" elements with a z-index value that is smaller. Setting the loading component's z-index to 9000 gives it a decent likelihood that no other elements will appear in front of it. Should you find that is not the case, set a higher value. Browsers do not seem to have a standard "maximum" value, but most modern browsers should allow values up to 2<sup>31</sup> - 1.

```css
  width: 480px;
  height: 326px;
  top: 100px;
  left: 50%;
  margin-left: -215px;
```

This next block helps to position the loading component. It sets a fixed width and height, and positions the top of the component at 100px from the top of the screen. Then it does something a bit clever. The component's left side is set at 50% of the host's width. Then it sets a negative margin of half the component's width. This effectively causes the entire component to be perfectly centered horizontally inside the host.

```css
  background-color: #ffffff;
  outline: 9999px solid rgba(217, 217, 217, 0.95); 
  font-weight: 400;
  line-height: 18px;
  padding: 60px 20px 20px 20px;
}
```

Finally, you can see some various rules that dictate how the component looks. It has a background color of white, indicated by the value `#ffffff`. 

The clever bit I find is the next line: outline. The component's outline is being defined as a 95% opaque (i.e., 5% transparent) solid gray line 9999px wide. This ends up covering the entire host component with the outline, preventing it from being selectable. 

The last three lines set the text font-weight to 400 (normal), a default line-height of 18px, and some internal padding to provide whitespace.

And that is the entire component!

# Use
I hinted at its use above, but there are three things you would need to use it in your own project.

1. Include the source files.
1. Ensure that the component is declared and exported in whatever Angular module you intend to use it.
1. Supply the HTML markup to call it, which looks like this.

```html
<app-loading [label]="loadingText" [shown]="isLoading"></app-loading>
```

In this sample code, I am using Angular's attribute binding syntax to bind the `label` and `shown` attributes to the host component's `loadingText` and `isLoading` variables, respectfully. Changes to these variables on the host component will cause Angular to re-render the loading component as necessary.

# The Result
When it is all assembled and working on an actual web application, this is what it might look like:

![Loading Component Animation](/assets/img/loading-component.gif)

# Summary
Angular components do not need to be complicated. In fact, sometimes they do not even need any imperative code. In this article I have created a simple Loading Component that can be easily reused anywhere in my application. 

Further, with just a little more effort, I could build a completely standalone component that I could drop into any project I wish.

What do you think? How could this component be improved? Let me know your thoughts.
