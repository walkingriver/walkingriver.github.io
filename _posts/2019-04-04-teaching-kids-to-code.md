---
layout: post
title: Teaching Kids to Code
date: '2019-04-03T10:56:00.001-04:00'
author: Michael D. Callaghan
tags: 
- learning 
- teaching
- coding
feature: assets/img/laptop-boy.jpg
thumbnail: https://walkingriver.com/assets/img/laptop-boy.jpg
cover_image: https://walkingriver.com/assets/img/laptop-boy.jpg
canonical_url: https://walkingriver.com/teaching-kids-to-code/
published: true
---

When my oldest son was 11 years old, I hired him to work on an ASP.NET project with me. It wasn't anything I had planned to do, but I had some monotonous layout work and he was eager to help. As it turned out, he had quite the knack for it. At 15, he got his first "real" job maintaining an existing ASP.NET site for a friend of mine. Today, he is finishing a degree in Software Engineering while doing a paid internship building apps for a financial services company.  In this article, I will try to document the experience, and hopefully identify some reusable patterns for teaching others. 
<!--more-->

## Background
Like most kids born in the past 20 years or so, my son had always shown a tremendous affinity for computers. As early as 4-years-old, when visiting family during the holidays, he would often be asked to install software for them. Some of the first words he ever recognized were `Start`, `OK`, and `Cancel`.

## From Web Controls to SQL Queries
In the spring of 2006, a friend and I had been sub-contracted to create a website for a small company in Concord, NH. It was going to be a moderately large site with a big SQL Server back-end. The contractor on the project was a SQL Server guru with no front-end coding experience.  

After some consideration, we decided to write it in ASP.NET Web Forms, with the new-fangled [Ajax Control Toolkit](http://www.ajaxtoolkit.net/) from Microsoft. We figured the three of us could complete the entire project in about six months, negotiated a rate, and got started.

Sometime in early Summer, as the UI was nearing completion, the client asked whether we would be willing to enhance each date-related text box in the entire app with a [calendar control](http://www.ajaxtoolkit.net/Calendar/Calendar.aspx). This would provide the now-common ability of having a calendar appear automatically to select a date, instead of making the user type it by hand.

The process of adding the calendar control was simple: drag the control icon from a visual toolbox onto the web form design surface, and then add the text box's control ID to the calendar control, linking them together. It wasn't hard, but it would be tedious. There were dozens of these fields scattered throughout the many pages of the app. It seemed silly to charge the client our rate for a few hours of drag-n-drop work.

On a whim, I asked my son if he'd be interested in making a few dollars. He asked how much and what he would be doing. I offered him $10/hour, and figured I'd bill the client no more than one hour total, regardless of how long it took him. He agreed, so I then showed him how do add the calendar control to a text box, and explained which text boxes needed it. Off he went.

A couple of hours later, he declared himself finished, and proceeded to show me his work. It was flawless and complete. He then asked, "Ok, what next?"

Throughout the summer, I proceeded to give him more and more work to do, mostly cleaning up the UI layout, ensuring that styles were consistent from page to page, and other minor things like that.

One day he asked if he could try to create a page from scratch. I had a minor page that we were only going to do if we had time, so I turned him loose on it. It had a Data Grid control on it that simply reflected the values in a table from the database.

The control did most of the work. It simply needed to know the name of the database, the table to be displayed, and which values from each table record. He had the other pages to use as an example, including another page that already had one of these Data Grid controls on it. 

While he was working on it, he wanted to know a little more about how it worked behind the scenes. So I showed him how the grid was connected to a Data Control. Then how the Data Control was connected to a database and table, its columns, and how to specify search and sort options. That turned into a discussion on basic SQL syntax. Nothing more interesting than `SELECT * FROM Customers` type of stuff. He seemed to understand it, and then went back to work.  

After he was finished, he came to me and declared to me that he had improved it. He asked me if I knew that it was also possible to add inline-editing and deleting to the Data Grid control. All you have to do, he explained, is provide the appropriate SQL `UPDATE` and `DELETE` statements. He was very excited, and showed me a fully-working editable data grid.

I was impressed by his grasp of the underlying concepts and initiative. However, it did lead to a discussion of the dangers of "feature creep."

## Where's my LINQ book?

<a href="https://www.amazon.com/LINQ-Pocket-Reference-Implement-Applications-ebook/dp/B00CKYWZES/ref=as_li_ss_il?keywords=linq+pocket&qid=1554289444&s=gateway&sr=8-1&linkCode=li2&tag=walkingriver-20&linkId=325df55c6962f4db8ffc5146f6ef8889&language=en_US" target="_blank"><img align="left" border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00CKYWZES&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=walkingriver-20&language=en_US" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=walkingriver-20&language=en_US&l=li2&o=1&a=B00CKYWZES" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
Back in 2006, when big bookstores were still a thing, I used to spend a lot of time in the Barnes and Noble in Nashua, NH, browsing their computer books. One day I came across [LINQ Pocket Reference](https://amzn.to/2I5gDIp). I had heard of LINQ and love the style and conciseness of the O'Reilly pocket references. I bought a copy and brought it home.

As I often do, I forgot about the book for a few days. It sat on the side of my desk, untouched. Then one day, I needed to look something up but the book wasn't there anymore. In fact, a couple of my books were missing: the LINQ book and another one on C#. I searched the usual places in the house where I might leave a book, but couldn't find it. 

When my son got home from school, I asked him if he'd seen them. He had them both. He had seen them sitting on my desk, thought they looked interesting, and decided to read them. "Did you?" I asked. "Yes," he replied. "Did you understand them?" He claimed he did, so I asked him to explain a lambda expression to me. 

## What's a Lambda Expression?
One of the struggles I had with LINQ at the time was the concept of lambda expressions. For some reason, it took me a long time to internalize the idea of passing a function into another function. Lambda expressions complicated that by passing the entire function, unnamed, as a parameter. And calling them "lambda expressions" didn't help. 

So I asked him to explain something to me. Imagine you have a list of Customers, and you want to filter that list to only those whose first name is 'Mike', sorted by their last name.

He thought a moment and came up with this:

```csharp
var results = Customers
  .Where(x=>x.FirstName=="Mike")
  .OrderBy(x=>x.LastName);
```

Then he went a step further, and told me, "You could also sort it by something that isn't even part of the object itself." To explain, he provided this example for me.

```csharp
var rand = new Random();
var shuffled = Cards.OrderBy(x=>rand.Next(52));
```

"See?" he said proudly, "If you sort by a random value, you can shuffle the results." 

So I guess he understood lambda expressions. 

## A Credit Card and an Eagle Scout
Over the next few years, I continued to pay my son for his time, whenever I had work I thought he could handle. That work got more and more complex as his experience and understanding grew. 

When he was 15 years old, a former colleague of mine, the CEO of a small telecom firm, offered me a full-time job with his company. He needed someone to maintain and improve the application I had built for him over the prior two years. 

As it happens, I had just accepted a full-time position with another company. Disappointed, he asked me whether I knew anyone else who could handle some of the work. Hesitantly, I asked him if he would consider giving my son a try. I gave him much of the background outlined in this post, and assured him there would be no hard feelings if things didn't work out. 

He knew my son was a straight-A student in his High School, and was actively working on his Boy Scout Eagle Rank. Being a former Scout leader himself, he knew how much work and dedication it took to become an Eagle Scout. Agreeing to give it a shot, he offered him $20/hour to maintain the application UI, an ASP.NET MVC 2 app tied to a SQL Server database.

The work he performed was lauded by the CEO, who continued to tell the story to anyone who would listen. At a trade show a few years later, someone asked him what it took to create the application. The CEO smiled and said, "We built it part-time with a credit card and an Eagle Scout!"

## Software Lead and DevOps Engineer
Over the next few years, throughout high school, my son continued working on the web app, branching out to the company's other applications. Eventually, he became the company's lead developer. 

He was responsible for creating a massive automated test suite, a multi-headed Jenkins DevOps system; updating the application's data layer; and implementing Azure-hosted apps implemented in NodeJS and .NET Core. 

He's become quite adept in multiple software development disciplines, including mobile development. He has apps on Apple's, Google's, and Amazon's app stores. Recently, he deployed a Progressive Web App onto Google's Firebase. 

## Software Engineering Major
Today my son is a Software Engineering major, working on a Bachelor's Degree. His 10+ years of paid software development experience helped him land a paid internship at a financial services company. When he leaves the university in a year or so, he'll do so with no student loan debt, and a comfortable amount of savings with which to start his adult life. I'm sure he'll have no trouble finding a full-time job. It all started with a visual design tool, some spare time, and a little curiosity. 

## Can this scale?
My goal in writing this post was to try to identify specific things that I did, which might be able to be replicated with other kids in the future. 

I tried repeating the process with my other two children. They have thus far shown no interest in following in their brother's footsteps. That's fine, as I don't want to push them. 

What about other youth in my sphere of influence who do want to learn? More importantly, is there anything that others may be able to apply to youth?  What would it take to help other kids along, the way I did with my son? Some things that stand out to me, which may be applicable to others:

- Recognize the desire. If a child expresses interest in any aspect of what you do, encourage it. Help them out by offering a small task for them to do. See how they handle it. Help them through their struggles.
- Start early. Had you asked me at the time, I would have said 11 years old is probably too young. Obviously, I would have been wrong.
- Use books. Yes, they still exist. Offer to lend them books on whatever subject they are interested in. 
- Give them a chance. It's easier to learn new things when you have a real project to work on. If my CEO colleague hadn't given my son a chance, his interest might have waned and fizzled out while he was still in high school. 
- Even when they fail, continue to encourage. My son messed up a lot in those early months. He learned, fixed the problems, and improved.

What else can you think of? What types of things have you done to help teach and encourage youth in software development, or any other type of endeavor? I'd love to hear from you on Twitter with your own stories. I'm @walkingriver.

<hr/>

_All images used are royalty free from [Pixabay.com](//:www.pixabay.com)_
