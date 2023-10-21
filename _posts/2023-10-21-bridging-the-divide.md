---
layout: post
title: Bridging the Divide: Melding Feature Development and Sustainment into a Seamless Workflow
date: '2023-10-21'
author: Michael D. Callaghan
tags:
- Kanban
- Software Development
- Agile
- Sustainment
feature: https://walkingriver.com/assets/img/bridging-the-divide.png
thumbnail: https://walkingriver.com/assets/img/bridging-the-divide.png
cover_image: https://walkingriver.com/assets/img/bridging-the-divide.png
canonical_url: https://walkingriver.com/bridging-the-divide
published: true
---

# Bridging the Divide: Melding Feature Development and Sustainment into a Seamless Workflow

In the realm of software development, two core activities dominate the scene – Feature Development and Sustainment. The former is about adding new capabilities to the system, while the latter deals with maintaining and refining the existing system to ensure its steady and reliable operation. Traditionally, these two are seen as separate tracks, often managed by distinct teams with different sets of priorities and timelines. However, as the industry evolves towards more agile and lean practices, it's time to question this division and advocate for a more unified approach.

## The Kanban Advantage

Kanban, with its emphasis on visual management, work-in-progress limits, and continuous delivery, acts as a bridge that can unite the two tracks of Feature Development and Sustainment. Under this framework:

- Both feature and sustainment work items are visualized on the same board, providing transparency and a holistic view of all the work in the pipeline.
- Work-in-progress (WIP) limits ensure that the team’s capacity isn’t overwhelmed by an influx of new features or sustainment tasks, promoting a balanced focus.
- The pull system ensures that work is pulled only when there is capacity, thus avoiding the common pitfall of overloading the team with simultaneous feature and sustainment demands.

## The Rhythm of Consistent Releases

A consistent release cadence, where releases happen at fixed intervals, irrespective of whether the work item is a new feature or a sustainment task, fosters several beneficial practices:

- It encourages small, incremental changes, which are easier to manage, test, and deploy.
- It reduces the pressure associated with big releases and the corresponding big-bang integration and testing efforts.
- It promotes a culture of continuous improvement and feedback, as teams can learn from each release to improve the next.

## Ticket to Release: A Timely Journey

The journey from ticket creation to release should be swift, yet thorough. An appropriate time-frame might look like:

- **Implementation**: 1-2 weeks
- **Quality Assurance (QA)**: 1 week
- **Release**: Within the next scheduled release slot

This schedule ensures that there’s ample time for development, testing, and any necessary revisions, while still aligning with the regular release cadence.

## Optimistic Branching: The Path Forward

An optimistic branching strategy could be adopted to keep the momentum going for the next release while handling any defects found in QA for the current release. Under this strategy:

- Mainline development continues on the `main` branch targeting the next release.
- A release branch is cut from `main` at the start of the QA phase for the current release.
- Defects found in QA are fixed on the release branch and merged back to `main` to ensure the `main` branch also receives these fixes.

This strategy ensures that development for the next release isn’t held up by the QA phase of the current release, while still providing a mechanism to address defects in a structured manner.

## Conclusion

The divide between Feature Development and Sustainment is a relic of the past that doesn’t serve the agile, fast-paced development environments of today. By adopting Kanban with a consistent release cadence, teams can blend these two tracks into a seamless workflow that delivers continuous value while ensuring the system’s reliability and quality. Through timely ticket to release journeys and an optimistic branching strategy, this unified approach paves the way for a more efficient, predictable, and value-driven software development lifecycle.
