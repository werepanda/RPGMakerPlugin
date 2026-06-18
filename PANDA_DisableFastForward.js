//=============================================================================
// PANDA_DisableFastForward.js
//=============================================================================
// [Update History]
// 2025-11-23 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc when the switch is ON, disables fast forwarding by pressing OK button.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251123183613.html
 * 
 * @help When the switch which is specified in the plugin parameter is ON,
 * the fast forwarding function by holding down the OK key will be disabled.
 * 
 * This applies to event commands except for "Show Scrolling Text",
 * and the battle log.
 * You can control "Show Scrolling Text" with "No Fast Forward" option.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param DisableSwitch
 * @text Disable Switch
 * @desc Specifies a switch to prohibit fast forwarding. When this switch is ON, fast forwarding will be disabled.
 * @type switch
 * @default 0
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc スイッチがONの時は決定キー押しっぱなしによる早送りを禁止します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251123183613.html
 * 
 * @help プラグインパラメータで指定されたスイッチがONの時は、
 * 決定キーの押しっぱなしによるイベント高速化機能を無効にします。
 * 
 * 「文章のスクロール表示」以外のイベントコマンドと戦闘ログが対象です。
 * 「文章のスクロール表示」はオプションの「早送りなし」で制御してください。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param DisableSwitch
 * @text 禁止スイッチ
 * @desc 早送りを禁止にするスイッチを指定します。このスイッチがONの時、決定キー押しっぱなしによる高速化が無効化されます。
 * @type switch
 * @default 0
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 스위치가 ON일 때는 확인 버튼을 눌러 고속화하는 기능을 무효로 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251123183613.html
 * 
 * @help 플러그인 매개 변수에서 지정된 스위치가 ON일 때에는,
 * 확인 버튼을 눌러 이벤트를 고속화하는 기능을 무효로 합니다.
 * 
 * "텍스트의 스크롤 표시" 이외의 이벤트 명령과 전투 로그가 대상입니다.
 * "텍스트의 스크롤 표시"는 옵션의 "빨리 돌리기 없음"으로 제어하시기 바랍니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param DisableSwitch
 * @text 금지 스위치
 * @desc 고속화를 금지할 스위치를 지정합니다. 이 스위치가 ON이면, 확인 버튼을 눌러 이벤트를 고속화하는 기능이 무효화됩니다.
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
	const DisableSwitchID = parameters['DisableSwitch'] || 0;
	
	//--------------------------------------------------
	// Scene_Map.isFastForward
	//  [Added Definition]
	//--------------------------------------------------
	const _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
	Scene_Map.prototype.isFastForward = function() {
		if (DisableSwitchID > 0 && $gameSwitches.value(DisableSwitchID)) {
			return false;
		} else {
			return _Scene_Map_isFastForward.call(this);
		}
	};
	
	//--------------------------------------------------
	// Window_BattleLog.isFastForward
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_BattleLog_isFastForward = Window_BattleLog.prototype.isFastForward;
	Window_BattleLog.prototype.isFastForward = function() {
		if (DisableSwitchID > 0 && $gameSwitches.value(DisableSwitchID)) {
			return false;
		} else {
			return _Window_BattleLog_isFastForward.call(this);
		}
	};
	
})();

