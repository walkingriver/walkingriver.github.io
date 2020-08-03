---
layout: post
title: Hybrid Mobile Development at Disney
date: '2020-07-20'
author: Michael D. Callaghan
tags: 
- ionic 
- disney
- mobile
layout: post
feature: assets/img/2020-07-16-12-54-43.png
thumbnail: https://walkingriver.com/assets/img/2020-07-16-12-54-43.png
cover_image: https://walkingriver.com/assets/img/2020-07-16-12-54-43.png
canonical_url: https://walkingriver.com/hybrid-mobile-at-disney
published: true
---

One hot summer day, my team received a somewhat frantic email. Due to some hardware support issues, a very large and visible part of our business was at risk of being shut down. They wanted to know what we could do about it. This post will provide some of our challenges, and the solution we ultimately provided, to keep the business running.

<!--more-->

# What is Disney's Magical Express?

![Disney's Magical Express](/assets/img/2020-07-16-12-54-43.png)

Disney's Magical Express is a service offered to Guests staying at a Walt Disney World Resort. It provides "complimentary motorcoach transportation between Orlando International Airport and select Walt Disney World Resort hotels—featuring complimentary luggage delivery." If you ever visited Walt Disney World, you may be familiar with how it works. A few weeks before your trip. you will receive some bar-coded luggage tags in the mail. You simply affix these tags to your bags, and check them at the airport as you normally would before your departing flight.

![Magical Express Luggage Tags](/assets/img/2020-07-16-13-00-23.png)

The magic happens when you arrive at Orlando International Airport. When your flight lands, rather than retrieving your luggage at baggage claim, you and your family can head straight to Disney's Magical Express Welcome Center in Terminal B, where you will board a luxury motorcoach for a comfortable ride to your resort. Soon after your arrival, your luggage will be delivered to your room. 

![Disney's Magical Express Airport Check-in](/assets/img/2020-07-16-13-00-37.png) ![Disney's Magical Express motorcoach interior](/assets/img/2020-07-16-13-01-03.png)

# The Magic Behind the Magic
Have you ever considered how Disney keeps track of your luggage and manages to get it to you in a timely manner? It is a large task; one that is solved by technology. When a flight lands at Orlando International, all bags bearing the Disney luggage tags are removed from the airplane and sent to a remote sorting facility. They never even enter the airport. The bags are sorted into groups based on their destinations. From there they are sent to the appropriate resort hotels. Here they are further sorted and delivered to each Guest's room.

At each step of this process, that barcode on the luggage tag is scanned and sent into a database, so that Disney knows exactly where your bags are at all times. The barcode contains no private information. It is simply a number that the system can use internally to correlate to your reservation. This lets the resort Cast Members know to which room each bag should be delivered.

Simple and straightforward, until it suddenly was not.

# Looming Hardware Failure
On that fateful summer day, we were told that the handheld scanners used by Disney's Magical Express were no longer supported by the manufacturer. After a pending upgrade to the airport's WiFi, they would stop working entirely. We were asked to solve the problem before the WiFi upgrade was to occur.

# Android or iOS?

![Android barcode scanner](/assets/img/2020-07-16-12-57-07.png) ![iPhone](/assets/img/2020-07-16-12-57-14.png) ![iPhone with case](/assets/img/2020-07-16-12-57-22.png)

Our first question back to the business was what type of hardware they had in mind for the replacement. They were looking at three potential options: an Android device that was specifically designed to work in an unforgiving warehouse environment, an iPhone, or possibly an iPod Touch. The Disney Resorts already had some success with using iPhones, and they were not comfortable with the idea of their Cast carrying multiple devices. However, the managers in the sorting facility were concerned that iPhones and iPod Touch devices would not be resilient enough for their operation. Could we possibly support both?

# Why Not Both?
Our immediate response was that supporting both Android and iOS would most likely double the development cost, the development time, or possibly both. Not surprisingly, they were not thrilled by that news. The timeline was somewhat fixed. The devices would stop working once that WiFi upgrade happened, and nothing we could do would delay that. Our choice came down to forcing the business to pick a single platform, or spinning up two teams to build two separate applications.

## What About Mobile Web?
Some members of the team suggested that we simply build a mobile-friendly web site. After all, HTML5 can support a device's camera. We could develop and deploy a simple web application that would get the image of the barcode from any device with a supported browser, and send it to a remote web service to extract its data. This turned out not to be as simple as it first appeared. 

1. Creating a service to decode a barcode from a JPEG image is not trivial.
2. The time to send an image to a remote web service is not huge, but it is also not instant. 
3. The business would not be using the device's camera, but a custom hardware barcode scanner. This was the real deal breaker for us.

We were forced to rethink our approach.

## Ionic Framework for the Win
Fortunately, I recently had some success building a small hybrid mobile application using the Ionic Framework. With Ionic, development is done with standard web skills: HTML, CSS, and JavaScript. Ionic had also made an early architectural decision to support Angular. We had lots of Angular developers on our team. 

![Ionic Framework UI](/assets/img/2020-07-16-12-57-56.png)

Ionic does the heavy lifting of interacting with the hardware and providing a host for the web application code to run directly on the device (as opposed to a remote web server). It also provides a very "native look and feel" on both Android and iOS devices, intelligently choosing the appropriate method based on the device the application is running on.

The only stumbling block would be that custom barcode scanner. Could Ionic support it?

![iPhone barcode scanner](/assets/img/2020-07-16-12-58-57.png)

I emailed our technical support contact for the company who makes the scanner with a simple question: "Have any of your customers ever used Ionic with your scanners?" His reply was something to the effect of, "Never heard of Ionic. But if you can use Cordova, I have a plugin you can try."

Cordova is an open source framework that allows mobile web application code written in JavaScript to talk to physical device hardware through various plugins. The fact that our scanner manufacturer had a plugin for their scanner was welcome news, even if they had never heard of Ionic.

Better news, at the time of our project, Ionic used Cordova as its hardware compatibility layer. All the pieces were coming together.

## Proof of Concept
Over the next few hours, I downloaded the Cordova plugin for the scanner hardware and created a small proof of concept application. It was not pretty. It simply registered a handler for the scanner's "onScan" event, and displayed the provided bar code details in JSON format on the browser. The next day, I was able to get one our test iPhones and one of the scanners, and had a fully-functional demo to show the business. 

![Soda can](/assets/img/2020-07-16-12-59-36.png) ![Tissue box](/assets/img/2020-07-16-12-59-24.png) ![QR Code](/assets/img/2020-07-16-12-59-42.png)

It could read and decode any common bar code I tried: a soda can, a box of tissues, a QR code for a website, the serial number of the phone in the conference room. Even better, it scanned and decoded each in less than 200ms. If you have ever used the phone's camera to read bar codes, you will certainly agree that this is much faster. The last test was ensuring it could decode the bar codes on the luggage tags. It passed that test with flying colors.

![Disney's Magical Express luggage tag](/assets/img/2020-07-16-13-00-05.png)

# Ionic Development Experience
With the proof of concept successfully completed, we officially made the decision to use Ionic. A small team of about six Angular developers was assembled and we started putting together some prototype web pages. Development was done with standard web servers to begin with. Throughout most of our first iteration, we still had no idea which device would be selected. But it did not matter, as we were confident we could support both. 

## Minimum Viable Product
Over the next few iterations, we worked closely with our business partners to ensure that the most critical features were developed first, followed by the next most critical, etc. We knew we had to scan the barcodes and get them into the existing back-end services, so that was where we focused our efforts. 

## Theme Customization
At the same time, we also engaged our UI design team for their input on styling and theming. Because this application would be considered "Guest Visible," it had to follow certain visual guidelines. Application screens needed to use specific fonts and colors. Ionic made such style and theme customization easy, simply by overriding some settings. 

## Offline Support
As development continued, we ran scanning tests at remote parts of the Walt Disney World Resorts, to ensure a stable network connection. It became apparently pretty quickly that we would not be able to rely on strong WiFi everywhere. We needed to store scans on the device when no network is available. Then when the network was again available, the device would send the scan data to the rest of the system. Again, Ionic made that easy to implement using their Storage libraries. 

## Automated Builds
Because Ionic apps are simply web apps with a slight configuration change, integrating the builds into our existing process was reasonably straightforward. Ionic can be built through a series of CLI commands which are easy to wrap into npm scripts. Commits to our Git repository automatically deployed the Ionic app to the appropriate servers, and then the mobile devices received the updates minutes later. 

## Device Decision
Throughout development and early testing, we tested on the iPhones and scanning devices we had been provided. Eventually the decision was finally made on which device (or devices) would be used. As you may know, iPhones are not the most durable devices, and no custom hardened versions are available. We assumed the airport personnel would end up using hardened Androids, and the Resorts would use their existing iPhones. 

It turned out that the company supplying the barcode scanner had a product specifically designed for our type of use. Imagine an Otter Box with an extra battery and built-in hardware barcode scanner. An iPhone can be inserted into this product and locked in place. Once installed in this manner, the iPhone was just as durable as the more-expensive custom Android model they had been considering. The extra battery meant that it could be used continuously all day without needing to be recharged.

![Hardened iPhone case with barcode scanner](/assets/img/2020-07-16-12-55-54.png)

In the end, it was decided that everyone would use iPhones. The barcode scanner added some bulk to the devices used at the Resorts, but this was considered a better solution than asking our Cast to carry multiple devices. 

So while we ultimately chose a single platform (iOS), we are not locked into that decision. With a minor configuration change, we could easily support Android devices in just a few days. Selecting Ionic Framework is what makes that possible.

# Ionic for Your Next Application
Since that time, Ionic has grown and matured. Version 2 discarded AngularJS in favor of Angular 2 and TypeScript. Version 3 introduced some improved styling and design paradigms, along with [Capacitor](https://capacitorjs.com), a new and improved hardware compatibility layer. And it has only gotten better.

## Any Framework
As of version 4, Ionic is no longer tied to Angular, or any particular framework for that matter. They recently shipped an official library supporting React, and will soon release support for Vue.

## Any Platform
Likewise, Ionic is all about the web, and every platform the web supports is supported by Ionic. Whether you want to build an Android app for the Play Store, an iPhone app for the Apple App Store, a Progressive Web App to host on a web server, or even a desktop application using Electron, Ionic provides a compatible solution. 

<!--Add information about Ionic 5? https://ionicframework.com/blog/announcing-ionic-5/ -->

# Conclusion
What began as a potential disaster went on to become a successful product roll-out. We finished ahead of schedule and under budget. I ran into one of the business managers from Disney's Magical Express at a technical showcase more than a year after our product release. She said that the application was still going strong, with no major issues discovered. "The app just works." She further shared that ours was one of the smoothest projects of which she had ever been a part. 
