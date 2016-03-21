/** @module misspell */
'use strict';
const Case    = require('case');
const times   = require('lodash/utility/times');
const remove  = require('lodash/array/remove');
const shuffle = require('lodash/collection/shuffle');
const correct = require('../lib/correct');

const Vowels  = correct.Vowels;
const isVowel = correct.isVowel;

module.exports = {

  /**
   * Randomizes the case of the input string.
   *
   * @param  {String} string The input string.
   * @return {String}        The input string, random case.
   */
  randomCase: string => {
    return string.toLowerCase().split('').map(character => {
      if (Math.random() >= .5) return character;
      return character.toUpperCase();
    }).join('');
  },

  /**
   * Randomly multiplies the letters occurrences in a string.
   *
   * @param  {String} string The input string.
   * @return {String}        The input string, with randomly multiplied letters.
   */
  multiplyLetters: string => {
    return string.split('').map(character => {
      if (Math.random() >= .5) return character;
      return times(Math.floor(Math.random() * 5) + 1, n => character).join('');
    }).join('');
  },

  /**
   * Randonly changes the vowels of the input string.
   *
   * @param  {String} string The input string.
   * @return {String}        The input string, with randomly swapped vowels.
   */
  swapVowels: string => {
    return string.split('').map(character => {
      if (isVowel(character)) {
        return Case[Case.of(character)](
          shuffle(
            remove(Vowels.slice(), vowel => vowel !== character.toLowerCase())
          )[0]
        );
      }
      return character;
    }).join('');
  }
};
