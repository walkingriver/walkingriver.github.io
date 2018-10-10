# An Effective GitHub Changelog


## Goal
I want a useful changelog for every release, but don't care for the idea of
spending hours creating one. There are tools to help automate it, but they tend
to require just as much effort as manual processes.

### Constraints and Ideals
- Easy to read.
- Summarizes what is in the release at a glance.
- Provides links to more details, if necessary.
- Can be done by one person on the final day of the sprint in about an hour.

## My Solution
I stumbled upon a website, https://keepachangelog.com, which provided a format I
think I can live with. Three sprints done, and I'm still happy with the results. 

### Plan the Sprint

### Work the Sprint

### End the Sprint
Once your code is complete and you've declared your project is ready to be deployed, end your
sprint by tagging your code at the current commit. Use any tag naming format you want, as
long as it is consistent and makes sense to you. I use the anticipated release date as my
tag names (YY.MM.DD). It isn't semver, but neither are my projects. 

## Create the Diff, Step by Step
1. Open GitHub to your repo's code.
1. Click on the `commits` link.
1. Copy down the most recent commit hash (this should be the one at the top).
1. Scroll down to the oldest commit that you want to use as the base of your diff. On subsequent changes, this will be the hash 