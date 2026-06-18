//=============================================================================
// PANDA_RunningAnimation.js
//=============================================================================
// [Update History]
// 2025-09-07 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc allows you to speed up the stepping and walking animation.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250907223112.html
 * 
 * @help This plug-in lets you increase the stepping and walking animation speed
 * of characters beyond the default, making them look as if they are running.
 * 
 * In the event command [Set Movement Route]
 * or in a custom route for autonomous movement,
 * enter the following in Script to switch the stepping/walking animation speed.
 *  this.startRunning();  // Speeds up the animation
 *  this.stopRunning();   // Restores the animation to normal speed
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc キャラクターの足踏み・歩行アニメの速度を速められるようにします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250907223112.html
 * 
 * @help キャラクターの足踏みアニメと歩行アニメの速度をデフォルトより速くして
 * 走っているように見せることができます。
 * 
 * イベントコマンドの「移動ルートの設定」や自律移動のカスタムルート設定において
 * 「スクリプト」で以下を入力すると、足踏み・歩行アニメ速度を切り替えられます。
 *  this.startRunning();  // アニメ速度を速くします
 *  this.stopRunning();   // アニメ速度を元の速さにします
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 캐릭터의 발 구르기 및 보행 애니메이션 속도를 빠르게 할 수 있습니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250907223112.html
 * 
 * @help 캐릭터의 발 구르기와 보행 애니메이션 속도를 기본값보다 빠르게 하여,
 * 달리고 있는 것처럼 보이게 할 수 있습니다.
 * 
 * 이벤트 명령 [이동 경로 설정] 또는 자율 이동의 사용자 지정 경로 설정에서
 * [스크립트]에다가 이하의 코드를 입력하면,
 * 발 구르기와 보행 애니메이션 속도를 전환할 수 있습니다.
 *  this.startRunning();  // 애니메이션 속도를 빠르게 함
 *  this.stopRunning();   // 애니메이션 속도를 원래 속도로 되돌림
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_CharacterBase.initMembers
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
	Game_CharacterBase.prototype.initMembers = function() {
		_Game_CharacterBase_initMembers.call(this);
		this._isRunning = false;
	};
	
	//--------------------------------------------------
	// Game_CharacterBase.isRunning
	//  [New Definition]
	//--------------------------------------------------
	Game_CharacterBase.prototype.isRunning = function() {
		return !!this._isRunning;
	}
	
	//--------------------------------------------------
	// Game_CharacterBase.startRunning
	//  [New Definition]
	//--------------------------------------------------
	Game_CharacterBase.prototype.startRunning = function() {
		this._isRunning = true;
	}
	
	//--------------------------------------------------
	// Game_CharacterBase.stopRunning
	//  [New Definition]
	//--------------------------------------------------
	Game_CharacterBase.prototype.stopRunning = function() {
		this._isRunning = false;
	}
	
	//--------------------------------------------------
	// Game_CharacterBase.animationWait
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_CharacterBase_animationWait = Game_CharacterBase.prototype.animationWait;
	Game_CharacterBase.prototype.animationWait = function() {
		if (this.isRunning()) {
			return Math.max((7 - this.realMoveSpeed()) * 3, 1.5);
		} else {
			return _Game_CharacterBase_animationWait.call(this);
		}
	};
	
	
})();

