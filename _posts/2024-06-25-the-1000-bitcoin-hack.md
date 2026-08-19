---
layout: post
title: The $1000 Bitcoin Hack
date: "2024-06-25"
author: Michael D. Callaghan
tags:
  - Bitcoin
  - Security
  - Scam
  - PayPal
  - Coinbase
canonical_url: https://walkingriver.com/the-1000-bitcoin-hack
published: true
medium_url: https://medium.com/thecapital/the-1000-bitcoin-scam-6ac9ce183515
---

I woke up one morning to find a notification on my phone that said my $1000 Bitcoin purchase was successful. The timestamp was approximately 3:40 AM. I thought maybe I had set up an automatic purchase or something. That didn't make sense, though. I don't have $1000 sitting around I can simply blow on a Bitcoin gamble. Something else must have happened.

<!--more-->

I logged onto my Coinbase account. From what I was able to determine, someone got into my Coinbase account overnight, bought $1000 in Bitcoin, and then attempted to transfer the Bitcoin to someone else. Fortunately, Coinbase does not allow transfers out that quickly, so the transfer failed.

I managed to cancel the transfer request and lock my account, but the Bitcoin purchase was made, even though I had no money in the account.

As it happens, PayPal was set up as my funding source for Coinbase. So, the $1000 came from there. I don't keep large sums of money in PayPal, so they turned to my PayPal backup source, which is my personal bank account. As of that morning, my bank had no record of the transfer, but PayPal said it was complete.

I immediately disputed the transfer with PayPal, but they closed the case within minutes.

"Based on our review, we found this transaction is consistent with your PayPal history."

The reality is quite the opposite. I never make large purchases of this nature with PayPal.

I then contacted my bank via email because they weren't open yet. Their reply that afternoon was less than helpful. They said there was no record of a transfer attempt from PayPal, but if one did show up, I could dispute it at that time. Gee, thanks.

I removed my bank as a PayPal funding source and then removed PayPal as a Coinbase funding source. As an added measure, I transferred all the money from the account PayPal was linked to, figuring that an overdraft fee would be better than losing $1000.

That afternoon, the story got weirder. On a whim, I decided to review the Safari browsing history on my MacBook. What I found surprised, frightened, and enraged me. It showed that sometime that morning, around 3:30 AM local time, someone using my browser visited a collection of different financial sites. Some of them, I have never logged into or even heard of.

I logged back into Coinbase to see if it had any other activity. As it turns out, it did. My activity logs there showed a sign-in from my WiFi router's public IP address at approximately 3:30 AM. That aligns with my browser history.

That strongly implied that someone managed to get access to my Mac remotely. They unsuccessfully tried several financial sites before successfully accessing Coinbase.

Continuing to dig a little deeper, I also found a rogue administrator account on the laptop that I had never seen before. I immediately deleted it, though I should have simply disabled it so I could investigate even more. Oh well. Hindsight is 20/20, you know.

I made the immediate decision to reimage the Mac from scratch as soon as I could. At that point, I also changed my account password and thought it would be prudent to take it off the network entirely, maybe even shut it down.

Thinking on this more deeply later in the day, something suddenly occurred to me. The week before all this happened, I had been experimenting with remote access to my Mac from work. I had opened some ports on my home router's firewall, forwarding them to the MacBook.

From what I have since been able to determine, I had left those ports open and forwarded them from my router. Somehow, someone must have found them and managed to remote into my Mac overnight. They launched Safari, which knows a lot of my passwords.

It was the Coinbase activity log showing the connection from my router's public IP address that started me down this line of thinking.

As you can imagine, I immediately closed those ports on my router. I spent the remainder of that evening changing all my financial passwords, my router password, etc. Then, as I indicated before, I completely erased my Mac's hard drive and reinstalled the OS from scratch.

The drama is still not over. The next morning, my bank dutifully completed the PayPal transfer, even after I had contacted them and warned them about everything. There was no money in the account, so they helpfully transferred in enough from my savings account to cover it, and then let PayPal take it all. I complained to them immediately, officially disputing the transfer, but I didn't expect anything to come of it.

Coinbase sent me an email overnight saying that due to potential security issues, I'll be prevented from withdrawing any money for about a week. So helpful.

My current plan is to wait only that long, sell all my holdings, and close both Coinbase and PayPal accounts.

I'm also going to stop using any financial company that still uses SMS for two-factor authentication. Whoever got into my Mac was able to see all my texts as they came in because my Mac displays all my messages. In retrospect, that's like not having two-factor authentication at all. Worse, maybe, because it leads to a false sense of security.

Why am I putting this here? I hope that someone will see my foolishness and not make the same mistake. Change your passwords. Don't reuse them. Don't store them in your browser. Don't assume that SMS-based two-factor authentication is safe.

I will continue to update this post as things occur. Hopefully, the worst is behind me.

The good news is that Bitcoin was up 5% today, so that's something.

## 5 July 2024 Update

While waiting for my account to be unfrozen so I can withdraw my funds, Bitcoin is down about 10% from where it was purchased, so I'm out $100 at this point.

## 8 July 2024 Update

I'm pleased to say that my bank came through for me. They accepted my explanation and pulled back the $795 transfer from PayPal. The problem is, PayPal had no money to give back because they had sent it to Coinbase. This is from the email they sent me.

> Your bank has let us know that you filed a claim for unauthorized use for the payment below. As a result, the money for this transaction was returned to your bank account.

Their response was to pull back the money from Coinbase but lock my account, with the following explanation:

> We saw some activity on your account that didn't match your usual activity. We're concerned someone may be trying to use your account without your permission. Don't worry. To help keep your account safe, we've temporarily limited some of your account features.

I wish they had done this before sending any money to Coinbase in the first place, but at least we're getting somewhere.

As you might imagine, my Coinbase account didn't have the cash, either. It was all tied up in Bitcoin. I got a nasty email from Coinbase telling me that my account was overdrawn to the tune of $1000.

> [Y]ou attempted a transfer of $1,000.00 USD. Unfortunately, the transfer failed due to either a lack of funds or a technical problem with the transfer itself. Because you were credited $1,000.00 USD on June 24, 2024, this has resulted in a balance owed to Coinbase. We've placed a temporary hold on your account until this negative balance is resolved.

Again, I wish they had been this diligent on the initial purchase. From this email, I concluded that I needed to a) give them $1000 or b) sell some assets to make up the difference. As I said above, Bitcoin happened to be down around 10% since this all started, so I was wondering how long I'd have to make up the difference.

Apparently, the answer was "no time whatsoever." Literally seconds after the prior email from Coinbase, I received this one.

> Thank you for submitting payment for your recently failed transfer or purchase. Your account will remain on hold until the payment has been completed, and standard processing times apply.

Coinbase didn't wait. They simply liquidated $1000 worth of Bitcoin at the current price, which was a net loss to me.

## 23 July Update

My Coinbase/PayPal/Bitcoin nightmare is almost over. Coinbase finally released my frozen funds. I just withdrew the last of it, confirmed that the transfer is complete, and closed my account.

Where do I go from here? It appears that the only person negatively affected by all this was me. In retrospect, this shouldn't come as a surprise. The big financial companies are going to protect themselves at all costs. Protecting their customer seems to be a secondary concern.

As I said before, I've disconnected all my financial institutions from each other. As soon as my PayPal and Coinbase accounts are unfrozen, I plan to liquidate and close them. I'll keep my bank, as they have had my back for nearly 30 years.

I heard a similar story with a large US Bank and PayPal. The customer had a fraudulent payment through PayPal, which was attached to their bank's checking account. The difference in that person's case was that the big US Bank essentially said, "Too bad; not our problem," and the customer was simply out the money.
