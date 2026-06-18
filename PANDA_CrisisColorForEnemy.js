//=============================================================================
// PANDA_CrisisColorForEnemy.js
//=============================================================================
// [Update History]
// 2024-11-25 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc apply the text color when in a pinch to enemy names.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20241125220213.html
 * 
 * @help In the enemy select window in battle, the enemy names with low HP
 * will be displayed in the same text color used when in a pinch as the actor.
 * 
 * Can also use in conjunction with the plugin PANDA_CrisisColorTo2Levels.js
 * which divides the text color when in a pinch into 2 levels.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc ピンチ状態の時の文字色を敵キャラ名にも適用させます。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20241125220213.html
 * 
 * @help 戦闘時の敵キャラ選択ウィンドウにおいて、残りHPが少ない敵キャラの名前を
 * アクターと同じくピンチ状態の文字色で表示させます。
 * 
 * ピンチ状態の時の文字色を2段階に分けるプラグイン
 * (PANDA_CrisisColorTo2Levels.js)との併用も可能です。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 핀치 상태일 때의 문자색을 적 캐릭터명에도 적용시킵니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20241125220213.html
 * 
 * @help 전투시의 적 캐릭터 선택 윈도우에서, 남은 HP가 적은 적 캐릭터의 이름을
 * 액터와 같이 핀치 상태의 문자색으로 표시시킵니다.
 * 
 * 핀치 상태일 때의 문자색을 2단계로 나누는 플러그인
 * (PANDA_CrisisColorTo2Levels.js)과도 같이 사용할 수 있습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Window_BattleEnemy.resetTextColor
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_BattleEnemy_resetTextColor = Window_BattleEnemy.prototype.resetTextColor;
	Window_BattleEnemy.prototype.resetTextColor = function() {
		_Window_BattleEnemy_resetTextColor.call(this);
		const index = this._index || 0;
		this.changeTextColor(ColorManager.hpColor(this._enemies[index]));
	};
	
	//--------------------------------------------------
	// Window_BattleEnemy.drawItem
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_BattleEnemy_drawItem = Window_BattleEnemy.prototype.drawItem;
	Window_BattleEnemy.prototype.drawItem = function(index) {
		this._index = index;
		_Window_BattleEnemy_drawItem.call(this, index);
	};
	
})();

