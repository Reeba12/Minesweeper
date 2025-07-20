function halvesHaveEqualVowels(s) {
    const mid = s.length / 2;
    const first = s.slice(0, mid);
    const second = s.slice(mid);

    const countVowels = (str) => {
        let count = 0;
        for (let char of str) {
            if ('aeiouAEIOU'.includes(char)) {
                count++;
            }
        }
        return count;
    };

    return countVowels(first) === countVowels(second);
}

console.log(halvesHaveEqualVowels("TextBook"));
console.log(halvesHaveEqualVowels("NoteBook"));
