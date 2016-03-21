'use strict';
const Correct  = require('./correct.js');
const _        = require('lodash');

Array.prototype.flatMap = function (f) { return _.flatten(this.map(f)); }

module.exports = function getSuggestion(word, dictionary) {
    if (word in dictionary) {
        return word;
    } else {
        let suggestions = Correct.lowerCase(word);
        if (suggestions[0] in dictionary) return suggestions[0];

        suggestions = Correct.repetitions(word);
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i] in dictionary) return suggestions[i];
        }

        suggestions = Correct.vowels(word);
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i] in dictionary) return suggestions[i];
        }

        suggestions =
            Correct.lowerCase(word)
                .flatMap(suggestion => Correct.repetitions(suggestion))
                .flatMap(suggestion => Correct.vowels(suggestion));
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i] in dictionary) return suggestions[i];
        }
    }
    return 'NO SUGGESTION';
};
