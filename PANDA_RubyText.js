//=============================================================================
// PANDA_RubyText.js
//=============================================================================
// [Update History]
// 2020-09-20 Ver.1.0.0 First Release for MZ.
// 2020-09-26 Ver.1.0.1 Fixed getting parameters.
// 2021-06-23 Ver.1.1.0 fix for subfolder (MZ 1.3.0).
// 2021-07-05 Ver.1.1.1 revert fix for subfolder (MZ 1.3.2).
// 2026-01-19 Ver.2.0.0 Major feature expansion.
// 2026-01-23 Ver.2.0.1 fix for Choice List.
// 2026-02-11 Ver.2.0.2 bug fix for Choice List and Gold Window.

/*:
 * @target MZ
 * @plugindesc テキストにルビを振ることができます。(Ver.2.0.2)
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20260119191123.html
 * 
 * @help 以下の記述でテキストにルビ（ふりがな）を振ることができます。
 * {漢字|ルビ}
 * 
 * 例：この{記述|きじゅつ}でルビが{振|ふ}れます。{超|ちょう}{凄|すご}い！
 * 
 * 通常のメッセージ以外に、アイテム名や説明欄、敵キャラ名等にも対応しています。
 * ただし、戦闘画面のアクターステータスのアクター名のみ、ルビ表示に非対応です。
 * （コアスクリプトにおける描画方法が異なるのと、ルビがあると見にくくなるため）
 * 
 * フォントサイズがデフォルトの26、1行の高さが標準の36に対して、
 * ルビのフォントサイズ10を基準としており、
 * 各ウィンドウの高さ調整などはしていません。
 * フォントサイズ等をデフォルトから変更している場合は、
 * ルビに合わせてウィンドウの高さを調整する必要があるかもしれません。
 * 
 * 「ルビ無しの行高さ調整」をONにすると、コマンド選択やアイテム名、スキル名等で
 * ルビが含まれない項目を表示する際に、ルビ分の高さを確保せず、
 * 通常の高さで表示します。項目枠の縦中央に表示されるため、見やすくなります。
 * ただし、メッセージ（「文章の表示」）や戦闘ログ、ヘルプ欄の文章については、
 * ルビが含まれない行でも、必ずルビ分の高さが確保されます。
 * （Ver.2.0.1で、「選択肢の表示」でも高さ調整が有効になりました）
 * 
 * ルビの表示を強制的に無効化するウィンドウ、有効化するウィンドウを、
 * それぞれ「ルビ無効ウィンドウ」「ルビ有効ウィンドウ」で指定できます。
 * ウィンドウ名はスクリプトのWindowクラス名で指定してください。
 * 「ルビ無効ウィンドウ」の方が「ルビ有効ウィンドウ」よりも優先されます。
 * ここで指定された以外のウィンドウにおけるルビの有効/無効は、
 * 「デフォルトでルビ有効」の指定に従います。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param RubyFontSize
 * @text ルビのフォントサイズ
 * @desc ルビのフォントサイズを指定します。
 * @type number
 * @default 10
 * @max 32
 * @min 4
 * 
 * @param RubySpaceAdjust
 * @text ルビの字間調整
 * @desc ONにするとルビの字間を自動調整します。
 * @type boolean
 * @default true
 * 
 * @param RubyHeightAdjust
 * @text ルビ無しの行高さ調整
 * @desc ONにすると、ルビがない項目（コマンドやアイテム名など）の表示では、ルビ分の高さを確保せず通常の高さで表示します。
 * @type boolean
 * @default true
 * 
 * @param RubyDisabledWindows
 * @text ルビ無効ウィンドウ
 * @desc ここで指定したウィンドウはルビ表示が強制的に無効になります。ルビ有効ウィンドウの指定よりも優先されます。
 * @type string[]
 * @default ["Window_NameEdit", "Window_NameInput", "Window_DebugRange", "Window_DebugEdit"]
 * 
 * @param RubyEnabledWindows
 * @text ルビ有効ウィンドウ
 * @desc ここで指定したウィンドウはルビ表示が強制的に有効になります。ルビ無効ウィンドウの指定の方が優先されます。
 * @type string[]
 * @default []
 * 
 * @param RubyDefaultEnabled
 * @text デフォルトでルビ有効
 * @desc 前項のルビ無効/有効ウィンドウで指定されたウィンドウ以外のウィンドウの、ルビ表示ON/OFFを指定します。
 * @type boolean
 * @default true
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const RubyFontSize = parseInt(parameters['RubyFontSize']) || 10;
	const RubyFontHeight = RubyFontSize;
	const RubySpaceAdjust = (parameters['RubySpaceAdjust'] !== 'false');
	const RubyHeightAdjust = (parameters['RubyHeightAdjust'] !== 'false');
	const RubyDisabledWindows = JSON.parse(parameters['RubyDisabledWindows']) || [];
	const RubyEnabledWindows = JSON.parse(parameters['RubyEnabledWindows']) || [];
	const RubyDefaultEnabled = (parameters['RubyDefaultEnabled'] !== 'false');
	
	// delete ruby from text with ruby
	const _deleteRuby = function(text) {
		return String(text).replace(/\x1e?\{([^\{]+?)\|(.*?)\}/g, "$1");
	};
	
	
	//--------------------------------------------------
	// Window_Base.isRuby
	//  [New Definition]
	//--------------------------------------------------
	Window_Base.prototype.isRuby = function() {
		if (this._rubyTempOff) {
			return false;
		} else {
			const name = this.constructor.name;
			if (RubyDisabledWindows.includes(name)) {
				return false;
			} else if (RubyEnabledWindows.includes(name)) {
				return true;
			} else {
				return RubyDefaultEnabled;
			}
		}
	};
	
	
	//--------------------------------------------------
	// Window_Base.initialize
	//  [Modified Definition]
	//--------------------------------------------------
	const _Window_Base_initialize = Window_Base.prototype.initialize;
	Window_Base.prototype.initialize = function(rect) {
		_Window_Base_initialize.call(this, rect);
		this._rubyTempOff = false;
	};
	
	
	//--------------------------------------------------
	// Window_Base.drawTextRuby
	//  [New Definition]
	//--------------------------------------------------
	Window_Base.prototype.drawTextRuby = function(text, x, y, maxWidth, height, align) {
		
		// convert string
		text = text + '';
		
		// const
		const rtl = Utils.containsArabic(text);
		
		// alignment
		if (align === 'center') {
			// center
			const width = this.textWidth(_deleteRuby(text));
			x = x + (maxWidth - width) / 2;
		} else if (align === 'right') {
			// right
			const width = this.textWidth(_deleteRuby(text));
			x = x + (maxWidth - width);
		}
		
		// text loop
		while (text !== '') {
			
			// get the next character and slice the text
			let c = text.charAt(0);
			text = text.substring(1);
			
			// switch by the next character
			if (c === '{') {
				
				// ruby start
				let b = '';
				let r = '';
				// parse kanji and ruby
				text = text.replace(/(.+?)\|(.*?)\}/, function() {
					b = arguments[1];
					r = arguments[2];
					return '';
				}.bind(this));
				
				// draw kanji
				const fs = this.contents.fontSize;
				const yo = Math.floor((height - RubyFontHeight - fs) / 2);
				const bw = this.textWidth(b);
				x = rtl ? x - bw : x;
				this.contents.drawText(b, x, y + yo + RubyFontHeight, bw, fs);
				
				// change font for ruby
				this.contents.fontSize = RubyFontSize;
				// get the width of ruby
				if (RubySpaceAdjust) {
					
					// Ruby Space Adjust
					const rw = this.textWidth(r);
					if (rw > bw || b.length === 1) {
						// ruby over base or base is 1 letter
						this.contents.drawText(r, x, y + yo, bw, RubyFontHeight, 'center');
					} else {
						// ruby inside base
						const rc = r.length;
						const rd = bw - rw;
						const rp = Math.floor(rd / (rc * 2)) * 2;
						const ro = (rd - rp * (rc - 1)) / 2;
						let rx = x + ro;
						for (let i = 0; i < rc; i++) {
							const rr = r.charAt(i);
							const rs = this.textWidth(rr);
							this.contents.drawText(rr, rx, y + yo, rs, RubyFontHeight, 'center');
							rx = rx + rs + rp;
						}
					}
					
				} else {
					
					// No Adjust
					let rw = this.textWidth(r);
					let ro = 0;
					if (rw > bw) {
						rw = bw;
					} else {
						ro = (bw - rw) / 2
					}
					// draw ruby
					this.contents.drawText(r, x + ro, y + yo, rw, RubyFontHeight, 'center');
					
				}
				
				// change to font original
				this.contents.fontSize = fs;
				// next position
				x += rtl ? -bw : bw;
				
			} else {
				
				// normal characters
				const fs = this.contents.fontSize;
				const yo = Math.floor((height - RubyFontHeight - fs) / 2);
				const w = this.textWidth(c);
				x = rtl ? x - w : x;
				this.contents.drawText(c, x, y + yo + RubyFontHeight, w, fs);
				x += rtl ? -w : w;
				
			}
			
		}
		
	};
	
	
	//--------------------------------------------------
	// Window_Base.drawText
	//  [Modified Definition]
	//--------------------------------------------------
	const _Window_Base_drawText = Window_Base.prototype.drawText;
	Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
		if (this.isRuby()) {
			if (!RubyHeightAdjust || text != _deleteRuby(text)) {
				// draw text with ruby
				this.drawTextRuby(text, x, y, maxWidth, this.lineHeight(), align);
			} else {
				// Original Processing
				text = _deleteRuby(text);
				_Window_Base_drawText.call(this, text, x, y, maxWidth, align);
			}
		} else {
			// Original Processing
			text = _deleteRuby(text);
			_Window_Base_drawText.call(this, text, x, y, maxWidth, align);
		}
	};
	
	
	//--------------------------------------------------
	// Window_Base.flushTextState
	//  [Modified Definition]
	//--------------------------------------------------
	const _Window_Base_flushTextState = Window_Base.prototype.flushTextState;
	Window_Base.prototype.flushTextState = function(textState) {
		if (this.isRuby()) {
			const text = textState.buffer;
			const rtl = textState.rtl;
	    const width = this.textWidth(_deleteRuby(text));
	    const height = textState.height;
	    const x = rtl ? textState.x - width : textState.x;
	    const y = textState.y;
			if (textState.drawing) {
				// draw text with ruby
				this.drawTextRuby(text, x, y, width, height);
			}
			textState.x += rtl ? -width : width;
			textState.buffer = this.createTextBuffer(rtl);
			const outputWidth = Math.abs(textState.x - textState.startX);
			if (textState.outputWidth < outputWidth) {
				textState.outputWidth = outputWidth;
			}
			textState.outputHeight = y - textState.startY + height;
		} else {
			// Original Processing
			textState.buffer = _deleteRuby(textState.buffer);
			_Window_Base_flushTextState.call(this, textState);
		}
	};
	
	
	//--------------------------------------------------
	// Window_ChoiceList.flushTextState
	//  [Modified Definition]
	//--------------------------------------------------
	const _Window_ChoiceList_flushTextState = Window_ChoiceList.prototype.flushTextState;
	Window_ChoiceList.prototype.flushTextState = function(textState) {
		if (this.isRuby()) {
			const text = textState.text;
			if (text !== _deleteRuby(text)) {
				Window_Base.prototype.flushTextState.call(this, textState);
			} else {
				_Window_Base_flushTextState.call(this, textState);
			}
		} else {
			_Window_ChoiceList_flushTextState.call(this, textState);
		}
	};
	
	
	//--------------------------------------------------
	// Window_Base.convertEscapeCharacters
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	Window_Base.prototype.convertEscapeCharacters = function(text) {
		
		// Original Processing
		text = _Window_Base_convertEscapeCharacters.call(this, text);
		
		// convert ruby text
		text = text.replace(/\{([^\{]+?)\|(.*?)\}/g, "\x1e{$1|$2}");
		
		return text;
		
	};
	
	
	//--------------------------------------------------
	// Window_Base.processControlCharacter
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_Base_processControlCharacter = Window_Base.prototype.processControlCharacter;
	Window_Base.prototype.processControlCharacter = function(textState, c) {
		
		// Original Processing
		_Window_Base_processControlCharacter.call(this, textState, c);
		
		// convert ruby text
		if (c === "\x1e") {
			const regExp = /^\{(.+?)\|(.*?)\}/;
			const result = regExp.exec(textState.text.slice(textState.index));
			if (result) {
				textState.index += result[0].length;
				textState.buffer += result[0];
			}
		}
		
	};
	
	
	//--------------------------------------------------
	// Window_Base.drawCurrencyValue
	//  [Modified Definition]
	//--------------------------------------------------
	const _Window_Base_drawCurrencyValue = Window_Base.prototype.drawCurrencyValue;
	Window_Base.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
		const unitNoRuby = _deleteRuby(unit);
		const isUnitRuby = (unit !== unitNoRuby);
		if (isUnitRuby) {
			const unitWidth = Math.min(80, this.textWidth(unitNoRuby));
			this.resetTextColor();
			this.drawText("{" + value + "|}", x, y, width - unitWidth - 6, "right");
			this.changeTextColor(ColorManager.systemColor());
			this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
		} else {
			_Window_Base_drawCurrencyValue.call(this, value, unit, x, y, width);
		}
	};
	
	
	//--------------------------------------------------
	// Window_ShopNumber.drawMultiplicationSign
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_ShopNumber_drawMultiplicationSign = Window_ShopNumber.prototype.drawMultiplicationSign;
	Window_ShopNumber.prototype.drawMultiplicationSign = function() {
		// adjust y-position in MultiplicationSign
		this._rubyTempOff = true;
		try {
			_Window_ShopNumber_drawMultiplicationSign.call(this);
		} finally {
			this._rubyTempOff = false;
		}
	};
	
	//--------------------------------------------------
	// Window_ShopNumber.drawNumber
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_ShopNumber_drawNumber = Window_ShopNumber.prototype.drawNumber;
	Window_ShopNumber.prototype.drawNumber = function() {
		// adjust y-position in Number
		this._rubyTempOff = true;
		try {
			_Window_ShopNumber_drawNumber.call(this);
		} finally {
			this._rubyTempOff = false;
		}
	};
	
	//--------------------------------------------------
	// Window_NumberInput.drawItem
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_drawItem = Window_NumberInput.prototype.drawItem;
	Window_NumberInput.prototype.drawItem = function(index) {
		// adjust y-position in Number
		this._rubyTempOff = true;
		try {
			_Window_NumberInput_drawItem.call(this, index);
		} finally {
			this._rubyTempOff = false;
		}
	};
	
	
	//--------------------------------------------------
	// Sprite_Name.name
	//  [Modified Definition]
	//--------------------------------------------------
	const _Sprite_Name_name = Sprite_Name.prototype.name;
	Sprite_Name.prototype.name = function() {
		// ruby off in battle actor name
		return _deleteRuby(_Sprite_Name_name.call(this));
	};
	
})();

