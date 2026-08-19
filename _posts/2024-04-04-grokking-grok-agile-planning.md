---
layout: post
title: Grokking Grok — Agile Planning
date: "2024-04-04"
author: Michael D. Callaghan
tags:
  - Agile
  - AI
  - Grok
  - Software Development
canonical_url: https://walkingriver.com/grokking-grok-agile-planning
published: true
medium_url: https://walkingriver.medium.com/grokking-grok-agile-planning-2f88ec8772ac
---
Can Grok AI by X help create user stories and estimates? This is a follow-up to my article about [using ChatGPT to help with Agile Planning](https://walkingriver.com/fun-with-chatgpt-agile-planning).

<!--more-->

As I said in the first article, I am not a huge fan of most of the Agile ceremonies, the things I view as "chores" for Agile planning.

Rather than rehash everything I wrote (though there will be some repetitiveness), I'm simply going to jump right in.

My experiment is to challenge Grok with the same prompts and see how well it does. It won't be a head-to-head matchup, though. While I think that would be interesting, I also think it might be tedious. I'll let the two experiments stand on their own.

## A Few Words About Grok vs ChatGPT

Both ChatGPT and Grok offer free tiers. When I ran this experiment in early 2024, Grok required an X Premium Plus subscription (~$167/year). That paywall is gone — Grok is available on a free tier now.

When I ran my experiment with ChatGPT, I was using a Plus subscription, for $20/month, meaning I had access to GPT v4. Grok is also supposed to be GPT v4 or its equivalent, so it should be equally capable.

One huge advantage ChatGPT has over Grok is its uncanny ability to remember context. Grok currently has one chat interface and no way to save or otherwise go back to older conversations. If you refresh your browser, your conversation is gone.

With ChatGPT, I have saved conversations going back more than a year, and I can continue those conversations as if no time at all has passed.

_September 2024 update: Grok now keeps a history of your conversations._

## Project Concept

I started by describing an application to Grok — the demo application from some of my books and video courses.

The application will store and manage the attendance for a single classroom. It will store the names and contact information for the class roster and the students' parents. It will provide a way to add, edit, and remove students, as well as the ability to mark the students absent or present for a given day. The app will run on both desktop web, iOS, and Android. It will also connect to the device's camera to add a photograph of each student.

I gave that description to Grok and asked it "to write a marketing summary for it." Here is its reply (abridged):

Introducing the ultimate classroom attendance management solution! Our innovative app is designed to streamline attendance tracking for a single classroom…

Key features include comprehensive student database, easy roster management, real-time attendance tracking, cross-platform compatibility, and enhanced security.

Beginning with a dry application description, I got a decent description suitable for use as a starting point for a market brochure.

## Epics and User Stories

Next, I asked Grok to use that description to generate epics and user stories. It produced three epics (Home Page, Roster Page, Student Details Page) with nine user stories — more comprehensive than I would have come up with on my own, and good enough to get started planning the project.

## User Acceptance Criteria

I asked Grok to generate user acceptance criteria using "given, when, then" syntax. It handled one of the most tedious tasks in software development. Is it perfect? Not at all. There are features and acceptance criteria I never asked for. That doesn't mean I have to add them — sometimes it just suggested a feature I hadn't considered.

## Estimations

If there is a task most developers dislike more than generating stories and acceptance criteria, it would have to be estimations. I got Grok to manage that using T-Shirt sizing, then Fibonacci values.

Grok's T-shirt estimates were short, sweet, and to the point. Whereas ChatGPT attempted to justify its estimates, Grok did not. I consider this a starting point for team discussion.

## Summary

Like ChatGPT, Grok can be used to write marketing summaries, create agile epics and user stories, generate user acceptance criteria, and provide rough estimates. I've been using this strategy personally and as a result, I'm enjoying the process more than ever before. I find staring at a blank screen to be hard, but I don't mind rephrasing and refining the output Grok gives me for these tasks.

👉 Want more content like this? Get [*P-AI-R Programming*](https://amzn.to/4sD76e6) on [Amazon](https://amzn.to/4sD76e6) or DRM-free on [Gumroad](https://walkingriver.gumroad.com/l/pair-programming-2026).
