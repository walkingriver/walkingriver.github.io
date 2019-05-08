---
layout: post
title: What the ~|&||&&$!`()?
date: '2019-05-03T15:15:00.002-04:00'
author: Michael Callaghan
tags: terminal,development,shell
modified_time: '2019-05-03T15:15:48.265-04:00'
layout: post
feature: assets/img/linux-shell.png
thumbnail: https://walkingriver.com/assets/img/bash.png
cover_image: https://walkingriver.com/assets/img/linux-shell.png
canonical_url: https://walkingriver.com/what-the-symbols/
published: true
---

What do all these symbols mean? I saw someone post on Twitter recently that if you place a single ampersand between two shell commands, they run in parallel. While that is somewhat true, the tweet didn't capture the essence of what is really going on. So I decided I would go back to basics and remind myself (and others) just what these and other weird symbols do in a Linux, MacOS, or even Windows (Bash) terminal.

<!--more-->

Here is the tweet I referred to...

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Did you know that a double ampersand &amp;&amp; will run multiple scripts sequentially while a single &amp; will run them in parallel? <a href="https://twitter.com/hashtag/javascript?src=hash&amp;ref_src=twsrc%5Etfw">#javascript</a> <a href="https://twitter.com/hashtag/node?src=hash&amp;ref_src=twsrc%5Etfw">#node</a> <a href="https://twitter.com/hashtag/npm?src=hash&amp;ref_src=twsrc%5Etfw">#npm</a> <a href="https://twitter.com/hashtag/webdeveloper?src=hash&amp;ref_src=twsrc%5Etfw">#webdeveloper</a> 🤯  <a href="https://t.co/58P92Bo3AI">pic.twitter.com/58P92Bo3AI</a></p>&mdash; Dan Vega (@therealdanvega) <a href="https://twitter.com/therealdanvega/status/1116403685452668928?ref_src=twsrc%5Etfw">April 11, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

_Note: The examples contained below were all tested and work on a MacOS terminal running the bash shell. They should work on any other common shell in Linux, and should even work in GitBash for Windows. As always, your mileage may vary._

# And &&

Most people are familiar with this example. I see it often inside of a build scripts, as in the following command.

```sh
npm test && npm run build
```

Conventional wisdom says that this command runs `npm test` and then  `npm run build`. But that is not quite accurate. It is more accurate to say that it runs `npm test`, and only if `npm run` succeeds (exit code is 0), run `npm run build`. If the first command fails (exit code != 0), then the second command will not get run at all. In most cases, this is exactly what you want to happen. In my example, if my tests fail, there is no reason to run the build. If you simply think that the two commands will be  run sequentially, this behavior may take you by surprise. 

To prove that this is the case, try the following in your favorite shell. 

```sh
ls this-folder-does-not-exist-anywhere && echo "I will not execute"
```

You should see an error message, and the echoed string will not appear.

You can string together as many of these as you like. Just be aware that the first command that fails will interrupt the rest of them. 

# Or ||

What if you want the string of commands to continue? You could try using an Or (`||`) operator, but that probably won't work the way you think either. Whereas the previous operator terminates after the first failure, this operator terminates after the first success. So the second command will only run if the first command fails!

To see this in action, try the following command: 

```sh
echo "I worked" || echo "Which means I will not execute"
```

I often see this sort of construct used as a simple test mechanism prior to creating a file or folder. Consider this example. 

```sh
[ -d ~/i-do-not-exist ] || mkdir ~/i-do-not-exist 
```

In case you have not seen that first command, it is a function to test whether or not a directory exists. Thus, the command says, "make this directory, but only if it does not already exist." This method has the advantage of not writing an error to the terminal, as would happen if you used `ls ~/i-do-not-exist`. 

# My Home Folder ~
If you are not familiar with the tilde `~` symbol from the last example, it is a simple shortcut, which represents your home directory. To see it expanded, you can use it with the `echo` command.

```sh
echo ~
/Users/michael
```

# Background &

Back to the tweet that started all of this, suggesting that using a single `&` allowed the commands to run in parallel. As I said, that is one effect, but it is only part of the story. In general, you would use the `&` operator when you want a long-running shell script to execute in the background. Sure, you could also open another terminal session, but that will use more resources than running a single command. 

To see how this works in practice, consider the following long-running command, which searches my entire home directory for all PDF files, outputting each file's path in a file in my home directory called `my-pdf-files.txt`.

```sh
find ~ -name *.pdf > ~/my-pdf-files.txt
```

This command takes more than 2.5 minutes to executes on my i7 MacBook Pro. Simply adding the `&` operator to the end of that command causes it to be run as a background job. 

```sh
find ~ -name *.pdf > ~/my-pdf-files.txt &
```

Executing this command results in an immediate command response that looks like this:

```sh
[1] 35715
```

This tells me that my background job is Job #1, and its process ID is 35715. I can check on its status with the `jobs` command. 

```
jobs
[1]+  Running                 find ~ -name *.pdf > ~/my-pdf-files.txt &
```

I can bring it to the foreground with the `fg 1` command, which will then cause my terminal to block. Once in the foreground, I can suspend the job by typing `Ctrl+Z`, and then typing `bg` to put it back in the background. 

If I really want to do so, I can kill the process entirely with the `kill 35715` (the process ID from initial command's output).

So how would this work with two commands? If the two commands are at all related to each other, it probably would not. But what if I wanted to run two similar find commands, one looking for PDFs and one looking for MP3 files? In such a case, it will not matter which one completes first, and there is a definite advantage to running them in parallel. 

```sh
find ~ -name *.pdf > ~/my-pdf-files.txt & find ~ -name *.mp3 > ~/my-mp3-files.txt &
[1] 36782
[2] 36783
```

Executing this command creates two background jobs, indicated by the two job numbers and process IDs provided. 

When they complete, you will see something like this in your terminal.

```sh
[1]-  Exit 1                  find ~ -name *.pdf > ~/my-pdf-files.txt
[2]+  Exit 1                  find ~ -name *.mp3 > ~/my-mp3-files.txt
```

# Redirect Output >
If you have been following along with these examples, you may have seen a few error messages. Even though the commands are running in the background, the output of both is being displayed at the terminal. That is easy enough to fix, by redirecting its output, using the "greater than" or "right angle bracket" symbol (`>`). In fact, I used that in the previous two examples. 

Using a single `>` symbol tells the shell to redirect the standard console output (stdout) to the file specified. So the `find` command above sends its standard output to the file. If the file does not exist, it will be created. If it does exist, it will be replaced. 

If you want the command to append to the file instead of creating it from scratch, you can use two `>>` symbols. 

None of that prevents errors from being displayed on the console, because that is a different output stream (known as stderr). You have a couple of alternatives here. You can send the errors into a different file, by specifying another redirect, like this.

```sh
find ~ -name *.pdf > ~/my-pdf-files.txt 2>~/errors.txt
```

The `2>` specifically indicates that you are redirecting `stderr`. As you might guess, `1>` indicates `stdout`, but the default redirect is `stdout`, so the `1` can be omitted.

Further complicating things, you can redirect `stderr` to the same target as `stdout`, by using `&1` as its target, like this...

```sh
find ~ -name *.pdf > ~/my-pdf-files.txt 2>&1`
```

`&1`, another example of `&` that means something else entirely, is shortcut for "where `stdout` is being sent." 

I do not often have occasion for `stdout` and `stderr` to end up in the same file, particularly in the above examples, where I am collecting files of a certain type into a file of those files. In those scenarios, I would prefer simply to throw those errors away. 

In MacOS or Linux shells, I can choose to redirect `stderr` to `/dev/null`, a special file that simply ignores everything. On Windows, I understand there is a special file called `nul` that accomplishes the same thing.

So my complete command above will look like this.

```sh
find ~ -name *.pdf > ~/my-pdf-files.txt 2>/dev/null
```

# Redirect Input < 
I see this used less often, as most commands accept the name of an input file as an argument. Back in the day&trade;, many (if not most) commands operated on standard input (`stdin`), by default, the keyboard, and sent its output to `stdout`. 

Imagine I want to know how many of those PDF files above were found. I could open the file in my favorite text editor and check, but there is an easier way. I can type this command in the terminal.

```sh
wc -l < ~/my-pdf-files.txt`
    3308
```

Yeah, I had no idea I have that many. `wc` is the "word count" command, and the `-l` switch tells it I only care about the number of lines. By default, `wc` takes its input from `stdin`, which you can see by typing the command by itself, entering any text you want, ending your input by typing `Ctrl+D`.

```sh
wc -l
Mike
was 
here
Ctrl+D
       3
```

Notice that the `Ctrl+D` isn't counted as a line. It also needs to be specified on a line by itself. If you type it at the end of a line, it will be part of that line.

This strategy works with any command that accepts input from `stdin`, which is most commands available in the terminal. 

One command I see most often is `more`, which is used to page the output of a file.

```sh
more < ~/my-pdf-files.txt
```

Again, I do not see this used much anymore; most of these commands accept the file to be operated on as an argument. This version of the command is far more common.

```sh
more ~/my-pdf-files.txt
```

# I/O Pipe |

What about the single `|` operator?  This is an I/O Pipe. It uses the output of the first command as input to the second command. Think of this as a combination of both `>` and `<`. 

What if I wanted a sorted list of those PDF files? I could use the `sort` command after the fact. However, I could also use the `|` pipe as part of the `find` command, ignoring errors, sorting the output, finally depositing the information in a new file, executing the entire thing as a background job.

```sh
find ~ -name *.pdf  2>/dev/null | sort > ~/my-pdf-files.txt &
```

# Expand $
Every system has environment variables. These are settings specific to the running system. On my Mac, I have more than 100 of them. If you need to use them inside of a shell script or another command, they can be convenient to know about, even when they have a command equivalent. 

For example, I mentioned `~` above. You can also reference that with the `$HOME` environment variable. On my system, I also have things like `$HOSTNAME`, `$USER`. 

The outputs of these commands are often used inside of other commands. 

```sh
echo My home directory is ~
echo My home directory is $HOME
```

A very common use of this is to see what folders on your system are searched for executable files. This is allows you to type `java -version` instead of its absolute path, which would be much longer and more inconvenient to type.

```sh
echo $PATH
```

## Expansion within " "
The `echo` command above is special. It can handle multiple parameters. Most commands prefer you to surround a string like that in quotes, to be considered a single parameter. In that case, it is important to know the different between single quotes (`'`) and double quotes (`"`)

When you use double quotes, your environment variables will be expanded.

```sh
echo "Hi, $USER! Have you cleaned up your $HOME folder today?"
Hi, michael! Have you cleaned up your /Users/michael folder today?
```

In this command, the `$USER` and `$HOME` variables are both expanded. The entire string is passed as a single parameter to the `echo` command.

## No Expansion within ' '
If you do not want the environment variables to be expended, you can use single quotes instead (`'`).

```sh
echo 'Hi, $USER! Have you cleaned up your $HOME folder today?'
Hi, $USER! Have you cleaned up your $HOME folder today?
```

# Use Command Output `` 
What if you want to execute a command and include its output as part of another command? For that, you can surround the command with back-ticks (`). This is different from output piping, as it is not necessarily redirecting the output of one command as the input to another command. Consider this overly simplistic example.

```sh
echo "You have `wc -l < ~/my-pdf-files.txt` PDF files."
You have     3308 PDF files.
```
The `wc` command is executed, its output is placed into the string at that point, and then the entire string is passed to the `echo` command.

Another place I use this pattern often is trying to find the actual location of an executable. On my Mac, most executable are symbolically linked into the `/usr/bin` folder. So this command does not provide the information I need.

```sh
which java
java is /usr/bin/java
```

To know where it really is, I will use the `ls -l` command on the output of the `which java` command, like so.

```sh
ls -l `which -p java`
```

The `-p` switch shortens the output to just the path, without the message "java is". On my system, this expands to the command I really want to run.

```sh
ls -l /usr/bin/java
lrwxr-xr-x  1 root  wheel    74B Sep 11  2018 /usr/bin/java -> /System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java
```

# History!
The last symbol I want to mention is the exclamation mark, or bang (`!`). This symbol allows you to execute any command in your command history. To see a list of these commands, enter the following command.

```sh
history
  657  which -p java
  658  ls -l `which -p java`
  659  history
```

You will be presented with a possibly-lengthy list of commands, with the most recent at the end of the list. To execute any of of them, simply type the bang followed by the command number shown next to the command.

```sh
!657
which -p java
/usr/bin/java
```

You can use the `grep` utility to search your history. For example, here are all of the find commands I ran creating this post, piped through the `uniq` utility to get only unique commands.

```sh
history | grep find | uniq
  585  find ~ -name *.pdf > ~/my-pdf-files.txt
  586  find ~ -name *.pdf > ~/my-pdf-files.txt &
  589  find ~ -name *.pdf > ~/my-pdf-files.txt & find ~ -name *.mp3 > ~/my-mp3-files.txt &
  605  find ~ -name *.pdf  2>/dev/null | sort > ~/my-pdf-files.txt 
  606  find ~/Downloads/ -name *.pdf  2>/dev/null | sort > ~/my-pdf-files.txt 
  608  find ~/Downloads/ -name *.pdf  2>/dev/null | sort > ~/my-pdf-files.txt &
  663  history | grep find | uniq
```

# Ctrl+R Search History
As a bonus, in some shells, you can also use the keyboard shortcut `Ctrl+R` to search your history interactively. To see this in action, type `Ctrl+R` followed by the text of a command, for example, `find`. The most recent match will appear. Continue typing `Ctrl+R` to step backwards through the history. At any point, you can stop by pressing `Space`, or the right or left arrow keys. You are then free to edit the command, pressing Enter to execute it. Press `Ctrl+C` to get out of the history without doing anything. 

# Summary
Even though they are specifically targeted to *nix-based OSes, many of these work in GitBash or similar on Windows. 

I have only scratched the surface of the special symbols available in many terminal shells. 

Have I missed your favorite? Do you have a specific tips? Did I make any mistakes in this post? Let me know on Twitter. I'm [@walkingriver](https://twitter.com/walkingriver).
