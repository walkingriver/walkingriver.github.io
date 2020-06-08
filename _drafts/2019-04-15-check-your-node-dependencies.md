---
layout: post
title: Check Your Node Dependencies at the Door
date: '2020-01-01'
author: Michael D. Callaghan
thumbnail: https://walkingriver.com/assets/img/code.jpg
tags: node,web development,programming
feature: assets/img/code.jpg
cover_image: https://walkingriver.com/assets/img/code.jpg
canonical_url: https://walkingriver.com/check-your-node-dependencies/
published: false
---

On a recent project, I found my code suddenly breaking our automated build. Glancing at the build log, I quickly determined it had nothing to do with the code commit I had just made. As it  turned out, it had been failing in this particular environment for more than a week, and no one seemed to notice. We tend to have minor issues with our build system from time to time, and the error mentioned something about a file that did not exist on the server. I figured I would deal with it later; not my problem. How wrong I was. I decided to document this experience so that others might learn from my folly.

<!--more-->

Fast forward a few days. The build was still breaking, and we needed to deploy. A different team handles all of our builds and deployments, so I reached out to them to find out why their build system was choking on my perfectly fine code. You can almost feel the arrogance dripping from me at this point, right? Being 1000% positive that something is not your fault almost guarantees that it will turn out to be your fault. However, that was not the case here, honest.

The coworker who got back to me was pleasant and helpful. He had looked at the build logs and agreed that something was definitely wrong. There was a file that was choking the build system. The filename had some weird UTF-8 characters that the OS did not like. The file could not be loaded, so the build stopped. He kindly deleted the file and started the build again, and all was well. He suggested that I rename the file, or enable UTF-8. 

That made very little sense to me. How could I enable UTF-8 on _his_ server? Moreover, how did deleting a file cause the build suddenly to work???

The file in question turned out to be not part of my project (see, I told you it was not my fault). Instead, it was buried inside a folder inside my node_modules folder. At that point, I started doing what any other developer would do. I checked the the package to see when it had last changed. Yes, I know that is not what I should have done first, nor is it what any other developer would do. But humor me.

The package had changed recently! Ah hah! It was the package developer's fault! Vindication! Now, just do a quick diff on the versions, see what changed to cause this break, and maybe revert my project to use the version that worked a couple of months ago. 

So I did all of that. The build still broke. What the???

After an entire afternoon blown, I reached out to a trusted colleague on another team, and also on Twitter. The replies I got back were all very similar: Mike, are you sure you even need the package? What does it do? Uh... What a silly question! Of course I need it! Then one person where I work sent me a message. "I found the require statement in index.js and commented it out. All of your unit tests still pass." That project has almost 90% unit test coverage, so it is pretty likely we are not really using it. 

Around the same time, one of my Twitter contacts told me about [depcheck](https://www.npmjs.com/package/depcheck). This handy little npm package is a "tool for analyzing the dependencies in a project to see: how each dependency is used, which dependencies are useless, and which dependencies are missing from package.json." Running this showed me within seconds that the offending npm package that was causing all of my problems was not used at all. It also found four other unused packages. 

The output of depcheck is pretty straight forward. For example, here is a contrived example of running depcheck on a sample node project...

```sh
$ depcheck
Unused dependencies
* xml2js
Unused devDependencies
* grunt
* husky
Missing dependencies
* bluebird: ./src/api-server/core/app-request.js
* request: ./src/api-server/core/app-request.js
* moment: ./src/api-server/core/health-check.js
* qs: ./src/api-server/resources/lookup/lookup.actions.js
```

As you can see, the output is very straightforward. Notice that it also lists any dependencies it thinks are missing. I was surprised to see grunt and husky listed as unused `devDependencies`. I guess it thinks those utilities should be installed globally. That is fine with me. I tend to prefer using `npx` to run CLI tools, and to keep my global npm packages to a minimum. 

If there are no unused dependencies at all, the command outputs nothing and returns a zero exit status. So my next step will be to do something like this, and add it to a git pre-push hook, so I don't have to deal with this problem again. 

```sh
```


