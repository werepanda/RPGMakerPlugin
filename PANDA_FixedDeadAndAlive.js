//=============================================================================
// PANDA_FixedDeadAndAlive.js
//=============================================================================
// [Update History]
// 2025-11-28 Ver.0.9.1 Beta Release for MZ.
// 2025-11-30 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc fixes issues with "One Ally (Any)" skills used by enemies and auto actors.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251130172025.html
 * 
 * @help This plugin fixes the following issues related to skills with
 * the scope "One Ally (Any)":
 *  - When used by an enemy, the skill cannot get a target and nothing happens.
 *  - When used by an auto-battle actor, the skill should be able to target
 *    both alive and dead allies, but only living allies are candidates.
 * 
 * These problems appear to be omissions in RPG Maker's core scripts.
 * Installing this plugin resolves the above issues and allows both enemies and
 * auto-battle actors to correctly select targets as intended.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 味方単体（無条件）のスキルが敵や自動戦闘で正常に動作しない不具合を修正します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251130172025.html
 * 
 * @help 範囲が「味方単体（無条件）」であるスキルに関する以下の不具合を修正します。
 *  - 敵キャラが使用すると、ターゲットを取得できず何も起こらない
 *  - 自動戦闘のアクターが使用する際、本来は生死に関わらず選べるはずが
 *    生存中の味方しかターゲット候補にならない
 * 
 * これらはツクールのコアスクリプトの不具合（考慮漏れ）のようです。
 * 本プラグインを導入することで上記の問題が解消され、
 * 敵キャラや自動戦闘のアクターでも意図通りにターゲットが選択されます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 아군 단일(무조건) 범위의 스킬이 적이나 자동 전투 때 문제를 수정합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251130172025.html
 * 
 * @help "아군 단일(무조건)" 범위를 가진 스킬과 관련된 다음 문제를 수정합니다.
 *  - 적 캐릭터가 사용할 경우, 대상 선택에 실패하여 아무 일도 일어나지 않는 문제
 *  - 자동 전투 중인 아군이 사용할 경우, 원래는 생사와 관계없이 아군 전체를
 *    대상으로 삼아야 하지만, 실체로는 생존한 아군만 대상 후보로 선택되는 문제
 * 
 * 이러한 문제는 RPG Maker 코어 스크립트의 고려 누락으로 보입니다.
 * 이 플러그인을 적용하면 위의 문제가 해결되며,
 * 적 캐릭터와 자동 전투 아군 모두 의도한 대로 대상을 선태하게 됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_Action.isForAnyone
	//  [New Definition]
	//--------------------------------------------------
	Game_Action.prototype.isForAnyone = function() {
		return this.checkItemScope([12]);
	};
	
	//--------------------------------------------------
	// Game_Action.itemTargetCandidates
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_itemTargetCandidates = Game_Action.prototype.itemTargetCandidates;
	Game_Action.prototype.itemTargetCandidates = function() {
		if (this.isValid() && this.isForAnyone()) {
			return this.friendsUnit().members();
		} else {
			return _Game_Action_itemTargetCandidates.call(this);
		}
	};
	
	//--------------------------------------------------
	// Game_Action.targetsForDeadAndAlive
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_targetsForDeadAndAlive = Game_Action.prototype.targetsForDeadAndAlive;
	Game_Action.prototype.targetsForDeadAndAlive = function(unit) {
		if (this.isForOne()) {
			if (this._targetIndex < 0) {
				return [unit.randomDeadAndAliveTarget()];
			} else {
				return _Game_Action_targetsForDeadAndAlive.call(this, unit);
			}
		} else {
			return _Game_Action_targetsForDeadAndAlive.call(this, unit);
		}
	};
	
	//--------------------------------------------------
	// Game_Unit.randomDeadAndAliveTarget
	//  [New Definition]
	//--------------------------------------------------
	Game_Unit.prototype.randomDeadAndAliveTarget = function() {
		const tgrSum = this.members().reduce((r, member) => r + member.tgr, 0);
		let tgrRand = Math.random() * tgrSum;
		let target = null;
		for (const member of this.members()) {
			tgrRand -= member.tgr;
			if (tgrRand <= 0 && !target) {
				target = member;
			}
		}
		return target;
	};
	
})();

