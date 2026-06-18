//=============================================================================
// PANDA_NoTPOnRedirect.js
//=============================================================================
// [Update History]
// 2025-07-25 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc controls TP gain when Substitute, Counter, or Magic Reflect occurs.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250725000806.html
 * 
 * @help Controls TP gain when Substitute, Counter, or Magic Reflect occurs.
 * You can turn TP from skills (attacker / counter user) and TP from damage
 * (the target that takes the hit) ON or OFF separately for each case.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param SubstituteActionTP
 * @text Substitute: Attacker TP
 * @desc Whether the original attacker gains TP when a Substitute occurs. Default is ON (gain TP).
 * @type boolean
 * @default true
 * 
 * @param SubstituteDamageTP
 * @text Substitute: Damage TP
 * @desc Whether the battler who takes the Substitute damage gains TP. Default is ON (gain TP).
 * @type boolean
 * @default true
 * 
 * @param CounterActionTP
 * @text Counter: Counter Attacker TP
 * @desc Whether the counter-attacker (the one who performs the counter) gains TP. Default is ON (gain TP).
 * @type boolean
 * @default true
 * 
 * @param CounterDamageTP
 * @text Counter: Damage TP
 * @desc Whether the battler hit by the counter (the original attacker) gains TP. Default is ON (gain TP).
 * @type boolean
 * @default true
 * 
 * @param ReflectActionTP
 * @text Magic Reflect: User TP
 * @desc Whether the original user of reflected magic gains TP (the one hit by the reflected magic). Default is ON (gain TP).
 * @type boolean
 * @default true
 * 
 * @param ReflectDamageTP
 * @text Magic Reflect: Damage TP
 * @desc Whether the battler damaged by the reflected magic (the original user) gains TP. Default is ON (gain TP).
 * @type boolean
 * @default true
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 身代わり・反撃・魔法反射によるTP獲得の有無を制御します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250725000806.html
 * 
 * @help 身代わり・反撃・魔法反射が起きた時のTP獲得の有無を制御します。
 * スキルによるTP（攻撃／反撃した側）と、ダメージによるTP（被弾側）を
 * それぞれのケースで個別にON/OFFできます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param SubstituteActionTP
 * @text 身代わり元攻撃者TP
 * @desc 身代わり発生時に元の攻撃者にTPが入るかどうかを指定します。標準はON（TPが入る）です。
 * @type boolean
 * @default true
 * 
 * @param SubstituteDamageTP
 * @text 身代わりダメージTP
 * @desc 身代わりでダメージを受けた側にTPが入るかどうかを指定します。標準はON（TPが入る）です。
 * @type boolean
 * @default true
 * 
 * @param CounterActionTP
 * @text 反撃者TP
 * @desc 反撃で反撃を行った側（反撃者）にTPが入るかどうかを指定します。標準はON（TPが入る）です。
 * @type boolean
 * @default true
 * 
 * @param CounterDamageTP
 * @text 反撃ダメージTP
 * @desc 反撃でダメージを受けた側（元の攻撃者）にTPが入るかどうかを指定します。標準はON（TPが入る）です。
 * @type boolean
 * @default true
 * 
 * @param ReflectActionTP
 * @text 反射元使用者TP
 * @desc 魔法反射で魔法を使用した側（ダメージを受けた側と同じ）にTPが入るかどうかを指定します。標準はON（TPが入る）です。
 * @type boolean
 * @default true
 * 
 * @param ReflectDamageTP
 * @text 反射ダメージTP
 * @desc 魔法反射でダメージを受けた側（元の使用者と同じ）にTPが入るかどうかを指定します。標準はON（TPが入る）です。
 * @type boolean
 * @default true
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 대신 맞기, 반격, 마법 반사에 의한 TP 획득 유무를 제어합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250725000806.html
 * 
 * @help 대신 맞기, 반격, 마법 반사 발생 시의 TP 획득 유무를 제어합니다.
 * 스킬로 얻는 TP(공격/반격자)와 피해로 얻는 TP(피격자)를
 * 상황별로 개별 ON/OFF 할 수 있습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param SubstituteActionTP
 * @text 대신맞기: 원 공격자 TP
 * @desc 대신 맞기 발생 시에 원래 공격자가 TP를 얻을지 지정합니다. 기본값은 ON (TP 획득)입니다.
 * @type boolean
 * @default true
 * 
 * @param SubstituteDamageTP
 * @text 대신맞기: 피해 측 TP
 * @desc 대신 피해를 받은 측이 그 피해로 TP를 얻을지 지정합니다. 기본값은 ON (TP 획득)입니다.
 * @type boolean
 * @default true
 * 
 * @param CounterActionTP
 * @text 반격: 반격자 TP
 * @desc 반격을 수행한 쪽(반격자)이 TP를 얻을지 지정합니다. 기본값은 ON (TP 획득)입니다.
 * @type boolean
 * @default true
 * 
 * @param CounterDamageTP
 * @text 반격: 피격 측 TP
 * @desc 반격으로 피해를 받은 쪽(원래 공격자)이 TP를 얻을지 지정합니다. 기본값은 ON (TP 획득)입니다.
 * @type boolean
 * @default true
 * 
 * @param ReflectActionTP
 * @text 마법 반사: 원 사용자 TP
 * @desc 마법 반사 시 마법을 사용한 쪽(보통 피해자와 동일)이 TP를 얻을지 지정합니다. 기본값은 ON (TP 획득)입니다.
 * @type boolean
 * @default true
 * 
 * @param ReflectDamageTP
 * @text 마법 반사: 피격 측 TP
 * @desc 마법 반사로 피해를 받은 쪽(보통 원래 사용자와 동일)이 TP를 얻을지 지정합니다. 기본값은 ON (TP 획득)입니다.
 * @type boolean
 * @default true
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const SubstituteActionTP = (parameters['SubstituteActionTP'] === 'true');
	const SubstituteDamageTP = (parameters['SubstituteDamageTP'] === 'true');
	const CounterActionTP = (parameters['CounterActionTP'] === 'true');
	const CounterDamageTP = (parameters['CounterDamageTP'] === 'true');
	const ReflectActionTP = (parameters['ReflectActionTP'] === 'true');
	const ReflectDamageTP = (parameters['ReflectDamageTP'] === 'true');
	
	
	//--------------------------------------------------
	// BattleManager.initMembers
	//  [Added Definition]
	//--------------------------------------------------
	const _BattleManager_initMembers = BattleManager.initMembers;
	BattleManager.initMembers = function() {
		_BattleManager_initMembers.call(this);
		this._isSubstitute = false;
		this._isCounter = false;
		this._isReflect = false;
	};
	
	//--------------------------------------------------
	// BattleManager.enableActionTp
	//  [New Definition]
	//--------------------------------------------------
	BattleManager.enableActionTp = function() {
		return ((SubstituteActionTP || !this._isSubstitute) &&
		        (CounterActionTP    || !this._isCounter)    &&
		        (ReflectActionTP    || !this._isReflect)
		       );
	};
	
	//--------------------------------------------------
	// BattleManager.enableDamageTp
	//  [New Definition]
	//--------------------------------------------------
	BattleManager.enableDamageTp = function() {
		return ((SubstituteDamageTP || !this._isSubstitute) &&
		        (CounterDamageTP    || !this._isCounter)    &&
		        (ReflectDamageTP    || !this._isReflect)
		       );
	};
	
	
	//--------------------------------------------------
	// BattleManager.invokeNormalAction
	//  [Added Definition]
	//--------------------------------------------------
	const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
	BattleManager.invokeNormalAction = function(subject, target) {
		_BattleManager_invokeNormalAction.call(this, subject, target);
		this._isSubstitute = false;
	};
	
	//--------------------------------------------------
	// BattleManager.invokeCounterAttack
	//  [Added Definition]
	//--------------------------------------------------
	const _BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
	BattleManager.invokeCounterAttack = function(subject, target) {
		this._isCounter = true;
		_BattleManager_invokeCounterAttack.call(this, subject, target);
		this._isCounter = false;
	};
	
	//--------------------------------------------------
	// BattleManager.invokeMagicReflection
	//  [Added Definition]
	//--------------------------------------------------
	const _BattleManager_invokeMagicReflection = BattleManager.invokeMagicReflection;
	BattleManager.invokeMagicReflection = function(subject, target) {
		this._isReflect = true;
		_BattleManager_invokeMagicReflection.call(this, subject, target);
		this._isReflect = false;
	};
	
	//--------------------------------------------------
	// Window_BattleLog.displaySubstitute
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_BattleLog_displaySubstitute = Window_BattleLog.prototype.displaySubstitute;
	Window_BattleLog.prototype.displaySubstitute = function(substitute, target) {
		BattleManager._isSubstitute = true;
		_Window_BattleLog_displaySubstitute.call(this, substitute, target);
	};
	
	
	//--------------------------------------------------
	// Game_Action.applyItemUserEffect
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
	Game_Action.prototype.applyItemUserEffect = function(/*target*/) {
		if (BattleManager.enableActionTp()) {
			_Game_Action_applyItemUserEffect.call(this);
		}
	};
	
	//--------------------------------------------------
	// Game_Battler.chargeTpByDamage
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Battler_chargeTpByDamage = Game_Battler.prototype.chargeTpByDamage;
	Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
		if (BattleManager.enableDamageTp()) {
			_Game_Battler_chargeTpByDamage.call(this, damageRate);
		}
	};
	
})();

