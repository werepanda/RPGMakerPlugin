//=============================================================================
// PANDA_FixedConfusionAction.js
//=============================================================================
// [Update History]
// 2025-07-24 Ver.1.0.0 First Release for MV/MZ.
// 2025-09-12 Ver.1.0.1 Bug fix for state resist.
// 2025-12-22 Ver.1.0.2 Fix crash in Time Progress Battle.

/*:
 * @target MV MZ
 * @plugindesc adjusts actions when confusion-type states are added or removed.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250724004955.html
 * 
 * @help Adjusts the battler's planned action in the current turn when a state
 * with restriction "Attack an Enemy/Anyone/an Ally" is applied or removed,
 * preventing odd behavior.
 * 
 * On add: If the battler's turn comes up in the same turn, they perform
 *         a normal attack according to the restriction (enemy/anyone/ally).
 * On remove: The planned action is canceled so the normal attack will not run.
 * 
 * If the battler becomes affected by a "Cannot move" state (e.g. Sleep)
 * while confused, any planned action is also canceled correctly.
 * 
 * This plugin works only with the turn-based battle system.
 * It does not function in Time Progress Battle.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 混乱系ステートの付与・解除時に、そのターン内の行動を改善します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250724004955.html
 * 
 * @help 行動制約が「敵/誰か/味方を攻撃」のステートが付与・解除された時、
 * そのターンの予定していた行動を調整し、不自然な行動を防ぎます。
 * 
 * 付与時：同一ターン内に行動順が回って来た場合、
 * 　　　　制約に従って敵や味方を通常攻撃します。
 * 解除時：予定行動をキャンセルし、通常攻撃は行いません。
 * 
 * なお、混乱中に睡眠など行動制約が「行動できない」であるステートが
 * 付与された場合も、予定行動が正しくキャンセルされるようになります。
 * 
 * 本プラグインは戦闘システムがターン制の場合のみ有効です。
 * タイムプログレス戦闘では機能しません。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 혼란 계열 상태가 부여/해제될 때 해당 턴의 행동을 개선합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250724004955.html
 * 
 * @help 행동 제한이 "적/무작위/아군 공격"인 상태가 부여/해제될 때,
 * 해당 턴의 예정 행동을 조정해 이상 동작을 방지합니다.
 * 
 * 부여 시: 같은 턴의 순서가 오면 제한에 따라 적이나 아군을 일반 공격합니다.
 * 해제 시: 예정 행동을 취소하여 일반 공격이 실행되지 않습니다.
 * 
 * 혼란 중에 수면처럼 행동 제한이 "행동 불가"인 상태가 추가되면
 * 예정 행동도 취소됩니다.
 * 
 * 이 플러그인은 턴제 전투 시스템에서만 유효합니다.
 * 타임 프로그레스 전투에서는 기능하지 않습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	// isTpbBattle
	const isTpbBattle = () => typeof BattleManager !== 'undefined' && typeof BattleManager.isTpb === 'function' && BattleManager.isTpb();
	
	//--------------------------------------------------
	// Game_BattlerBase.addNewState
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
	Game_BattlerBase.prototype.addNewState = function(stateId) {
		const affected = this.isStateAffected(stateId);
		_Game_BattlerBase_addNewState.call(this, stateId);
		if (!isTpbBattle()) {
			if (!affected && this.isStateAffected(stateId)) {
				const state = $dataStates[stateId];
				if (state && this.isAlive()) {
					if (state.restriction === 4) {
						this.clearActions();
					} else if (state.restriction >= 1 && state.restriction <= 3) {
						this.makeActions();
					}
				}
			}
		}
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.eraseState
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
	Game_BattlerBase.prototype.eraseState = function(stateId) {
		const affected = this.isStateAffected(stateId);
		_Game_BattlerBase_eraseState.call(this, stateId);
		if (!isTpbBattle()) {
			if (affected && !this.isStateAffected(stateId)) {
				const state = $dataStates[stateId];
				if (state && this.isAlive()) {
					if (state.restriction >= 1 && state.restriction <= 3) {
						this.clearActions();
					}
				}
			}
		}
	};
	
})();

