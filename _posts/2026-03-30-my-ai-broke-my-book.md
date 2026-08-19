---
layout: post
title: My AI Broke My Book. And Then AI Fixed It
date: "2026-03-30"
author: Michael D. Callaghan
tags:
  - Artificial Intelligence
  - Writing
  - Git
  - Claude
canonical_url: https://walkingriver.com/my-ai-broke-my-book
published: true
medium_url: https://medium.com/@walkingriver/my-ai-broke-my-book-7fef26bc84d8
---
I'm writing an update to my book P-AI-R Programming about AI-assisted software development. This is the story of something that happened to me during the writing process, an incident that became one of the most compelling arguments for version control I've ever experienced, and a perfect demonstration of what AI pair programming actually looks like in practice.

<!--more-->

I was in the middle of a conversation with Claude Code about restructuring my book. We'd been discussing cross-references between chapters when I mentioned that the first four chapters needed some work.

Claude started exploring the chapter files. That's when it delivered the bad news, matter-of-factly, as AI tends to do:

Chapters 1–4 are empty.

Empty?????

Those chapters had been written. I distinctly remembered writing them. Now they were empty? Four chapters. Over 1,300 lines of polished prose.

Gone.

## The Investigation

Here's where it gets interesting. I didn't have to figure any of this out myself. I asked Claude Code to investigate.

I'm concerned that some unrelated edit might have emptied these files. Can you review the git history and figure out what happened?

Claude got to work. It checked the git log for those files, found the relevant commits, examined the diffs, and pieced together the timeline. Within a couple of minutes, it had the full story.

The culprit was a commit from a week earlier, titled "Renumber chapters sequentially from 01–16 and fix cross-references." This commit was supposed to do one thing: close a numbering gap. I'd intentionally removed some chapters because they needed complete rewrites. That left a gap in the sequence, so the renumbering commit was supposed to slide the later chapters down to fill it.

It did that correctly. But it also emptied chapters 1 through 4.

The commit message never mentioned touching those files. Apparently the AI performing the refactor interpreted its instructions too broadly, deciding that chapters 1–4 were also "gaps" that needed filling. With emptiness.

1,311 lines of polished content, chapters that had each been individually refined in earlier commits, silently deleted as collateral damage from a renumbering operation.

## The Recovery

Claude didn't just diagnose the problem. It told me exactly how to fix it.

The content existed in git history at the commit just before the deletion. Four commands would restore everything:

```bash
git show a615e2e^:chapters/01-the-ai-development-landscape.md > chapters/01-the-ai-development-landscape.md
git show a615e2e^:chapters/02-why-pair-program-with-ai.md > chapters/02-why-pair-program-with-ai.md
git show a615e2e^:chapters/03-how-llms-think.md > chapters/03-how-llms-think.md
git show a615e2e^:chapters/04-choosing-ai-tools-and-models.md > chapters/04-choosing-ai-tools-and-models.md
```

I didn't write those commands. I didn't look up the syntax for `git show` with a commit reference and file path. I didn't have to figure out that `a615e2e^` means "the commit before a615e2e." Claude knew all of that and executed it. All 1,311 lines came back instantly.

But the recovery wasn't done. Those restored chapters had been written before the renumbering, so they were full of cross-references to chapters that no longer existed or had been renumbered. Claude found every stale reference across all four restored chapters plus three others, categorized them, and updated them all. Over twenty edits across seven files, all consistent, all preserving the narrative flow.

The whole process, discovery, investigation, diagnosis, recovery, cleanup, took about fifteen minutes.

## Imagine This Without Git

Now imagine the same scenario without any version control whatsoever.

You're writing something substantial — a book, a large codebase, documentation. An editing session goes wrong. Maybe you accidentally overwrite files, maybe a sync conflict destroys content, maybe a collaborator makes changes they shouldn't have. The content is gone.

What do you do? Check the recycle bin? Hope Google Docs kept a version you can find? Try to rewrite 1,300 lines from memory?

Without git, this would have been a disaster. Not a "spend an afternoon fixing it" problem, but a "lose weeks of polished writing" catastrophe. The content existed nowhere else. No backup. No printout. No email draft. Just the files on disk, which were empty.

Git made the content recoverable. Every version of every file, preserved forever. The safety net that catches you when things go wrong, even when the thing that went wrong happened a week ago and you didn't notice until today.

This is why I write my books in Markdown in VS Code.

## Imagine This Without AI

Now imagine the same scenario with git but without an AI pair programming partner.

The content is recoverable; git has it. But do you know how to get it back? The commands you'd need aren't the everyday git commands. `git add`, `git commit`, `git push` — those are muscle memory. But `git show ^: `? `git log --all --oneline -- `? `git show --stat`? These are the commands you Google when you need them, read a Stack Overflow answer three times, and then pray you're typing them correctly.

Here's the investigation I would have had to do manually:

1. Figure out which commit emptied the files. That means running `git log` on each file, reading through commit messages, and identifying the suspicious one. With twenty-plus commits to examine, this alone could take thirty minutes.
2. Verify that the commit actually caused the damage by examining the diff. That means running `git show -- ` for each file and reading the output. Another fifteen minutes.
3. Figure out the right way to restore the content. Do you checkout the file from a previous commit? Use `git show` to extract it? Revert the commit? Each approach has different implications. Easy to get wrong. Twenty minutes of reading documentation.
4. Execute the restore commands, one per file, verifying each worked. Ten minutes if nothing goes wrong.
5. Find and update stale cross-references across seven files. Thirty to sixty minutes of tedious searching and careful editing.

Total: two to three hours of focused work, requiring intermediate git expertise and careful attention to detail. Every step is an opportunity for a new mistake.

With Claude, the same recovery took fifteen minutes. I described the problem in plain English. Claude investigated, diagnosed, recovered, and cleaned up. I reviewed the changes. Done.

That's not a marginal improvement. That's the difference between a stressful afternoon and a brief interruption.

## The Delicious Irony

An AI caused the problem and a different AI session fixed it. The renumbering commit that emptied my chapters was generated by an AI assistant. It performed the renumbering correctly but interpreted its instructions too broadly and deleted content it shouldn't have touched. The commit message didn't mention the deletion because the AI didn't think it was doing anything wrong.

This is what I call the deceptive accuracy problem, playing out in real time on my own project. The AI produced output that looked correct, a clean commit with a reasonable message — while silently causing damage. I approved the commit without catching the issue because the message described exactly what I'd asked for.

It's a reminder that AI is a powerful partner, but you're still responsible for what ships. I should have reviewed the diff more carefully. I should have noticed that four files showed deletions in a commit that was only supposed to rename files.

## The Lessons

**Git is not optional.** If you're working on anything you can't afford to lose: code, prose, configuration, documentation — that belongs in version control. Git caught a mistake that no other safety net would have caught, a week after it happened.

**AI makes git accessible.** The commands I needed weren't obscure, but they weren't common either. Claude bridged the gap instantly. I described what I needed in plain English, and it translated that into the right git commands. No Stack Overflow. No man pages. No trial and error.

**Review AI-generated changes carefully.** AI refactoring operations that touch many files deserve extra scrutiny. A commit that claims to "renumber chapters" shouldn't be deleting content. If the diff shows unexpected deletions, investigate before approving. Trust but verify…always.

**Commit often with clear messages.** The investigation was possible because each chapter had been polished in its own commit with a descriptive message. "Polish Chapter 1: Convert bullet lists to narrative, add real stories" told Claude exactly what that commit contained. If all those changes had been lumped into "updates," piecing together the timeline would have been much harder.

**AI pair programming compounds.** This story illustrates the full cycle: AI edits content, AI breaks content, AI discovers the break, AI recovers the content, AI cleans up the aftermath. Each step was faster and more reliable than doing it manually. The pair programming advantage isn't just about writing code faster; it's about everything around the code too.

This story became a chapter in my book [*P-AI-R Programming*](https://amzn.to/4sD76e6), which is being updated now. If you're curious about AI pair programming — the real workflows, honest limitations, and practical examples — the book covers everything from configuring your tools to scaling AI across teams. Available as DRM-free ePub and PDF on [Gumroad](https://walkingriver.gumroad.com/l/pair-programming-2026), or on [Amazon](https://amzn.to/4sD76e6) for Kindle and paperback.
