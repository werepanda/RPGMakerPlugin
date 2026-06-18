//=============================================================================
// PANDA_ExNumberInput.js
//=============================================================================
// [Update History]
// 2022-01-30 Ver.1.0.0 First Release for MZ.
// 2022-03-30 Ver.1.0.1 Bug fix when Touch UI is off.
// 2025-01-04 Ver.1.1.0 Update for digit buttons and button position.

/*:
 * @target MZ
 * @plugindesc enhances the input number window.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220130225458.html
 * 
 * @help [How to Use]
 * In the screen of the event command "Input Number", you can:
 *  - Cancel "Input Number"
 *  - Add a text before and after inputting number
 *  - Set the minimum and maximum values that can be input
 *  - Add buttons to move the input digits (added in v1.1.0)
 * 
 * # Setup Number Input Window
 * Apply the settings to the next Input Number screen.
 * The settings will be reset when the process ends.
 * - Cancel Enabled : If ON, players can cancel the screen with the cancel key.
 * - Cancel Value : Specify the number which will be stored in the variable
 *                  when the Input Number command is canceled.
 * - Prefix Text / Suffix Text :
 *    Specify the text displayed before/after the input number.
 * - Min Value / Max Value :
 *    Directly specify the minimum/maximum value for Input Number.
 *    If you specify the Min Variable / Max Variable, this value is ignored.
 * - Min Variable / Max Variable :
 *    Specify the variable which stores the min/max value for Input Number.
 *    If this is specified, Min Value / Max Value is ignored.
 * 
 * The following are set in the plugin parameters. (Added in v1.1.0)
 * They cannot be changed individually.
 * - Enable Digit Buttons
 *    Specify whether to display the buttons to move the input digits
 *    when entering a value. When set to ON, the buttons will be displayed.
 *    The default is OFF (not displayed).
 * - Hide for 1 digit
 *    Specify whether to hide the digit movement buttons when the input value
 *    is 1 digit. When set to ON, the digit movement buttons will be hidden
 *    when the input value is 1 digit.
 *    When set to OFF, the digit movement buttons will be displayed even when
 *    the input value is 1 digit, but of course there will be no reaction
 *    when the buttons are pressed.
 * - Digit Buttons Position
 *    Choose the position of the digit movement buttons from the following.
 *    The default is Bottom Left.
 *    - Bottom Left  : The digit movement buttons will be displayed to the left
 *                     of the up and down buttons for the numeric values.
 *    - Top Left     : The digit movement buttons will be displayed
 *                     in the top left of the numeric input boxes.
 *    - Top Center   : The digit movement buttons will be displayed
 *                     in the top center of the numeric input boxes.
 * - Cancel Button Position
 *    Choose the position of the cancel button from the following.
 *    The default is Bottom Right.
 *    - Bottom Right : The cancel button will be displayed to the right
 *                     of the up and down buttons and the OK button.
 *    - Top Right    : The cancel button will be displayed in the top right
 *                     of the numeric input boxes.
 * 
 * [Thanks to] Triacontane
 * https://triacontane.blogspot.jp/
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param isDigitEnabled
 * @text Enable Digit Buttons
 * @desc Specify whether to display the buttons to move the input digits.
 * @type boolean
 * @default false
 * 
 * @param HiddenSingleDigit
 * @text Hide for 1 digit
 * @desc Specify whether to hide the digit movement buttons when the input value is 1 digit.
 * @type boolean
 * @default true
 * 
 * @param DigitButtonPosition
 * @text Digit Buttons Position
 * @desc Specify the display position of the digit movement buttons.
 * @default bottomleft
 * @type select
 * @option Bottom Left
 * @value bottomleft
 * @option Top Left
 * @value topleft
 * @option Top Center
 * @value topcenter
 * 
 * @param CancelButtonPosition
 * @text Cancel Button Position
 * @desc Specify the display position of the cancel button.
 * @default bottomright
 * @type select
 * @option Bottom Right
 * @value bottomright
 * @option Top Right
 * @value topright
 * 
 * @command SETUP_NUMBER_INPUT_WINDOW
 * @text Setup Number Input Window
 * @desc Apply the settings to the next Input Number screen. The settings will be reset when the process ends.
 * 
 * @arg isCancelEnabled
 * @text Cancel Enabled
 * @desc Specify whether players can cancel the Input Number command.
 * @type boolean
 * @default false
 * 
 * @arg cancelValue
 * @text Cancel Value
 * @desc Specify the number which will be stored in the variable when the Input Number command is canceled.
 * @type number
 * @default 0
 * @decimals 0
 * 
 * @arg prefixText
 * @text Prefix Text
 * @desc Specify the text displayed before the input number.
 * @type string
 * @default 
 * 
 * @arg suffixText
 * @text Suffix Text
 * @desc Specify the text displayed after the input number.
 * @type string
 * @default 
 * 
 * @arg minValue
 * @text Min Value
 * @desc Directly specify the minimum value for Input Number. If you specify the Min Variable, this value is ignored.
 * @type number
 * @default 0
 * @decimals 0
 * @min 0
 * 
 * @arg maxValue
 * @text Max Value
 * @desc Directly specify the maximum value for Input Number. If you specify the Max Variable, this value is ignored.
 * @type number
 * @default 999999
 * @decimals 0
 * @min 0
 * 
 * @arg minVariable
 * @text Min Variable
 * @desc Specify the variable which stores the minimum value for Input Number. If this is specified, Min Value is ignored.
 * @type variable
 * @default 0
 * 
 * @arg maxVariable
 * @text Max Variable
 * @desc Specify the variable which stores the maximum value for Input Number. If this is specified, Max Value is ignored.
 * @type variable
 * @default 0
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 数値入力ウィンドウを強化するプラグインです。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220130225458.html
 * 
 * @help ■ 使い方
 * イベントコマンド「数値入力の処理」のウィンドウで以下を可能にします。
 *  - 数値入力のキャンセル
 *  - 数値入力の前後に文字列を追加
 *  - 入力可能な数値の最小値・最大値を設定
 *  - 入力桁の移動ボタンを追加（v1.1.0で追加）
 * 
 * ◆ 数値入力ウィンドウ設定
 * プラグインコマンドで設定した内容が、次の数値入力の際に適用されます。
 * 数値入力の処理が終わったら、設定はリセットされます。
 * - キャンセル有効：ONにするとキャンセルキーで数値入力がキャンセルできます。
 * - キャンセル時の値：キャンセルした場合に変数に格納される値を指定します。
 * - 前表示テキスト・後表示テキスト：
 *    数値入力ウィンドウで入力数値の前後に付加するテキストを指定します。
 * - 最小値数値・最大値数値：
 *    数値入力の際の最小値・最大値を数値で直接指定します。
 *    最小値変数・最大値変数を指定した場合、この値は無視されます。
 * - 最小値変数・最大値変数：
 *    数値入力の際の最小値・最大値が格納されている変数を指定します。
 *    これが指定されている場合、最小値数値・最大値数値の指定は無視されます。
 * 
 * 以下はプラグインパラメータで設定します。（v1.1.0で追加）
 * 個別に変更することはできません。
 * - 桁移動ボタン有効
 *    数値入力の際に入力桁の移動ボタンを表示するかどうかを指定します。
 *    ONにするとボタンを表示します。デフォルトはOFF（表示しない）です。
 * - 1桁の場合は非表示
 *    入力数値が1桁の場合に、桁移動ボタンを非表示にするかどうかを指定します。
 *    ONにすると、入力数値が1桁の場合は桁移動ボタンが非表示になります。
 *    OFFにすると、入力数値が1桁でも桁移動ボタンが表示されますが、
 *    当然ボタンを押しても何も反応はありません。
 * - 桁移動ボタン位置
 *    桁移動ボタンを表示する際の表示位置を以下から指定します。
 *    デフォルトは左下です。
 *    - 左下：数値の上下ボタンの左に桁移動ボタンを表示します。
 *    - 左上：数値入力ボックスの左上にに桁移動ボタンを表示します。
 *    - 上部中央：数値入力ボックスの上部中央に桁移動ボタンを表示します。
 * - キャンセルボタン位置
 *    キャンセルボタンを表示する際の表示位置を以下から指定します。
 *    デフォルトは右下です。
 *    - 右下：数値の上下ボタンや決定ボタンの右にキャンセルボタンを表示します。
 *    - 右上：数値入力ボックスの右上ににキャンセルボタンを表示します。
 * 
 * ■ Thanks to トリアコンタン(Triacontane)
 * https://triacontane.blogspot.jp/
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param isDigitEnabled
 * @text 桁移動ボタン有効
 * @desc 数値入力の際に入力桁の移動ボタンを表示するかどうかを指定します。
 * @type boolean
 * @default false
 * 
 * @param HiddenSingleDigit
 * @text 1桁の場合は非表示
 * @desc 入力数値が1桁の場合に、桁移動ボタンを非表示にするかどうかを指定します。
 * @type boolean
 * @default true
 * 
 * @param DigitButtonPosition
 * @text 桁移動ボタン位置
 * @desc 桁移動ボタンの表示位置を指定します。
 * @default bottomleft
 * @type select
 * @option 左下
 * @value bottomleft
 * @option 左上
 * @value topleft
 * @option 上部中央
 * @value topcenter
 * 
 * @param CancelButtonPosition
 * @text キャンセルボタン位置
 * @desc キャンセルボタンを表示する際の表示位置を指定します。
 * @default bottomright
 * @type select
 * @option 右下
 * @value bottomright
 * @option 右上
 * @value topright
 * 
 * @command SETUP_NUMBER_INPUT_WINDOW
 * @text 数値入力ウィンドウ設定
 * @desc 次の数値入力の処理コマンドの際に設定した効果を適用させます。処理終了後に設定はリセットされます。
 * 
 * @arg isCancelEnabled
 * @text キャンセル有効
 * @desc 数値入力をキャンセルできるかどうかを指定します。
 * @type boolean
 * @default false
 * 
 * @arg cancelValue
 * @text キャンセル時の値
 * @desc 数値入力をキャンセルした場合に変数に格納される値を指定します。
 * @type number
 * @default 0
 * @decimals 0
 * @min -1
 * 
 * @arg prefixText
 * @text 前表示テキスト
 * @desc 数値入力ウィンドウで入力数値の前に付加するテキストを指定します。
 * @type string
 * @default 
 * 
 * @arg suffixText
 * @text 後表示テキスト
 * @desc 数値入力ウィンドウで入力数値の後に付加するテキストを指定します。
 * @type string
 * @default 
 * 
 * @arg minValue
 * @text 最小値数値
 * @desc 数値入力の際の最小値を数値で直接指定します。最小値変数を指定した場合、この値は無視されます。
 * @type number
 * @default 0
 * @decimals 0
 * @min 0
 * 
 * @arg maxValue
 * @text 最大値数値
 * @desc 数値入力の際の最大値を数値で直接指定します。最大値変数を指定した場合、この値は無視されます。
 * @type number
 * @default 999999
 * @decimals 0
 * @min 0
 * 
 * @arg minVariable
 * @text 最小値変数
 * @desc 数値入力の際の最小値が格納されている変数を指定します。これが指定されている場合、最小値数値の指定は無視されます。
 * @type variable
 * @default 0
 * 
 * @arg maxVariable
 * @text 最大値変数
 * @desc 数値入力の際の最大値が格納されている変数を指定します。これが指定されている場合、最大値数値の指定は無視されます。
 * @type variable
 * @default 0
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 숫자 입력 윈도우를 강화하는 플러그인입니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220130225458.html
 * 
 * @help [사용법]
 * 이벤트 명령 [숫자 입력 처리] 윈도우에서 이하를 가능케 합니다.
 *  - 숫자 입력 취소
 *  - 숫자 입력 전후에 텍스트 추가
 *  - 입력 가능한 수치의 최소치/최대치를 설정
 *  - 입력 자리 이동 버튼 추가 (v1.1.0에서 추가)
 * 
 * * 숫자 입력 윈도우 설정
 * 다음 [숫자 입력 처리] 윈도우에 설정한 효과를 적용시킵니다.
 * 처리가 끝나면 설정이 소거됩니다.
 * - 취소 유효 : ON으로 하면 취소 버튼으로 숫자 입력을 취소할 수 있습니다.
 * - 취소시 값 : 숫자 입력을 취소할 때 변수에 저장되는 수치를 지정합니다.
 * - 앞 표시 텍스트 / 뒤 표시 텍스트 :
 *    숫자 입력 윈도우에서 입력 숫자 전후에 추가할 텍스트를 지정합니다.
 * - 최소치 수치 / 최대치 수치 :
 *    숫자 입력시의 최소치/최대치를 수치로 직접 지정합니다.
 *    최소치 변수/최대치 변수를 지정하면 이 값은 무시됩니다.
 * - 최소치 변수 / 최대치 변수 :
 *    숫자 입력시의 최소치/최대치가 저장된 변수를 지정합니다.
 *    이것이 지정되면, 최소치 수치/최대치 수치의 지정은 무시됩니다.
 * 
 * 다음은 플러그인 매개 변수로 설정합니다. (v1.1.0에서 추가)
 * 개별적으로 변경할 수는 없습니다.
 * - 자리 이동 버튼 유효
 *    숫자 입력시 입력 자리 이동 버튼을 표시할지 여부를 자정합니다.
 *    ON으로 하면 버튼을 표시합니다. 기본값은 OFF(표시하지 않음)입니다.
 * - 한 자리인 경우 숨기기
 *    입력 숫자가 한 자리인 경우 자리 이동 버튼을 숨길지 여부를 지정합니다.
 *    ON으로 하면 입력 수치가 한 자리인 경우에는 자리 이동 버튼이 표시되지
 *    않습니다. OFF로 하면 입력 수치가 한 자리일지라도 자리 이동 버튼이
 *    표시됩니다만, 당연히 버튼을 눌러도 아무 반응도 없습니다.
 * - 자리 이동 버튼 위치
 *    자리 이동 버튼을 표시할 때의 표시 위치를 다음에서 지정합니다.
 *    기본값은 왼쪽 하단입니다.
 *    - 왼쪽 하단 : 수치 상하 버튼의 왼쪽에 자리 이동 버튼을 표시합니다.
 *    - 왼쪽 상단 : 숫자 입력 상자의 상단 왼쪽에 자리 이동 버튼을 표시합니다.
 *    - 상단 중앙 : 숫자 입력 상자의 상단 중앙에 자리 이동 버튼을 표시합니다.
 * - 취소 버튼 위치
 *    취소 버튼을 표시할 때의 표시 위치를 다음에서 지정합니다.
 *    기본값은 오른쪽 하단입니다.
 *    - 오른쪽 하단 : 수치 상하 및 결정 버튼 오른쪽에 취소 버튼을 표시합니다.
 *    - 오른쪽 상단 : 숫자 입력 상자의 상단 오른쪽에 취소 버튼을 표시합니다.
 * 
 * [Thanks to] Triacontane
 * https://triacontane.blogspot.jp/
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param isDigitEnabled
 * @text 자리 이동 버튼 유효
 * @desc 숫자 입력시 입력 자리 이동 버튼을 표시할지 여부를 자정합니다.
 * @type boolean
 * @default false
 * 
 * @param HiddenSingleDigit
 * @text 한 자리인 경우 숨기기
 * @desc 입력 숫자가 한 자리인 경우 자리 이동 버튼을 숨길지 여부를 지정합니다.
 * @type boolean
 * @default true
 * 
 * @param DigitButtonPosition
 * @text 자리 이동 버튼 위치
 * @desc 자리 이동 버튼을 표시할 때의 표시 위치를 지정합니다.
 * @default bottomleft
 * @type select
 * @option 왼쪽 하단
 * @value bottomleft
 * @option 왼쪽 상단
 * @value topleft
 * @option 상단 중앙
 * @value topcenter
 * 
 * @param CancelButtonPosition
 * @text 취소 버튼 위치
 * @desc 취소 버튼을 표시할 때의 표시 위치를 지정합니다.
 * @default bottomright
 * @type select
 * @option 오른쪽 하단
 * @value bottomright
 * @option 오른쪽 상단
 * @value topright
 * 
 * @command SETUP_NUMBER_INPUT_WINDOW
 * @text 숫자 입력 윈도우 설정
 * @desc 다음 [숫자 입력 처리] 윈도우에 설정한 효과를 적용시킵니다. 처리가 끝나면 설정이 소거됩니다.
 * 
 * @arg isCancelEnabled
 * @text 취소 유효
 * @desc 숫자 입력을 취소할 수 있는지를 지정합니다.
 * @type boolean
 * @default false
 * 
 * @arg cancelValue
 * @text 취소시 값
 * @desc 숫자 입력을 취소할 때 변수에 저장되는 수치를 지정합니다.
 * @type number
 * @default 0
 * @decimals 0
 * 
 * @arg prefixText
 * @text 앞 표시 텍스트
 * @desc 숫자 입력 윈도우에서 입력 숫자 앞에 추가할 텍스트를 지정합니다.
 * @type string
 * @default 
 * 
 * @arg suffixText
 * @text 뒤 표시 텍스트
 * @desc 숫자 입력 윈도우에서 입력 숫자 뒤에 추가할 텍스트를 지정합니다.
 * @type string
 * @default 
 * 
 * @arg minValue
 * @text 최소치 수치
 * @desc 숫자 입력시의 최소치를 수치로 직접 지정합니다. 최소치 변수를 지정하면 이 값은 무시됩니다.
 * @type number
 * @default 0
 * @decimals 0
 * @min 0
 * 
 * @arg maxValue
 * @text 최대치 수치
 * @desc 숫자 입력시의 최대치를 수치로 직접 지정합니다. 최대치 변수를 지정하면 이 값은 무시됩니다.
 * @type number
 * @default 999999
 * @decimals 0
 * @min 0
 * 
 * @arg minVariable
 * @text 최소치 변수
 * @desc 숫자 입력시의 최소치가 저장된 변수를 지정합니다. 이것이 지정되면, 최소치 수치의 지정은 무시됩니다.
 * @type variable
 * @default 0
 * 
 * @arg maxVariable
 * @text 최대치 변수
 * @desc 숫자 입력시의 최대치가 저장된 변수를 지정합니다. 이것이 지정되면, 최대치 수치의 지정은 무시됩니다.
 * @type variable
 * @default 0
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const isDigitEnabled = (parameters['isDigitEnabled'] === 'true');
	const HiddenSingleDigit = (parameters['HiddenSingleDigit'] !== 'false');
	const DigitButtonPosition = parameters['DigitButtonPosition'] || 'bottomleft';
	const CancelButtonPosition = parameters['CancelButtonPosition'] || 'bottomright';
	
	
	//--------------------------------------------------
	// Plugin Command "Setup Number Input Window"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'SETUP_NUMBER_INPUT_WINDOW', function(args) {
		
		// get arguments
		const isCancelEnabled = (args['isCancelEnabled'] !== 'false');
		const cancelValue = parseInt(args['cancelValue']) || 0;
		const prefixText = args['prefixText'];
		const suffixText = args['suffixText'];
		const minVariable = parseInt(args['minVariable']) || 0;
		const maxVariable = parseInt(args['maxVariable']) || 0;
		const minValue = minVariable > 0 ? $gameVariables.value(minVariable) : (parseInt(args['minValue']) || 0);
		const maxValue = maxVariable > 0 ? $gameVariables.value(maxVariable) : (parseInt(args['maxValue']) || 0);
		
		// set parameters
		$gameSystem.setExNumberInput(isCancelEnabled, cancelValue, prefixText, suffixText, minValue, maxValue);
		
	});
	
	
	//--------------------------------------------------
	// Game_System.setExNumberInput
	//  [New Definition]
	//--------------------------------------------------
	Game_System.prototype.setExNumberInput = function(isCancelEnabled, cancelValue, prefixText, suffixText, minValue, maxValue) {
		this._numberInputSettings = {
			isCancelEnabled: isCancelEnabled,
			cancelValue: cancelValue,
			prefixText: prefixText,
			suffixText: suffixText,
			minValue: minValue,
			maxValue: maxValue
		};
	}
	
	//--------------------------------------------------
	// Game_System.clearExNumberInput
	//  [New Definition]
	//--------------------------------------------------
	Game_System.prototype.clearExNumberInput = function() {
		this._numberInputSettings = null;
	}
	
	//--------------------------------------------------
	// Game_System.getExNumberInput
	//  [New Definition]
	//--------------------------------------------------
	Game_System.prototype.getExNumberInput = function() {
		return this._numberInputSettings;
	}
	
	
	//--------------------------------------------------
	// Window_NumberInput.initialize
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_initialize = Window_NumberInput.prototype.initialize;
	Window_NumberInput.prototype.initialize = function() {
		this._isDigitEnabled = isDigitEnabled;
		this._hiddenSingleDigit = HiddenSingleDigit;
		this._digitButtonPosition = DigitButtonPosition;
		this._cancelButtonPosition = CancelButtonPosition;
		_Window_NumberInput_initialize.call(this);
		this.applySettings();
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.applySettings
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.applySettings = function() {
		const settings = $gameSystem.getExNumberInput();
		if (settings) {
			this._isCancelEnabled = settings.isCancelEnabled;
			this._cancelValue = settings.cancelValue;
			this._prefixText = settings.prefixText;
			this._suffixText = settings.suffixText;
			//this.setupButtons();
		} else {
			this._isCancelEnabled = false;
			this._cancelValue = 0;
			this._prefixText = '';
			this._suffixText = '';
			//this.setupButtons();
		}
	};
	
	//--------------------------------------------------
	// Window_NumberInput.applyMinMax
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.applyMinMax = function() {
		const settings = $gameSystem.getExNumberInput();
		if (settings) {
			if (this._number < settings.minValue) {
				this._number = settings.minValue;
				this.refresh();
			} else if (this._number > settings.maxValue) {
				this._number = settings.maxValue;
				this.refresh();
			}
		}
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.start
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_start = Window_NumberInput.prototype.start;
	Window_NumberInput.prototype.start = function() {
		this.applySettings();
		_Window_NumberInput_start.call(this);
		this.applyMinMax();
	};
	
	//--------------------------------------------------
	// Window_NumberInput.changeDigit
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_changeDigit = Window_NumberInput.prototype.changeDigit;
	Window_NumberInput.prototype.changeDigit = function(up) {
		_Window_NumberInput_changeDigit.call(this, up);
		this.applyMinMax();
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.createButtons
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_createButtons = Window_NumberInput.prototype.createButtons;
	Window_NumberInput.prototype.createButtons = function() {
		_Window_NumberInput_createButtons.call(this);
		if (ConfigManager.touchUI) {
			// Cancel Button
			const button = new Sprite_Button('cancel');
			this._cancelButton = button;
			this._cancelButton.visible = false;
			this.addInnerChild(button);
			this._cancelButton.setClickHandler(this.onButtonCancel.bind(this));
			// Digit Buttons
			if (this.isDigitEnabled()) {
				// left button
				const lButton = new Sprite_Button('pageup');
				this._digitUpButton = lButton;
				this._digitUpButton.visible = false;
				this.addInnerChild(lButton);
				this._digitUpButton.setClickHandler(this.onButtonDigitUp.bind(this));
				// right button
				const rButton = new Sprite_Button('pagedown');
				this._digitDownButton = rButton;
				this._digitDownButton.visible = false;
				this.addInnerChild(rButton);
				this._digitDownButton.setClickHandler(this.onButtonDigitDown.bind(this));
			}
		}
	};
	
	//--------------------------------------------------
	// Window_NumberInput.setupButtons
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.setupButtons = function() {
		if (ConfigManager.touchUI) {
			this._cancelButton.visible = this.isCancelEnabled();
			if (this.isDigitEnabled()) {
				this._digitUpButton.visible = this.visibleDigitButton();
				this._digitDownButton.visible = this.visibleDigitButton();
			}
		}
	};
	
	//--------------------------------------------------
	// Window_NumberInput.placeButtons
	//  [Modified Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.placeButtons = function() {
		this.setupButtons();
		const sp = this.buttonSpacing();
		const totalWidth = this.totalButtonWidth();
		let x = (this.innerWidth - totalWidth) / 2;
		// digit buttons
		if (ConfigManager.touchUI && this.visibleDigitButton()) {
			if (this.digitButtonPosition() === 'bottomleft') {
				this._digitUpButton.x = x;
				this._digitUpButton.y = this.buttonY();
				x += this._digitUpButton.width + sp;
				this._digitDownButton.x = x;
				this._digitDownButton.y = this.buttonY();
				x += this._digitDownButton.width + sp;
			}
			if (this.digitButtonPosition().startsWith('top')) {
				this._digitUpButton.y = 0;
				this._digitDownButton.y = 0;
				let dx = 0;
				if (this.digitButtonPosition() === 'topcenter') {
					const dw = this._digitUpButton.width + sp + this._digitDownButton.width;
					dx = (this.innerWidth - dw) / 2;
				}
				this._digitUpButton.x = dx;
				dx += this._digitUpButton.width + sp;
				this._digitDownButton.x = dx;
				dx += this._digitDownButton.width + sp;
			}
		}
		// up, down and ok buttons
		for (const button of this._buttons) {
			button.x = x;
			button.y = this.buttonY();
			x += button.width + sp;
		}
		// cancel button
		if (ConfigManager.touchUI && this.isCancelEnabled()) {
			if (this.cancelButtonPosition() === 'bottomright') {
				this._cancelButton.x = x;
				this._cancelButton.y = this.buttonY();
				x += this._cancelButton.width + sp;
			} else if (this.cancelButtonPosition() === 'topright') {
				this._cancelButton.x = this.innerWidth - this._cancelButton.width;
				this._cancelButton.y = 0;
			}
		}
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.refresh
	//  [Additional Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.refresh = function() {
		Window_Selectable.prototype.refresh.call(this);
		this.drawPrefix();
		this.drawSuffix();
	};
	
	//--------------------------------------------------
	// Window_NumberInput.drawPrefix
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.drawPrefix = function() {
		if (this._prefixText != '') {
			const text = this._prefixText;
			const size = this.textSizeEx(text);
			const width = size.width;
			const x = 0;
			const y = this.itemTop() + (this.itemHeight() - size.height) / 2;
			this.resetTextColor();
			this.drawTextEx(text, x, y, width);
		}
	};
	
	//--------------------------------------------------
	// Window_NumberInput.drawSuffix
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.drawSuffix = function() {
		if (this._suffixText != '') {
			const text = this._suffixText;
			const size = this.textSizeEx(text);
			const width = size.width;
			const x = this.windowWidth() - width - this.padding * 2;
			const y = this.itemTop() + (this.itemHeight() - size.height) / 2;
			this.resetTextColor();
			this.drawTextEx(text, x, y, width);
		}
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.windowWidth
	//  [Modified Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.windowWidth = function() {
		const totalUpperWidth = this.totalUpperWidth();
		const totalItemWidth = this.totalItemWidth();
		const totalButtonWidth = this.totalButtonWidth();
		return Math.max(totalUpperWidth, totalItemWidth, totalButtonWidth) + this.padding * 2;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.windowHeight
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_windowHeight = Window_NumberInput.prototype.windowHeight;
	Window_NumberInput.prototype.windowHeight = function() {
		const h = _Window_NumberInput_windowHeight.call(this);
		if (ConfigManager.touchUI && this.totalUpperWidth() > 0) {
			return this.itemTop() + h;
		} else {
			return h;
		}
	};
	
	//--------------------------------------------------
	// Window_NumberInput.itemTop
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.itemTop = function() {
		return this.totalUpperWidth() > 0 ? 48 + this.buttonSpacing() : 0;
	}
	
	//--------------------------------------------------
	// Window_NumberInput.totalItemWidth
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.totalItemWidth = function() {
		return this.prefixWidth() + this.maxCols() * this.itemWidth() + this.suffixWidth();
	};
	
	//--------------------------------------------------
	// Window_NumberInput.prefixWidth
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.prefixWidth = function() {
		return this._prefixText == '' ? 0 : this.textSizeEx(this._prefixText).width + 8;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.suffixWidth
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.suffixWidth = function() {
		return this._suffixText == '' ? 0 : this.textSizeEx(this._suffixText).width + 8;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.totalButtonWidth
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_totalButtonWidth = Window_NumberInput.prototype.totalButtonWidth;
	Window_NumberInput.prototype.totalButtonWidth = function() {
		const sp = this.buttonSpacing();
		let w = _Window_NumberInput_totalButtonWidth.call(this);
		if (ConfigManager.touchUI) {
			if (this.isCancelEnabled()) {
				if (this.cancelButtonPosition().startsWith('bottom')) {
					w += this._cancelButton.width + sp;
				}
			}
			if (this.visibleDigitButton()) {
				if (this.digitButtonPosition().startsWith('bottom')) {
					w += this._digitUpButton.width + sp;
					w += this._digitDownButton.width + sp;
				}
			}
		}
		return w;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.totalUpperWidth
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.totalUpperWidth = function() {
		const sp = this.buttonSpacing();
		let w = -sp;
		if (ConfigManager.touchUI) {
			if (this.visibleDigitButton()) {
				if (this.digitButtonPosition().startsWith('top')) {
					w += this._digitUpButton.width + sp;
					w += this._digitDownButton.width + sp;
				}
			}
			if (this.isCancelEnabled()) {
				if (this.cancelButtonPosition().startsWith('top')) {
					w += this._cancelButton.width + sp;
				}
				if (this.visibleDigitButton() && this.digitButtonPosition() === 'topcenter') {
					w += this._cancelButton.width + sp;
				}
			}
		}
		return w;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.buttonY
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_buttonY = Window_NumberInput.prototype.buttonY;
	Window_NumberInput.prototype.buttonY = function() {
		return this.itemTop() + _Window_NumberInput_buttonY.call(this);
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.itemRect
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_itemRect = Window_NumberInput.prototype.itemRect;
	Window_NumberInput.prototype.itemRect = function(index) {
		const rect = _Window_NumberInput_itemRect.call(this, index);
		rect.x += (this.prefixWidth() - this.suffixWidth()) / 2;
		rect.y += this.itemTop();
		return rect;
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.isCancelEnabled
	//  [Modified Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.isCancelEnabled = function() {
		return this._isCancelEnabled;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.cancelButtonPosition
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.cancelButtonPosition = function() {
		return this._cancelButtonPosition;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.onButtonCancel
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.onButtonCancel = function() {
		this.processCancel();
	}
	
	//--------------------------------------------------
	// Window_NumberInput.processCancel
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.processCancel = function() {
		$gameVariables.setValue($gameMessage.numInputVariableId(), this._cancelValue);
		Window_Selectable.prototype.processCancel.call(this);
    this._messageWindow.terminateMessage();
    this.updateInputData();
    this.deactivate();
    this.close();
    $gameSystem.clearExNumberInput();
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.processOk
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_NumberInput_processOk = Window_NumberInput.prototype.processOk;
	Window_NumberInput.prototype.processOk = function() {
		_Window_NumberInput_processOk.call(this);
		$gameSystem.clearExNumberInput();
	};
	
	
	//--------------------------------------------------
	// Window_NumberInput.isDigitEnabled
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.isDigitEnabled = function() {
		//return this._isDigitEnabled && !(this._maxDigits <= 1 && this._hiddenSingleDigit);
		return this._isDigitEnabled;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.visibleDigitButton
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.visibleDigitButton = function() {
		return this.isDigitEnabled() && (this._maxDigits > 1 || !this._hiddenSingleDigit);
	};
	
	//--------------------------------------------------
	// Window_NumberInput.digitButtonPosition
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.digitButtonPosition = function() {
		return this._digitButtonPosition;
	};
	
	//--------------------------------------------------
	// Window_NumberInput.onButtonDigitUp
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.onButtonDigitUp = function() {
		const lastIndex = this.index();
		this.cursorLeft(true);
    if (this.index() !== lastIndex) {
        this.playCursorSound();
    }
	}
	
	//--------------------------------------------------
	// Window_NumberInput.onButtonDigitDown
	//  [New Definition]
	//--------------------------------------------------
	Window_NumberInput.prototype.onButtonDigitDown = function() {
		const lastIndex = this.index();
		this.cursorRight(true);
    if (this.index() !== lastIndex) {
        this.playCursorSound();
    }
	}
	
	
})();

