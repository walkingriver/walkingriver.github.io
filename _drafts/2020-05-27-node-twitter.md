---
layout: post
title: Calling the Twitter API from NodeJS
date: '2019-05-28T15:15:00.002-04:00'
author: Michael D. Callaghan
tags: 
- twitter 
- development
- node
layout: post
feature: assets/img/
thumbnail: https://walkingriver.com/assets/img/
cover_image: https://walkingriver.com/assets/img/
canonical_url: https://walkingriver.com/node-twitter/
published: false
---

For some time now I have been wanting to play around with the Twitter API. I have grand visions of writing really cool functions that automatically identify new people to follow based on common interests, follow-back new followers, and even stop following people who are not adding anything to my timeline. Whether or not those things are possible, I am not yet sure. This post chronicles my journey, and you are welcome to follow along. As I write this, I do not know where it will end up, but I am excited by the possibilities.

<!--more-->

The first thing I need to do is figure out a way to communicate with Twitter. I found an npm package called ["Twitter for Node.js"](https://www.npmjs.com/package/twitter) that ostensibly makes that easy to do. It seems to have lots of downloads, but it hasn not been touched in about two years. That either means it is really stable, or it has been abandoned.

To the command prompt, for a quick creation of a new node app, and then installation of that npm package.

```bash
mkdir tweets
cd $_
npm -y init
npm --save install twitter
```

That gets my app started, but apparently I need to register as an application with Twitter. According to the Quick Start, "You will need valid Twitter developer credentials in the form of a set of consumer and access tokens/keys. You can get these [here](https://developer.twitter.com/en/apps)." So that is what I did.

I had to create a developer account, which I did not already have. I told it that I would be exploring the API as a hobbyist. I submitted the application on May 16 at 4:12 PM, and have no idea how long the process will take.

Less than a minute later, I received an email asking me to confirm my email address. That done, I returned to "wait mode."



----

If you have feedback, please follow me and comment on Twitter. I'm [@walkingriver](https://twitter.com/walkingriver).
