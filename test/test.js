'use strict';
const expect        = require('unexpected');
const getSuggestion = require('../lib/suggestions.js');
const readline      = require('readline');
const fs            = require('fs');
const Mispell       = require('../lib/misspell.js');
const take          = require('lodash/array/take');
const shuffle       = require('lodash/collection/shuffle');
const flow          = require('lodash/function/flow');

describe('Spelling Suggestions', () => {
  let dictionary = {};
  let randomWords;

  before(function (done) {
    const reader = readline.createInterface({
      input: fs.createReadStream('/usr/share/dict/words')
    });
    reader
      .on('line', line => dictionary[line.toLowerCase()] = true)
      .on('close', () => {
        randomWords = take(shuffle(Object.keys(dictionary)), 5)
        done();
      });
  });

  describe('suggestions', () => {
    it('should return "sheep" for "sheeeeep"', () => {
      expect(getSuggestion('sheeeeep', dictionary), 'to be', 'sheep');
    });

    it('should return "people" for "peepple"', () => {
      expect(getSuggestion('peepple', dictionary), 'to be', 'people');
    });

    it('should return "NO SUGGESTION" for "sheeple"', () => {
      expect(getSuggestion('sheeple', dictionary), 'to be', 'NO SUGGESTION');
    });

    it('should return "inside" for "inSIDE"', () => {
      expect(getSuggestion('inSIDE', dictionary), 'to be', 'inside');
    });

    it('should return "job" for "jjoobbb"', () => {
      expect(getSuggestion('jjoobbb', dictionary), 'to be', 'job');
    });

    it('should return "wake" for "weke"', () => {
      expect(getSuggestion('weke', dictionary), 'to be', 'wake');
    });

    it('should return "conspiracy" for "CUNsperrICY"', () => {
      expect(getSuggestion('CUNsperrICY', dictionary), 'to be', 'conspiracy');
    });
  });

  describe('mistakes', () => {
    it('should check against randomCase()', () => {
      randomWords.forEach(word => {
        expect(getSuggestion(Mispell.randomCase(word), dictionary), 'not to be', 'NO SUGGESTION');
      })
    });

    it('should check against multiplyLetters()', () => {
      randomWords.forEach(word => {
        expect(getSuggestion(Mispell.multiplyLetters(word), dictionary), 'not to be', 'NO SUGGESTION');
      })
    });

    it('should check against swapVowels()', function () {
      this.timeout(5000);
      randomWords.forEach(word => {
        expect(getSuggestion(Mispell.swapVowels(word), dictionary), 'not to be', 'NO SUGGESTION');
      })
    });

    it('should check against the three combined mistakes', () => {
      const applyAllMistakes = flow(Mispell.swapVowels, Mispell.randomCase, Mispell.multiplyLetters);
      const misspelled = applyAllMistakes('job');
      const suggestion = getSuggestion(misspelled, dictionary);
      expect(suggestion, 'not to be', 'NO SUGGESTION');
    });

  });
});
