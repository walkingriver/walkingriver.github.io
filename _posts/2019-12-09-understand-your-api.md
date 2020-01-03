---
layout: post
title: Consumers and Creators - You Must Understand Your API
date: '2019-12-09'
author: Michael Callaghan
tags: 
- software development
- api
feature: assets/img/source-code.jpg
thumbnail: https://walkingriver.com/assets/img/source-code.jpg
cover_image: https://walkingriver.com/assets/img/source-code.jpg
canonical_url: https://walkingriver.com/understand-your-api/
published: true
---

Whether your are creating or consuming an API, you must understand all of its implications. If you are the consumer, it is up to you to understand what calling its various functions will do. If you are creating an API, you also have a responsibility to your consumers. I will not go into all of the rules here, but will touch on two very severe problems that I have personally experienced in my professional life.

<!--more-->
## Consumer: Know Your API Behavior
This story is a few years old. It is an amusing tale, though it could have been tragic had the code gotten deployed to our production servers. 

A few years ago I was reviewing some .NET code, using LINQ to Entities. I came across a line like the following...

```csharp
var reservations = dataManager.Reservations().ToList().Where(res => res.GuestLastName == lastName);
```

The author's intention, in English was the following...

> "Get me a list of all reservations where the guest's last name matches the last name provided." 

Anyone who has used LINQ to Entities can probably spot the problem immediately. By default, the LINQ to Entities executes as much of the query as it can on the database. However, the `ToList()` call, which is not even necessary, overrides that behavior. It causes the query to be executed immediately and the results serialized into a list. That list is then returned to the method chain, at which point the `Where` clause is executed. 

In English, the actual consequences of this method chain is...

> "Get me a list of all reservations in the database. Once you've returned all of those to me, then filter the list to only those records with a matching last name provided."

As I'm sure you can imagine, asking a hotel reservation system to return all of its reservations, without any
constraints, would return a lot of records. You might think this would be discovered quickly. The developer did not see any issues locally, because the local development database contained only a few dozen reservations. That is a problem worth its own discussion. 

One proper way to write the above query would be...

```csharp
var reservations = dataManager.Reservations().Where(res => res.GuestLastName == lastName);
```

Simply removing the `ToList()` method causes the entire query to be executed on the database. Only the matching records are returned to the caller. Granted, there are still issues to be addressed, and those issues require an understanding of not only the API, but the database schema. 

For example, it probably would not make sense to return all matching records. You may want to limit the number returned to a sizable chunk, and page the rest. It is also possible that the `GuestLastName` column is not indexed properly, which would result in a table scan of potentially millions of records. 

The important thing is that it is up to you, as the API consumer, to know what is really going on. Do not simply and blindly make function calls and hope for the best. You probably do not want to be the one responsible for bringing down your company's production reservations system.

## Creators: Do Not Break Your Consumers
This one happened to me just recently. A web service I had been using for months now suddenly started returning errors instead of valid search results. I discovered this because I always search for myself when searching in our test environment. I type my last name, and my first initial. This is worked as long as I have been using it.

There are exactly two matching results in our database of hundreds of thousands of people, so it is a convenient search for me. This week, however, it started throwing "validation exceptions." Apparently, someone maintaining the web service decided that if you are searching by first and last name, you must include at least two letters for each. I guess that might make sense, to limit the amount of data returned (see above). There are better ways to handle this, though.  

They also changed another search, requiring the zip code to be provided. Again, this was done without warning. Quite frankly, if they need to limit the number of records returned, fine. I have one request: tell your API consumers about it ahead of time! Better still, create a new search method updated with the new validation rules or required parameters, deprecate the existing method, and give your consumers ample time to migrate. This will prevent last-minute system outages as your API consumer applications suddenly stop working, and cannot figure out why code that worked yesterday suddenly stopped working today.

## Summary

If you are consuming an API:
- Know how to use the API.
- Understand what the possible replies might be, and ensure that you do not overwhelm any service that might be behind it.

If you are creating an API:
- Know how your API is used.
- Build your API to protect yourself; do not return responses that are "too big".
- Do not break the interface to your API.

 As I said above, you do not want to be the one bringing down the production systems on a Sunday morning.

