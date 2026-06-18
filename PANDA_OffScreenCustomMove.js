//=============================================================================
// PANDA_OffScreenCustomMove.js
//=============================================================================
// [Update History]
// 2023-11-07 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc if autonomous movement is "Custom", events move even off screen.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231107221524.html
 * 
 * @help A standard feature of RPG Maker is that events that are far away from
 * the display screen will not move autonomously to reduce the load.
 * This plugin makes events whose autonomous movement is set to "Custom"
 * move even if they are far away from the screen range.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 画面外のイベントでも自律移動が「カスタム」の場合は動くようにします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231107221524.html
 * 
 * @help RPGツクールの標準機能では、負荷軽減のため、
 * 表示画面範囲から遠く離れたイベントは、自律移動しないようになっています。
 * このプラグインを導入すると、自律移動が「カスタム」に指定されているイベントは
 * 画面範囲から遠く離れていても移動するようになります。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 화면 밖의 이벤트라도 자율 이동이 "커스텀"이면 움직이도록 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231107221524.html
 * 
 * @help RPG Maker의 표준 기능으로는 부하 경감을 위해
 * 표시 화면 범위에서 멀리 떨어진 이벤트는 자율 이동을 하지 않습니다.
 * 이 플러그인을 도입하면, 자율 이동이 "커스텀"으로 지정된 이벤트는
 * 화면 범위에서 멀리 떨어져 있어도 이동하게 됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_CharacterBase.isNearTheScreen
	//  [Modified Definition]
	//--------------------------------------------------
	const _Game_CharacterBase_isNearTheScreen = Game_CharacterBase.prototype.isNearTheScreen;
	Game_CharacterBase.prototype.isNearTheScreen = function() {
		return (this._moveType === 3) || _Game_CharacterBase_isNearTheScreen.call(this);
	};
	
})();

