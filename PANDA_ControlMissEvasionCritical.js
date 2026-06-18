//=============================================================================
// PANDA_ControlMissEvasionCritical.js
//=============================================================================
// [Update History]
// 2022-07-13 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc control with a switch if misses, evasions, critical hits can occur.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220713021551.html
 * 
 * @help [How to Use]
 * Only when the switch specified by the plug-in parameter is ON,
 * misses in attacks, evasions, and critical hits will occur.
 * 
 * When the specified switch is OFF, hit rate is 100%,
 * evasion rate, critical rate, critical evasion rate,
 * and magic evasion rate are 0% for both Actors and Enemies.
 * 
 * The expected usage is as follows:
 * Prevent misses or critical hits in battles at the beginning of the game,
 * turn on the switch after a certain number of battles or after the story has
 * progressed to some level, and misses or critical hits will occur.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param AllowSwitch
 * @text Allow Switch
 * @desc Specifies a switch which allows misses, evasions, and critical hits. When this switch is ON, they will occur.
 * @type switch
 * @default 0
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 攻撃におけるミス、回避、会心の一撃の発生をスイッチで制御します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220713021551.html
 * 
 * @help ■ 使い方
 * プラグインパラメータで指定したスイッチがONの場合に限り、
 * 攻撃のミスや回避、会心の一撃が発生するようにします。
 * 
 * 指定したスイッチがOFFの場合は、アクター、エネミーとも、
 * 命中率が100%、回避率、会心率、会心回避率、魔法回避率が0%になります。
 * 
 * ゲーム開始序盤の戦闘でいきなり攻撃ミスや会心の一撃が起きないようにし、
 * 一定の戦闘回数を経たり、ある程度ストーリーが進んだ後に、スイッチをONにして、
 * 攻撃ミスや会心の一撃が起きるようにする使い方を想定しています。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param AllowSwitch
 * @text 許可スイッチ
 * @desc ミス、回避、会心の一撃の発生を許可するスイッチを指定します。このスイッチがONの場合に、ミス、回避、会心が発生します。
 * @type switch
 * @default 0
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 공격에서 실수, 회피, 치명타 발생을 스위치로 제어합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220713021551.html
 * 
 * @help [사용법]
 * 플러그인 매개 변수로 지정한 스위치가 ON인 경우에만
 * 공격의 실수나 회피, 치명타가 발생하도록 합니다.
 * 
 * 지정한 스위치가 OFF인 경우, 액터, 적 캐릭터 모두, 명중률이 100%,
 * 회피율, 치명률,치명타 회피, 마법 회피가 0%가 됩니다.
 * 
 * 게임 개시 초반의 전투에서 갑자기 공격 미스나 치명타가 일어나지 않게 하고,
 * 일정한 전투 횟수를 거치거나 어느 정도 스토리가 진행된 후에,
 * 스위치를 ON으로 하고, 공격 미스나 치명타가 일어나게 하는 사용법이 상정됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param AllowSwitch
 * @text 허가 스위치
 * @desc 실수, 회피, 치명타 발생을 허용하는 스위치를 지정합니다. 이 스위치가 ON이면, 실수, 회피, 치명타가 발생합니다.
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
	const AllowSwitchID = parameters['AllowSwitch'] || 0;
	
	
	//--------------------------------------------------
	// Game_BattlerBase.xparam
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
	Game_BattlerBase.prototype.xparam = function(xparamId) {
		if (AllowSwitchID === 0 || $gameSwitches.value(AllowSwitchID)) {
			// when Allow Switch is not set or Allow Switch is On.
			return _Game_BattlerBase_xparam.call(this, xparamId);
		} else {
			// when Allow Switch is Off.
			switch (xparamId) {
				case 0: // HIT rate
					return 100;
				case 1: // Evasion rate
					return 0;
				case 2: // Critical rate
					return 0;
				case 3: // Critical Evasion rate
					return 0;
				case 4: // Magic Evasion rate
					return 0;
				default: // others
					return _Game_BattlerBase_xparam.call(this, xparamId);
			}
		}
	};
	
})();

