# Monads in Programming are About Types

If you've programmed before, you're probably familiar with the notion of _types_:

- Integers
- Characters
- Strings
- Booleans
- etc.

Some types are composed out of other types. For example, we might have:

- An array of numbers (like `Array<number>`),
- A hash map from strings to booleans (like `Map<string, boolean>`)
- A function that turns numbers into an array of strings (like `(...args: Array<number>) => Array<string>`);

If you find any of those ideas confusing, you might want to learn a bit more about programming before reading on.

Question: How do we _classify_ different types? We can imagine plenty of different ways, but here, we're going to do it by _looking at the functions which they support._ That idea is so critical that I'll repeat it for emphasis:

_We're classifying types by looking at the functions they support._

For example, let's define a `Stringor` to be any type which supports a `toString()` function. A `toString()` function should do what it says on the tin: Take an instance of the type and transform it into a string. In TypeScript, here's how we might describe this idea:

```
interface Stringor {
  toString: (el: Stringor) => string;
}
```

Or, if you prefer Haskell:

```
class Stringor s where
  toString :: s -> String
```

Are you with me so far? If not, I'd suggest rereading those last few paragraphs again.

A type is a monad if it supports two very special functions: _bind_ and _return._
