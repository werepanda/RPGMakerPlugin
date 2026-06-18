//=============================================================================
// PANDA_DisableCancelMessageWait.js
//=============================================================================
// [Update History]
// 2024-01-16 Ver.0.9.0 Beta Release for MZ.
// 2024-01-17 Ver.1.0.0 Regular Release for MZ.

/*:
 * @target MZ
 * @plugindesc disables the message wait cancel function implemented in v1.8.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240116214631.html
 * 
 * @help Disables the function added in RPG Maker MZ Version 1.8.0
 * that cancels message wait while executing double-speed processing of events
 * while holding down the OK key.
 * 
 * While the specified switch is ON, message wait is enabled even while
 * event double-speed processing is being executed using the OK key.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param EnableSwitch
 * @text Enable Switch
 * @desc Specifies a switch to enable message wait even during high speed process. When this switch is ON, waits are enabled.
 * @type switch
 * @default 0
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc v1.8で実装されたメッセージのウェイト無効化機能を無効化します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240116214631.html
 * 
 * @help RPGツクールMZ バージョン1.8.0で追加された、
 * 決定キーを押している間のイベントの倍速処理の実行中に、
 * メッセージのウェイトを無効化する機能を、無効にします。
 * 
 * 指定したスイッチがONである間は、
 * 決定キーでイベント倍速処理の実行中も、メッセージのウェイトが有効になります。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param EnableSwitch
 * @text 許可スイッチ
 * @desc 倍速処理中もメッセージのウェイトを有効にするスイッチを指定します。このスイッチがONの時、ウェイトが有効化されます。
 * @type switch
 * @default 0
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc v1.8로 구현된 메시지 웨이트 무효화 기능을 무효로 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240116214631.html
 * 
 * @help RPG Maker MZ 버전 1.8.0에서 추가된,
 * 결정 키를 누르고 있는 동안 이벤트 배속 처리를 수행하는 중,
 * 메시지 웨이트를 무효화하는 기능을 비활성화합니다.
 * 
 * 지정한 스위치가 ON인 동안,
 * 결정 키로 이벤트 배속 처리가 실행되는 동안에도 메시지 웨이트가 유효화됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param EnableSwitch
 * @text 허가 스위치
 * @desc 배속 처리중에도 메시지 웨이트를 유효회할 스위치를 지정합니다. 이 스위치가 ON이면, 웨이트가 유효화됩니다.
 * @type switch
 * @default 0
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const EnableSwitchID = parameters['EnableSwitch'] || 0;
	
	//--------------------------------------------------
	// Window_Message.cancelWait
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_Message_cancelWait = Window_Message.prototype.cancelWait;
	Window_Message.prototype.cancelWait = function() {
		if (EnableSwitchID > 0 && $gameSwitches.value(EnableSwitchID)) {
		} else {
			_Window_Message_cancelWait.call(this);
		}
	};
	
})();

