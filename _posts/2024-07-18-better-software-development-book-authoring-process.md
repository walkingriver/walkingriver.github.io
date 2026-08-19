---
layout: post
title: A Better \"Software Development\" Book Authoring Process
date: "2024-07-18"
author: Michael D. Callaghan
tags:
  - Writing
  - Software Development
  - Books
canonical_url: https://walkingriver.com/better-software-development-book-authoring-process
published: true
medium_url: https://www.linkedin.com/pulse/better-software-development-book-authoring-process-callaghan-uc0se
---
When I began rewriting *Angular Advocate* (now *Angular for Business*), preparing it to be my first traditionally-published book, I saw a chance to streamline my writing and editing process. Through trial and error, I came up with some optimizations that not only made my work easier but also more enjoyable.

<!--more-->

## Blending Coding and Writing

When I wrote all of my other books, I wrote them in Microsoft Word. It was a familiar process, fitting for most authors. Amazon prefers it, so it was the default choice. But as I continued to write about software development, I realized the limitations of Word in my workflow. Have you ever tried to format a code block in Word? It's challenging, to be kind. I needed a tool that could accommodate both my coding examples and writing in a way that Word couldn't.

I wrote the entire book in VS Code using Markdown, one file per chapter. The demo code is already in VS Code, of course. Further, both the book and the demo are in the same Git repository. This approach gives me source control and less context switching. I found it to be a seamless way to integrate coding and writing, creating a unified workspace that enhances my creative flow.

The switch to writing in VS Code using Markdown was more than just a change of tools; it was a shift in perspective. I began to see my writing as code, just like any other software I write.

## Formatting with Prettier

When writing technical content, I often need to include real code snippets in my text. Manually inserting code into a document without any formatting tools means spending time ensuring that line breaks, indentation, and other formatting details are correct.

I use Prettier to format my source code when writing software. Why not use it to format the code for my examples? After a little trial and error, I found a Prettier config with a small print width value, something like 60 characters or so.

By using Prettier this way, I've automated the process of formatting code so it fits nicely within the layout of the document. It preserves the appearance of the code, making it visually pleasant.

## Conversion from Markdown to Word for Amazon

Markdown isn't compatible with Amazon's publishing process. Amazon prefers manuscripts in formats like Word. To bridge this gap, I use pandoc to convert each Markdown file to a Word document:

```bash
pandoc -o ./output/$npm_package_name.docx  \
  --resource-path=chapters \
  --reference-doc=custom-reference.docx \
  --toc --toc-depth=1 \
  ./front-matter/*.md \
  ./chapters/*.md \
  ./back-matter/*.md \
  title.yaml
```

Once converted, I can upload the entire manuscript to Amazon without any additional changes. If I ever have to make edits to the book, I run this command again and resubmit the file.

To avoid typing that long command, I added it to my `package.json` and execute it with:

```bash
npm run generate:kdp
```

I also have a script that generates an ePub from the same set of files for sellers other than Amazon.

## Repurposing Content for Blog Posts

Writing in Markdown allows me to treat each chapter like a reusable component. A chapter from a book can be swiftly adapted to a blog post, a tutorial, or even a presentation, reaching different audiences with minimal additional work.

## PDF Conversions

I convert each chapter into a PDF to send to people who bought the book directly from my website, using a VS Code extension called Markdown PDF.

## Leveraging a Single Git Repo for Efficiency

I keep both the demo project and book text in a single Git repo. Everything stays under version control. I'm able to remain within VS Code for most of the process, only switching to Word when it's time to prepare the manuscript for Amazon.

To illustrate the possibility, I made the GitHub repo of one of my books completely public: [github.com/walkingriver/modern-parables](https://github.com/walkingriver/modern-parables).

## Conclusion

Blending coding with book authoring has been more rewarding than I could have imagined. For a software developer like me, integrating these worlds feels natural. I'll likely continue to use this writing process for all my future books and rewrites.

Originally published on [LinkedIn Pulse](https://www.linkedin.com/pulse/better-software-development-book-authoring-process-callaghan-uc0se).
