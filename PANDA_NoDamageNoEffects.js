//=============================================================================
// PANDA_NoDamageNoEffects.js
//=============================================================================
// [Update History]
// 2023-11-10 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc effects will not be applied if physical attack and HP damage is 0.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231110021328.html
 * 
 * @help When the damage is 0 with the skill which the hit type is "Physical Attack"
 * and the Type of Damage is against HP, Effetcs will not be applied
 * with this plug-in.
 * 
 * For example, in the case of a skill which has a poison on a normal attack,
 * in the default system, the poison effect is applied even when
 * the target's defence power is high and the damage of the normal attack is 0.
 * This plug-in does not apply the poison if the normal attack damage is 0.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 物理攻撃かつHPのダメージが0の場合は使用効果が付かないようにします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231110021328.html
 * 
 * @help 命中タイプが「物理攻撃」、ダメージのタイプがHPに対するスキルで、
 * ダメージが0であった場合、使用効果が付かないようにするプラグインです。
 * 
 * 例えば通常攻撃に毒効果が付与されるスキルの場合、デフォルトシステムでは
 * 防御力が高くて通常攻撃のダメージが0だった時も毒の効果は付与されます。
 * これを、通常攻撃のダメージが0だった場合は、毒の効果も付かないようにします。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 물리 공격 및 HP 데미지가 0인 경우 사용 효과도 붙지 않게 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231110021328.html
 * 
 * @help 타격 유형이 [물리적 공격], 손상 유형이 HP에 대한 스킬이고,
 * 데미지가 0일 경우, 사용 효과가 붙지 않도록 하는 플러그인입니다.
 * 
 * 예를 들면 보통 공격에 독 효과가 부여되는 스킬의 경우, 표준 시스템에서는
 * 방어가 높아 보통 공격의 데미지가 0이었어도 독 효과는 부여됩니다.
 * 이를, 보통 공격의 데미지가 0이면 독 효과도 붙지 않게 합니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_ActionResult.clear
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
	Game_ActionResult.prototype.clear = function() {
		_Game_ActionResult_clear.call(this);
		this.noEffects = false;
	}
	
	//--------------------------------------------------
	// Game_Action.makeDamageValue
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
	Game_Action.prototype.makeDamageValue = function(target, critical) {
		const value = _Game_Action_makeDamageValue.call(this, target, critical);
		target.result().noEffects = (this.isPhysical() && this.isHpEffect() && value === 0);
		return value;
	}
	
	//--------------------------------------------------
	// Game_Action.applyItemEffect
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
	Game_Action.prototype.applyItemEffect = function(target, effect) {
		const result = target.result();
		if (!result.noEffects) {
			_Game_Action_applyItemEffect.call(this, target, effect);
		}
	}
	
})();

