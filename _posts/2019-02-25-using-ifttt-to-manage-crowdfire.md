---
layout: post
title: Using IFTTT to Overcome Crowdfire's Twitter Woes
author: Michael Callaghan
tags: social media,marketing
feature: assets/img/ifttt-01.png
cover_image: https://walkingriver.com/assets/img/ifttt-01.png
canonical_url: https://walkingriver.com/record-video-of-your-android-screen/
comments: true
---
Recently the social media tool Crowdfire had its Twitter API suspended without warning. 
Suddenly its users all over the world had their ability to post curated content to Twitter
completely shut down, leavng them with no good way to automate their social media engagements. 
In this article I will explain how I am using IFTTT to overcome their suspension to let
Crowdfire do its thing, and let me continue to post articles to Twitter.

<!--more-->

## Background
I use [Crowdfire](https://web.crowdfireapp.com) to help with much of my social media. If you aren't familiar with Crowdfire, it bills itself as a tool to manage multiple social media platforms from a single dashboard. Basically, I use it to help me locate, curate, and share articles on the web that I find relevant to my day job as a software developer and to my few thousand Twitter followers.

Crowdfire works by searching the web for articles matching keywords you supply. It provides a daily list of articles that its algorithms match to those keywords. It doesn't post automatically. You select which articles to post and which to ignore. You can block articles from certain websites if you find them totally irrelevant. 

Once you select an article, Crowdfire will then post it to one or more of your social media accounts automatically, either immediately, or on a schedule that Crowdfires labels "at the best time." What that means is that Crowdfire will decide when to post, based on how many posts you tell it to make per day. Each of your social media accounts can have a different schedule, and Crowdfire will manage that for you.

I used Crowdfire successfully to build a modest Twitter following of like-minded software developers. It only took me a few minutes per day to review a dozen or so articles, and share the ones I felt my followers and I would find interesting and useful. It was a great tool, until it wasn't.

## Twitter Suspension
Around the end of January, Twitter suspended Crowdfire's API access with no warning or notice. Despite its numerous appeals, Crowdfire can no longer post content to Twitter. [Crowdfire posted an update on February 7](https://blog.crowdfireapp.com/where-are-the-twitter-manage-features-60edc7dde684) describing what happened and what they are doing about it. For now, nothing has changed, and Crowdfire still cannot post to Twitter. It can still post to other social media sites, such as Facebook and LinkedIn, but for me, nothing beats Twitter for its potential reach and influence. 

As a software developer, my day is spent solving problems. Surely there must be a solution to this one. That's when I remembered [IFTTT](https://ifttt.com/).

## IFTTT to the Rescue
 Web developers tend to think of things in terms of building blocks. The programmable web is a massive collection of these building blocks, assuming you know where to look. [IFTTT](https://ifttt.com/) is a somewhat clumsy acronym that means IF This Then That. It consists of a collection of recipes, each taking the form of "If this event happens on one of your web accounts, then do that other thing." IFTTT still has the ability to post to Twitter, so I thought to myself, "I wonder if IFTTT can watch for my new Facebook posts, and then automatically cross-post them to Twitter?" As it turns out, it can, and it's really easy.

 ## Register and Connect
 The first thing I had to do is register with IFTTT, and connect my social media accounts. Because I was planning to connect it to Facebook, I decided to sign up using my Facebook account. 

  ![Registration](https://walkingriver.com/assets/img/ifttt-02.png)


 Next, I needed to connect my Twitter account, which is [@WalkingRiver](https://twitter.com/walkingriver). 

## New Facebook Page
 After that was done, I needed a place to post my content. I didn't want to burden my family and friends with this stuff, so I created a new public business page, also called WalkingRiver. [It's here if you're interested in seeing it](https://www.facebook.com/WalkingRiver-1263375327144144/). 

## Add an Applet
 Then I experimented with some of the various recipes provided, which IFTTT calls Applets. Some of them worked better than others. The first few I tried didn't work at all, and one was inconsistent. One of them worked too well, so I turned it off. The image below shows the ones I tried (disabled, in gray), and ultimately the one I decided on (in blue), which seems to work perfectly.

 ![My Applets](https://walkingriver.com/assets/img/ifttt-03.png)

 I followed the recipe's configuration, which was simply to point it at my new Facebook page, and have it cross-post every post to Twitter automatically. 
 
 ![Facebook Post](https://walkingriver.com/assets/img/ifttt-04.png)

 The results are shown below. 

## Results
Here is one of my articles I selected in Crowdfire, as it appears on my Facebook page.

 ![Facebook Post](https://walkingriver.com/assets/img/ifttt-05.png)

A few minutes later, IFTTT posted this to Twitter

 ![Facebook Post](https://walkingriver.com/assets/img/ifttt-06.png)

## Conclusion
Using IFTTT solved my immediate problem of using Crowdfire to curate content to my social media followers. 

The only complaint I have at this point is that the link posted to Twitter is a shortened link from IFTTT. For now, I'm satisfied with what I have, especially given the configuration involved. It wasn't too hard to get right, and now I can spend my time reviewing content instead of posting it.
