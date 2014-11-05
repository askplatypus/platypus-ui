/**
 * @copyright Thomas Pellissier-Tanon
 * @licence MIT
 */
(function($, window) {
	'use strict';

	/**
	 * speaks the output of the results
	 *
	 * @class
	 * @constructor
	 *
	 * @param {string} languageCode The language results should be speak in.
	 */
	window.resultSpeaker = function(languageCode) {
		this.languageCode = languageCode;
	};

	/**
	 * Speaks the result if possible.
	 *
	 * @param {array} results The results.
	 */
	window.resultSpeaker.prototype.speakResults = function(results) {
		if(!this.isSpeakSupported()) {
			return;
		}

		var msg = new SpeechSynthesisUtterance(this.buildSpokenMessage(results));
		msg.lang = this.languageCode;
		window.speechSynthesis.speak(msg);
	};

	/**
	 * @private
	 */
	window.resultSpeaker.prototype.isSpeakSupported = function() {
		return 'speechSynthesis' in window && window.speechSynthesis.getVoices().length > 0;
	};

	/**
	 * @private
	 */
	window.resultSpeaker.prototype.buildSpokenMessage = function(results) {
		if(results.length === 0) {
			return 'No results.'
		}

		var text = '';
		if(results.length === 1) {
			text = 'The result is: ';
		} else {
			text = 'The results are: ';
		}

		for(var i in results) {
			text += this.buildSpokenMessageForTree(results[i].tree) + ' ';
		}

		return text;
	};

	/**
	 * @private
	 */
	window.resultSpeaker.prototype.buildSpokenMessageForTree = function(tree) {
		switch(tree.type) {
			case 'triple':
				return this.buildSpokenMessageForTree(tree.subject) + ' ' +
					this.buildSpokenMessageForTree(tree.predicate) + ' is ' +
					this.buildSpokenMessageForTree(tree.object);
			case 'resource':
			case 'sentence':
				return tree.value;
			case 'missing':
				return 'missing';
			default:
				return '';
		}
	};

} (jQuery, window));
