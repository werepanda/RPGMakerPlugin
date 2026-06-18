//=============================================================================
// PANDA_AllEscapedMessage.js
//=============================================================================
// [Update History]
// 2024-08-23 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc change the message when all enemies have escaped.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240823010737.html
 * 
 * @help When all enemies have escaped and the battle has ended,
 * the message specified in the plugin parameter will be displayed
 * instead of the normal victory message.
 * 
 * If even one enemy has been defeated,
 * the normal victory message will be displayed.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param AllEscapedMessage
 * @text Message when all enemies have escaped
 * @desc Specify the message when all enemies have escaped and the battle has ended. Use %1 to display the party name, and %2 to display the troop name.
 * @type text
 * @default The enemies are gone!
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 敵が全員逃げて戦闘が終了した場合のメッセージを変更します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240823010737.html
 * 
 * @help 敵が全員逃げて戦闘が終了した場合、通常の勝利メッセージの代わりに
 * プラグインパラメータで指定したメッセージを表示させます。
 * 1体でも倒した敵がいる場合は、通常の勝利メッセージが表示されます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param AllEscapedMessage
 * @text 全敵逃亡時メッセージ
 * @desc 敵が全員逃げて戦闘が終了した場合のメッセージを指定します。%1でパーティー名、%2で敵グループ名が表示できます。
 * @type text
 * @default 敵はいなくなった！
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 적이 모두 도망치고 전투가 종료된 경우의 메시지를 변경합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240823010737.html
 * 
 * @help 적이 모두 도망치고 전투가 종료된 경우 일반 승리 메시지 대신
 * 플러그인 매개 변수로 지정된 메시지를 표시합니다.
 * 1명이라도 쓰러뜨린 적이 있는 경우에는 일반 승리 메시지가 표시됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param AllEscapedMessage
 * @text 모든 적 도망시 메시지
 * @desc 적이 모두 도망치고 전투가 종료된 경우의 메시지를 지정합니다. %1로 파티명, %2로 적 그룹명을 표시할 수 있습니다.
 * @type text
 * @default 적은 사라졌다!
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const AllEscapedMessage = parameters['AllEscapedMessage'];
	
	//--------------------------------------------------
	// BattleManager.displayVictoryMessage
	//  [Added Definition]
	//--------------------------------------------------
	const _BattleManager_displayVictoryMessage = BattleManager.displayVictoryMessage;
	BattleManager.displayVictoryMessage = function() {
		if ($gameTroop.deadMembers().length > 0) {
			_BattleManager_displayVictoryMessage.call(this);
		} else {
			$gameMessage.add(AllEscapedMessage.format($gameParty.name(), $gameTroop.troop().name));
		}
	};
	
})();

