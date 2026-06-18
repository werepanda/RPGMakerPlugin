//=============================================================================
// PANDA_NoOvercapBuff.js
//=============================================================================
// [Update History]
// 2025-07-21 Ver.1.0.0 First Release for MZ.

/*:
 * @target MV MZ
 * @plugindesc prevents turn count reset when a param buff/debuff is at its limit.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250721172759.html
 * 
 * @help If a buff or debuff has already reached its level limit, the effect
 * will not be applied, and a specified message will be displayed instead.
 * The remaining turn count will not be overwritten.
 * The limit check occurs before the buff/debuff application is processed.
 * 
 * If an action changes a parameter's buff level by more than 1 at once,
 * and even 1 level is successfully applied,
 * the specified message will not be displayed.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param BuffLimitMessage
 * @text Buff Limit Message
 * @desc Specify the message to display when a buff has already reached its max level. %1 = target name, %2 = param name.
 * @type text
 * @default %1’s %2 can’t go up any more!
 * 
 * @param DebuffLimitMessage
 * @text Debuff Limit Message
 * @desc Specify the message to display when a debuff has already reached its max level. %1 = target name, %2 = param name.
 * @type text
 * @default %1’s %2 can’t go down any more!
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 能力値強化・弱体が上限に達していたら継続ターン数の更新を無効にします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250721172759.html
 * 
 * @help 能力値の強化（バフ）や弱体（デバフ）が重ねがけできる上限に達している場合、
 * その対象には効果がかからず、代わりに指定したメッセージが表示されます。
 * 継続ターン数の上書きも発生しません。
 * バフ・デバフの付与判定より前に、上限に達しているかどうかが判定されます。
 * 
 * なお、効果が1回で2段階以上変動するような場合、
 * そのうち1段階でも効果がかかったならば、指定したメッセージは表示されません。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param BuffLimitMessage
 * @text 強化上限メッセージ
 * @desc 強化が既に上限に達している時に表示するメッセージを指定します。%1が対象者名、%2が能力値名に置き換えられます。
 * @type text
 * @default %1の%2はもう上がらない！
 * 
 * @param DebuffLimitMessage
 * @text 弱体上限メッセージ
 * @desc 弱体が既に上限に達している時に表示するメッセージを指定します。%1が対象者名、%2が能力値名に置き換えられます。
 * @type text
 * @default %1の%2はもう下がらない！
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 능력치 강화/약화가 상한에 도달한 경우 지속 턴수 갱신을 무효화합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250721172759.html
 * 
 * @help 능력치 강화(버프) 또는 약화(디버프)가 중첩 가능한 상한에 도달한 경우,
 * 해당 대상에게 효과가 적용되지 않으며, 대신 지정한 메시지가 표시됩니다.
 * 지속 턴 수의 갱신도 발생하지 않습니다.
 * 버프/디버프의 부여 판정에 앞서 상한 도달 여부가 판정됩니다.
 * 
 * 한 번의 사용으로 2단계 이상 변동되는 경우,
 * 그 중 1단계라도 적용되면 지정한 메시지는 표시되지 않습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param BuffLimitMessage
 * @text 강화 상한 메시지
 * @desc 강화가 이미 상한에 도달했을 때 표시할 메시지를 지정합니다. %1이 대상자명, %2가 능력치명으로 대체됩니다.
 * @type text
 * @default %1의 %2은 더 이상 상승하지 않는다!
 * 
 * @param DebuffLimitMessage
 * @text 약화 상한 메시지
 * @desc 약화가 이미 상한에 도달했을 때 표시할 메시지를 지정합니다. %1이 대상자명, %2가 능력치명으로 대체됩니다.
 * @type text
 * @default %1의 %2은 더 이상 하락하지 않는다!
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const BuffLimitMessage = parameters['BuffLimitMessage'] || '';
	const DebuffLimitMessage = parameters['DebuffLimitMessage'] || '';
	
	
	//--------------------------------------------------
	// Game_Action.itemEffectAddBuff
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_itemEffectAddBuff = Game_Action.prototype.itemEffectAddBuff;
	Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
		if (target.isAlive() && target.isMaxBuffAffected(effect.dataId)) {
			target._result.pushOvercappedBuff(effect.dataId);
			this.makeSuccess(target);
		} else {
			_Game_Action_itemEffectAddBuff.call(this, target, effect);
		}
	};
	
	//--------------------------------------------------
	// Game_Action.itemEffectAddDebuff
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_itemEffectAddDebuff = Game_Action.prototype.itemEffectAddDebuff;
	Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
		if (target.isAlive() && target.isMaxDebuffAffected(effect.dataId)) {
			target._result.pushOvercappedDebuff(effect.dataId);
			this.makeSuccess(target);
		} else {
			_Game_Action_itemEffectAddDebuff.call(this, target, effect);
		}
	};
	
	
	//--------------------------------------------------
	// Game_ActionResult.clear
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
	Game_ActionResult.prototype.clear = function() {
		_Game_ActionResult_clear.call(this);
		this.overcappedBuffs = [];
		this.overcappedDebuffs = [];
	}
	
	//--------------------------------------------------
	// Game_ActionResult.isStatusAffected
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_ActionResult_isStatusAffected = Game_ActionResult.prototype.isStatusAffected;
	Game_ActionResult.prototype.isStatusAffected = function() {
		return _Game_ActionResult_isStatusAffected.call(this) || this.overcappedBuffs.length > 0 || this.overcappedDebuffs.length > 0;
	}
	
	//--------------------------------------------------
	// Game_ActionResult.isBuffOvercapped
	//  [New Definition]
	//--------------------------------------------------
	Game_ActionResult.prototype.isBuffOvercapped = function(paramId) {
		return this.overcappedBuffs.includes(paramId);
	};
	
	//--------------------------------------------------
	// Game_ActionResult.pushOvercappedBuff
	//  [New Definition]
	//--------------------------------------------------
	Game_ActionResult.prototype.pushOvercappedBuff = function(paramId) {
		if (!this.isBuffOvercapped(paramId) && !this.isBuffAdded(paramId)) {
			this.overcappedBuffs.push(paramId);
		}
	};
	
	//--------------------------------------------------
	// Game_ActionResult.isDebuffOvercapped
	//  [New Definition]
	//--------------------------------------------------
	Game_ActionResult.prototype.isDebuffOvercapped = function(paramId) {
		return this.overcappedDebuffs.includes(paramId);
	};
	
	//--------------------------------------------------
	// Game_ActionResult.pushOvercappedDebuff
	//  [New Definition]
	//--------------------------------------------------
	Game_ActionResult.prototype.pushOvercappedDebuff = function(paramId) {
		if (!this.isDebuffOvercapped(paramId) && !this.isDebuffAdded(paramId)) {
			this.overcappedDebuffs.push(paramId);
		}
	};
	
	
	//--------------------------------------------------
	// Window_BattleLog.displayChangedBuffs
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_BattleLog_displayChangedBuffs = Window_BattleLog.prototype.displayChangedBuffs;
	Window_BattleLog.prototype.displayChangedBuffs = function(target) {
		const result = target.result();
		this.displayBuffs(target, result.overcappedBuffs, BuffLimitMessage);
		this.displayBuffs(target, result.overcappedDebuffs, DebuffLimitMessage);
		_Window_BattleLog_displayChangedBuffs.call(this, target);
	};
	
})();

