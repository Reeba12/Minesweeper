# Vowel Count Checker

A simple JavaScript function that checks if both halves of a string contain the same number of vowels.

## Description

The `halvesHaveEqualVowels` function takes a string and determines whether the first half and second half of the string have an equal number of vowels (a, e, i, o, u, A, E, I, O, U).

## Function

```javascript
function halvesHaveEqualVowels(s)
```

### Parameters
- `s` (string): The input string to check

### Returns
- `boolean`: `true` if both halves have equal vowels, `false` otherwise

## How it works

1. Divides the string into two equal halves
2. Counts vowels in the first half
3. Counts vowels in the second half
4. Returns `true` if the counts are equal, `false` otherwise

## Usage

```javascript
console.log(halvesHaveEqualVowels("TextBook")); // true
console.log(halvesHaveEqualVowels("NoteBook")); // false
```

## Running the code

```bash
node vowel-count.js
```

## Algorithm

The function uses a simple approach:
1. Calculate the midpoint of the string
2. Split the string into two halves
3. Count vowels in each half using a loop
4. Compare the counts and return the result
