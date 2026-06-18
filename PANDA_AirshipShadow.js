//=============================================================================
// PANDA_AirshipShadow.js
//=============================================================================
// [Update History]
// 2025-08-01 Ver.1.0.0 First Release for MZ.
// 2025-08-21 Ver.1.0.1 Bug fix.

/*:
 * @target MZ
 * @plugindesc allows toggling the airship's shadow on or off.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250801180109.html
 * 
 * @help You can control the visibility of the airship's shadow via plugin commands.
 * Use "Hide Airship Shadow" to hide it,
 * and "Show Airship Shadow" to display it again.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command HIDE_AIRSHIP_SHADOW
 * @text Hide Airship Shadow
 * @desc Hides the airship's shadow.
 * 
 * @command SHOW_AIRSHIP_SHADOW
 * @text Show Airship Shadow
 * @desc Shows the airship's shadow as normal.
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 飛行船の影の表示・非表示を切り替えられます。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250801180109.html
 * 
 * @help プラグインコマンドで、飛行船の影の表示状態を制御できます。
 * 「飛行船の影を消去」で影を非表示にし、
 * 「飛行船の影を表示」で再び表示させます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command HIDE_AIRSHIP_SHADOW
 * @text 飛行船の影を消去
 * @desc 飛行船の影を非表示にします。
 * 
 * @command SHOW_AIRSHIP_SHADOW
 * @text 飛行船の影を表示
 * @desc 飛行船の影をデフォルト通りに表示させます。
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 비행선 그림자 표시를 전환할 수 있습니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250801180109.html
 * 
 * @help 플러그인 명령으로 비행선 그림자 표시 여부를 제어할 수 있습니다.
 * "비행선 그림자 숨기기"로 그림자를 숨기고,
 * "비행선 그림자 표시"로 다시 표시할 수 있습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command HIDE_AIRSHIP_SHADOW
 * @text 비행선 그림자 숨기기
 * @desc 비행선 그림자를 숨깁니다.
 * 
 * @command SHOW_AIRSHIP_SHADOW
 * @text 비행선 그림자 표시
 * @desc 비행선 그림자를 기본 상태대로 표시합니다.
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	//--------------------------------------------------
	// Plugin Command "Hidden Airship Shadow"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'HIDE_AIRSHIP_SHADOW', function() {
		$gameMap.airship().hideShadow();
	});
	
	//--------------------------------------------------
	// Plugin Command "Show Airship Shadow"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'SHOW_AIRSHIP_SHADOW', function() {
		$gameMap.airship().showShadow();
	});
	
	
	//--------------------------------------------------
	// Game_Vehicle.initMembers
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Vehicle_initMembers = Game_Vehicle.prototype.initMembers;
	Game_Vehicle.prototype.initMembers = function() {
		_Game_Vehicle_initMembers.call(this);
		this._shadowVisible = true;
	};
	
	//--------------------------------------------------
	// Game_Vehicle.hideShadow
	//  [New Definition]
	//--------------------------------------------------
	Game_Vehicle.prototype.hideShadow = function() {
		this._shadowVisible = false;
	};
	
	//--------------------------------------------------
	// Game_Vehicle.showShadow
	//  [New Definition]
	//--------------------------------------------------
	Game_Vehicle.prototype.showShadow = function() {
		this._shadowVisible = true;
	};
	
	//--------------------------------------------------
	// Game_Vehicle.shadowOpacity
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Vehicle_shadowOpacity = Game_Vehicle.prototype.shadowOpacity;
	Game_Vehicle.prototype.shadowOpacity = function() {
		if (this._shadowVisible === undefined || this._shadowVisible) {
			return _Game_Vehicle_shadowOpacity.call(this);
		} else {
			return 0;
		}
	};
	
})();

