---
title: JavaScript Boolean Gotchas
---

# JavaScript Gotchas

Checking conditions inside `if` statements explicitly in JavaScript helps prevent many extremely confusing bugs. I've spent a fair amount of time shipping code written with the language into production, and I've been bitten by issues involving truthiness and falsiness more times than I'd care to admit. Explicit checks for specific conditions tend to be much easier to reason about.

Instead of writing code which looks like this:

```
if (maybeTruthy) {
  foo();
} else {
  bar();
}
```

I'm happy to be a little verbose for the sake of clarity:

```
if (maybeTruthy !== undefined) {
  foo();
} else {
  bar();
}
```

To illustrate why I prefer the latter style, imagine that we have to loop through an array of numbers and print out every single one to the console using a `while` loop. Here's what a naive attempt at doing so might look like:

```
const logArrayOfNumbers = (arr) => {
  let i = 0;
  while (arr[i]) {
    console.log(arr[i]);
    i++;
  }
}
```

This code will sometimes work and sometimes break out of the array early. Do you see why?

The problem is that the number 0 in JavaScript is considered falsy. As such, if we encounter it in the array, the loop will terminate before we'd like it to. We can solve this problem by checking for `undefined` explicitly instead:

```
while (arr[i] !== undefined)
```

Or, better yet, we can use the length property:

```
while (i < arr.length)
```

In general, that last approach is best when dealing with arrays because it won't terminate early upon encountering the empty string, null, or undefined. Of course, if you _know_ that you need to go through every element of some array, a for/while loop is probably the wrong choice to begin with:

```
arr.forEach(el => console.log(el))
```

Gets the job done with one line of code that's easy to reason about.

The moral of the story? Try to write programs that don't rely upon JavaScript's odd quirks. Even with unit tests and static analysis tools like Eslint, it's extremely easy to create code that works most of the time but fails spectacularly at the worst possible time. TypeScript can help too, but it can't catch everything. I do my best to approach the language's sharp corners with vigilance and discipline.
