---
layout: post
title: What Did Prettier Do to My HTML?
date: '2021-01-06'
author: Michael D. Callaghan
tags: 
- TypeScript
- HTML
- Web Development
layout: post
feature: https://walkingriver.com/assets/img/angular-logo.png
thumbnail: https://walkingriver.com/assets/img/angular-logo.png
cover_image: https://walkingriver.com/assets/img/angular-logo.png
canonical_url: https://walkingriver.com/prettier/
published: false
---

I have been resisting installing and using Prettier for a long time now, mostly because I was happy enough with the job VS Code does formatting my code. Then over the Christmas break, my son convinced me to install it. After I did, he said, "Now open an HTML file and I'll show you something you aren't going to like." Sure, now he tells me! That struck me as ominous, but I decided to go along for the ride.

<!--more-->

We opened an HTML file and immediately reformatted the file using Prettier's default settings. Near the top of the file was a block of HTML rendering an unordered list, representing a navigation menu.

```html
<ul>
  <li>
    <a routerLink="/" (click)="closeSidebarPanel()">Home</a>
  </li>
  <li>
    <a routerLink="/reports/" (click)="closeSidebarPanel()">Reports</a>
  </li>
  <li>
    <a routerLink="/annual-sales/" (click)="closeSidebarPanel()">Annual Sales</a>
  </li>
  <li>
    <a routerLink="/product-maintenance/" (click)="closeSidebarPanel()">Product Maintenance</a>
  </li>
</ul>
```

Notice the last two lines with `<a>` tags are longer than 80 characters, which is Prettier's default maximum line length. During a reformat to wrap those lines, Prettier needs to make a decision on how to do so without semantically affecting the rendered output. The decision most formatters would make might end up with a block of code like this.


```html
<ul>
  <li>
    <a routerLink="/" (click)="closeSidebarPanel()">Home</a>
  </li>
  <li>
    <a routerLink="/reports/" (click)="closeSidebarPanel()">Reports</a>
  </li>
  <li>
    <a routerLink="/annual-sales/" (click)="closeSidebarPanel()">
    Annual Sales</a>
  </li>
  <li>
    <a routerLink="/product-maintenance/" (click)="closeSidebarPanel()">
    Product Maintenance</a>
  </li>
</ul>
```

The problem with this is that the HTML `<a>` tag is an inline-display element, meaning it flows along with the text that's around it. Prettier has no way to know whether or not the whitespace it just added to the beginning of the line is significant or not. It is entirely possible, even likely, that it just inadvertently added an extra space to the menu label.

What does it do instead? Prettier tries to make an intelligent decision on how to wrap and reformat those lines based on an item's CSS display rules. If the element is a block-level element, then adding space around it will not affect its layout at all. On the other hand, if the element is an inline-display element, it will take care not to add any additional whitespace. What it does instead is rather clever. This is the final output.

```html
<ul>
  <li>
    <a routerLink="/" (click)="closeSidebarPanel()">Home</a>
  </li>
  <li>
    <a routerLink="/reports/" (click)="closeSidebarPanel()">Reports</a>
  </li>
  <li>
    <a routerLink="/annual-sales/" (click)="closeSidebarPanel()"
      >Annual Sales</a
    >
  </li>
  <li>
    <a routerLink="/product-maintenance/" (click)="closeSidebarPanel()"
      >Product Maintenance</a
    >
  </li>
</ul>
```

The whitespace inside the tag itself, around its attributes, are never significant. Thus, it adds the wraps the line between the final attribute and the angle bracket that closes the tag. That angle bracket is then placed on the next line (remember, that whitespace is irrelevant), followed immediately by the text of the link itself. The link is then closed, again without any whitespace added to the text.

Why does it do this, though?
```html
    <a routerLink="/product-maintenance/" (click)="closeSidebarPanel()"
      >Product Maintenance</a
    >
```

And not this, which might be more intuitive?
```html
    <a routerLink="/product-maintenance/" (click)="closeSidebarPanel()"
      >Product Maintenance</a>
```

The reason, as I understand it, is Prettier is intentionally placing the closing angle bracket on its own line, vertically lining it up with the tag's opening angle bracket. In this way, it visually appears as a semantic block, exactly the way curly-brace languages line up their braces. Viewed from that perspective, I find it to be both elegant and clever.

My son was right. I did not like it when I first saw it, but with understanding comes appreciation and acceptance. 

I will keep using Prettier, at least for my own projects. Next is getting my team at work to share in my appreciation.

The longer explanation can be found [on the Prettier blog](https://prettier.io/blog/2018/11/07/1.15.0.html){:target="_blank"}.
