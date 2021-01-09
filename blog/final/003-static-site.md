---
title: Towards a Simpler Web
description: When building this website, I decided to roll my own static site generator. Using TypeScript, I wrote a 300 line program to compile some Markdown files and a few hand-hacked static assets into a series of directories and HTML files that any server could potentially host. The "apps" page exists to host projects written in JavaScript or various other languages that compile into it, but this blog section doesn't use any scripts. All I needed was the bricks of the web, and maybe that's all you need, too.
---

# Towards a Simpler Web

When building this website, I decided to roll my own static site generator. Using TypeScript, I wrote a 300 line program to compile some Markdown files and a few hand-hacked static assets into a series of directories and HTML files that any server could potentially host. The "apps" page exists to host projects written in JavaScript or various other languages that compile into it, but this blog section doesn't use any scripts. All I needed was the bricks of the web, and maybe that's all you need, too.

Don't get me wrong: Modern web tooling solves an enormous number of problems. Libraries like React and languages like TypeScript, ClojureScript, and Elm make working on large applications joyous, and I'm vastly grateful for all of the hard work that developers put into them. With that said, those technologies come with a great deal of complexity that does not befit every problem.

For example: What are people going to do on my blog? They're going to be reading text. Hopefully, they'll click around from page to page. Do I really need to pull in kilobytes or even *megabytes* of JavaScript to make the act of reading text pleasant? Do I have to figure out how to make dozens or even hundreds of dependencies play nicely together? HTML and CSS do the job quite nicely without any of that headache. Generating collections of pages linked correctly with identical styles requires a bit more trickery, but it doesn't need to be more complicated than some fairly basic string bashing. 

So the next time you have to build a website, consider whether you can get away with hacking it together using a couple scripts along with some duct-tape and some glue. Maybe you won't be able to, and that's okay—libraries and frameworks exist for good reason. If you can get away with something simpler, however, you might wind up with a product that's faster, simpler, and more delightful.
