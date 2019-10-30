---
layout: post
title: Archive Your Git Repo
date: '2019-03-19T10:56:00.001-04:00'
author: Michael Callaghan
tags: 
- git 
- code
- archive
modified_time: '2019-03-19T10:56:00.001-04:00'
feature: assets/img/github.png
cover_image: https://walkingriver.com/assets/img/github.png
canonical_url: https://walkingriver.com/archive-your-git-repo/
---
Did you know there is a very simple and straightforward command to archive a complete Git repository, while including no historical information? In this brief article I explain both how and why I do it.
<!--more-->

## Why Archive Your Git Repo?
Every few weeks or so, I find myself needing to archive my Git repo. Often I do this to send code to someone who has no reason to access the repo directly. They just need a snapshot of the code, with no history information, because they won't be contributing to it.

I also provide a snapshot of my code for every module in [my Pluralsight courses](https://www.pluralsight.com/authors/michael-callaghan). Being able to archive my Git repo into a zip file is very handy.

For some reason, I can never remember how to do this, and find myself looking it up repeatedly. I decided to write about it here so that I could always find it when I need it. And just maybe it will help someone other than just me.

## How to Do It
If you want to backup a Git repo, completely detaching it from Git, use one of the following variations of the `git archive` command:

### Zip File
```sh
git archive --format zip --output /full/path/to/zipfile.zip master
```

### Tar File:

```sh
git archive master > /some/other/path/my-repo.tar
```


### Tar / Bzip:

```sh
git archive master | bzip2 > my-repo.tar.bz2
```

In each of these cases, the word `master` is the branch I am archiving. You can archive any branch you want, simply by replacing `master` with the name of your desired branch.

Though not strictly necessary, I like to create my archive from the root of my repo, and have my archive created outside of it. 

_Note: The archive will not contain the .git directory, but will contain other hidden git-specific files like .gitignore, .gitattributes, etc._

## Reference

[https://stackoverflow.com/questions/160608/do-a-git-export-like-svn-export]()

