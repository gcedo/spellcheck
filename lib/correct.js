'use strict';
const product = require('cartesian-product');
const Levenshtein = require('levenshtein');
const sortByAll = require('lodash/collection/sortByAll');

const computeDistance = (array, string) => ({
  string: array.join(''),
  distance: (new Levenshtein(string, array.join(''))).distance
});

const Vowels = ['a', 'e', 'i', 'o', 'u'];
const isVowel = char => Vowels.indexOf(char.toLowerCase()) !== -1;

module.exports = {
  isVowel,
  Vowels,

  /**
   * Changes the case of the input string to lower and returns it in an array.
   *
   * @param  {String} string The input string.
   * @return {Array}         The array containing the converted string.
   */
  lowerCase: string => [ String.prototype.toLowerCase.apply(string) ],

  /**
   * Finds letters repetitions, and computes the cartesian product, where each
   * repeated letter is substituted itself repeated once or twice.
   * Note: in the Unix `words` file the following words contain three consecutive
   * letters:
   *  - bossship
   *  - demigoddessship
   *  - goddessship
   *  - headmistressship
   *  - patronessship
   *  - wallless
   *  - whenceeer
   *
   *  We purposely ignored these 7 edge cases out of 235886 total words,
   *  in favour of general better performance.
   *
   * @param  {String} string The input string.
   * @return {Array}         The computed suggestions.
   */
  repetitions: string => {
    const regex = /(.)\1*/g;
    const suggestions = product(
      string.match(regex).map(group => {
        if (group.length > 1) return [[group[0]], [group[0] + group[0]]];
        return [group];
      })
    ).map(combination => computeDistance(combination, string));

    return sortByAll(suggestions, ['distance', 'string'])
      .map(suggestion => suggestion.string);
  },

  /**
   * Finds all the possible combinations of vowels in a word.
   *
   * @param  {String} string The input string.
   * @return {Array}         The computed suggestions.
   */
  vowels: string => {
    const suggestions = product(
      string.split('').map(char => {
        if (isVowel(char)) return Vowels;
        return [char];
      })
    ).map(combination => computeDistance(combination, string));

    return sortByAll(suggestions, ['distance', 'string'])
      .map(suggestion => suggestion.string);
  }
};
