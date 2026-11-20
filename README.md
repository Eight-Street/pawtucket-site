# pawtucket-site

A clickable prototype of a rebooted pawtucketri.gov for Mayor-elect Adam Greenman's website working group.

**This is a prototype for review. It is not an official City of Pawtucket website.**

## What it shows

The *feel* of Phase 1: a reskin of the current site built around hospitality. Residents get concierge-style routing ("What brings you here today?"), shortcuts to the tasks people actually come for, and a clear path to a real person. There is no new functionality. Every link goes to an existing page on the current pawtucketri.gov or one of its vendor portals.

## Pages

- `index.html`: Home, with the concierge chips, "Start here" paths, popular services, a draft welcome from the Mayor-elect, Get involved, and Need help
- `help/`: every service, grouped by task, with an "I'm looking for…" filter
- `departments/`: departments A to Z, with a filter
- `meet-the-mayor/`: a draft bio adapted from deliverforpawtucket.com
- `get-involved/`, `news/`: thin pages that link out to the current site

## Placeholders

- The colors and the "P" wordmark are placeholders until Johnny's logo direction comes in
- The portrait is a placeholder
- The welcome note and bio are drafts for the Mayor-elect's review
- "Translate this page" opens the page through Google Translate

## Tech

Plain static HTML/CSS/JS, served by GitHub Pages from `main`. There is no build step. Edit the HTML files directly.

The site sets `noindex, nofollow` so search engines don't index it.
