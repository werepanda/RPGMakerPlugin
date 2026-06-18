//=============================================================================
// PANDA_FixedAutoBattle.js
//=============================================================================
// [Update History]
// 2022-03-21 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc Fixes that scripts in damage formulas is executed in auto battle.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220321161150.html
 * 
 * @help You can embed any script in damage formula of skills.
 * For example,
 *  a.addState(13); a.atk * 4 - b.def * 2
 * allows you to apply the user the state id 13 while doing damage.
 * 
 * However, if you have actors with the trait of Auto Battle,
 * the scripts will be executed to evaluate the damage formula
 * for all usable skills at the beginning of the turn.
 * 
 * This plugin fixes this, so that the execution result will not be reflected
 * when evaluating for the auto battle.
 * 
 * Also, "inEval" will be defined as a global variable.
 * Only when evaluating auto battle, inEval = true, so you can change
 * the processing between evaluation and execution in the damage formula.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc ダメージ計算式内のスクリプトが自動戦闘で実行されるのを解消します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220321161150.html
 * 
 * @help スキルのダメージ計算式には、任意のスクリプトを埋め込むことができます。
 * 例えば
 *  a.addState(13); a.atk * 4 - b.def * 2
 * とすると、ダメージを与えつつ自身に13番のステートを付与することができます。
 * 
 * しかし、自動戦闘の特徴を持ったアクターがいる場合、
 * ターン最初に使用可能な全スキルについてダメージ計算式を評価するため、
 * スクリプトが実行されてしまいます。
 * 
 * 本プラグインはそれを修正し、
 * 自動戦闘の評価時には実行結果が反映されないようになります。
 * 
 * また、グローバル変数として inEval を定義します。
 * 自動戦闘の評価時のみ inEval = true となり、
 * ダメージ計算式内において、評価時と実行時で処理を変えることができます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 데미지 계산식중 스크립트가 자동 전투에서 실행되는 것을 해소합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220321161150.html
 * 
 * @help 스킬의 데미지 계산식에는 임의의 스크립트를 포함할 수 있습니다.
 * 예를 들어
 *  a.addState(13); a.atk * 4 - b.def * 2
 * 로 하면 데미지를 주면서 자신에게 13번 스탯을 부여할 수 있습니다.
 * 
 * 그러나 자동 전투의 특징을 가진 액터가 있는 경우,
 * 턴 처음에 사용 가능한 모든 스킬 데미지 계산식이 평가되기 때문에
 * 스크립트가 실행되고 맙니다.
 * 
 * 이 플러그인은 이를 수정하고
 * 자동 전투 평가시에는 실행 결과가 반영되지 않게 됩니다.
 * 
 * 또 전역 변수로 inEval을 정의합니다.
 * 자동 전투의 평가시에만 inEval = true 가 되어,
 * 데미지 계산식내에서 평가시와 실행시에 처리를 바꿀 수 있습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */


// Evaluate flag: Global variable for use in damage formula
var inEval = false;

(() => {
	
	//--------------------------------------------------
	// Game_Action.evaluate
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_evaluate = Game_Action.prototype.evaluate;
	Game_Action.prototype.evaluate = function() {
		inEval = true;
		const result = _Game_Action_evaluate.call(this);
		inEval = false;
		return result;
	}
	
	//--------------------------------------------------
	// Game_Action.evalDamageFormula
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
	Game_Action.prototype.evalDamageFormula = function(target) {
		if (inEval) {
			try {
				const item = JsonEx.makeDeepCopy(this.item());
				const a = JsonEx.makeDeepCopy(this.subject()); // eslint-disable-line no-unused-vars
				const b = JsonEx.makeDeepCopy(target); // eslint-disable-line no-unused-vars
				const v = JsonEx.makeDeepCopy($gameVariables._data); // eslint-disable-line no-unused-vars
				const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
				const value = Math.max(eval(item.damage.formula), 0) * sign;
				return isNaN(value) ? 0 : value;
			} catch (e) {
				return 0;
			}
		} else {
			return _Game_Action_evalDamageFormula.call(this, target);
		}
	};
	
})();

