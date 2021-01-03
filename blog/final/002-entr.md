---
title: Language Agnostic Testing Automation with Entr
description: How should one go about running tests while doing test-driven development? I like to have the tests automatically refresh in a terminal in the background while I edit the production and test files. Some test runners support this workflow out of the box, but others don't, so I came up with a language and tool agnostic way of achieving it. If you can run the tests of your project by typing a command into your shell, this strategy should work for you.
---

# Language Agnostic Testing Automation with Entr

How should one go about running tests while doing test-driven development? I like to have the tests automatically refresh in a terminal in the background while I edit the production and test files. Some test runners support this workflow out of the box, but others don't, so I came up with a language and tool agnostic way of achieving it. If you can run the tests of your project by typing a command into your shell, this strategy should work for you.

One small program does most of the heavy lifting: [entr](http://eradman.com/entrproject/). If you pipe a list of files for `entr` to watch and provide it an arbitrary shell command to run, `entr` will happily run the command you give it whenever any of the files change. For example, running:

```
ls src/* | entr -c -d -r cargo test
```

Will invoke `cargo test` inside of a Rust project whenever you change any of the files inside the `src` directory.

While the command above works, it has one fatal weakness: It relies on parsing the output of the output of `ls`, [which is generally considered a bad practice](https://unix.stackexchange.com/questions/128985/why-not-parse-ls-and-what-to-do-instead). In the context of a small script with trusted input that only a single programmer will ever run, I don't think it's a huge problem, but a better alternative exists.

That alternative is to write a tiny program _outside of shell_ that prints the names of all the files you care about. For example, here's how we might leverage Ruby to get the job done:

```
ruby -e 'puts (Dir.glob("src/*").map{|dir| File.expand_path(dir)})' | entr -c -d -r cargo test
```

Any scripting language will work, here; the key idea is to move all the file-finding logic into a more robust language while keeping the shell script to a single line. The template looks like this:

```
list-important-files | entr -c -d -r run-tests
```

Where `run-tests` is some command that runs the tests for your project and `list-important-files` is a script saved somewhere on your $PATH that prints out all of the files relevant to your project.

That's all! Happy testing!
