//=============================================================================
// PANDA_NoDuplicateStates.js
//=============================================================================
// [Update History]
// 2025-07-20 Ver.1.0.0 First Release for MZ.
// 2025-07-29 Ver.1.0.1 Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc prevents already-applied states from being re-applied.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250720182408.html
 * 
 * @help If the specified state is already applied to the target,
 * this plugin prevents the state from being applied again
 * and displays the specified message.
 * The remaining turn count will also not be overwritten.
 * The check is performed before the state application process.
 * 
 * States not specified in the plugin parameters will begave as standard.
 * 
 * State ID : Specify the target state.
 * State IDs for Judgement :
 *   If the actual state applied may vary depending on the skill, etc.
 *   (e.g., a random state is applied), specify the state(s) to use
 *   for duplication judgement. Multiple states can be specified.
 *   If not specified, it will be treated as the same as "State ID".
 * If an actor/enemy is already inflicted with the state :
 *   Specify the message to be displayed when the target already has the state.
 *   %1 will be replaced with the name of the target actor or enemy.
 * 　If left blank, no message will be displayed.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param StateList
 * @text State List
 * @desc Specify states that will not be applied again. Specify the target state and the messages when it is already applied.
 * @type struct<state>[]
 * 
 */
/*~struct~state:
 * 
 * @param StateID
 * @text State ID
 * @desc Specify the target state.
 * @type state
 * @default 0
 * 
 * @param JudgeStateID
 * @text State IDs for Judgement
 * @desc Specify the states used to judge whether already applied. If not specified, it will be the same as "State ID".
 * @type state[]
 * @default []
 * 
 * @param AlreadyMessageForActor
 * @text If an actor is already inflicted with the state
 * @desc Specify the message to be displayed when this state is already applied to an actor. %1 = target actor name.
 * @type text
 * @default 
 * 
 * @param AlreadyMessageForEnemy
 * @text If an enemy is already inflicted with the state
 * @desc Specify the message to be displayed when this state is already applied to an enemy. %1 = target enemy name.
 * @type text
 * @default 
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 既にかかっているステートには重複してかからないようにします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250720182408.html
 * 
 * @help プラグインパラメータで指定したステートが既に対象に付与されている場合に、
 * 指定したメッセージを表示して、再付与を無効化します。
 * 継続ターン数の上書きも発生しません。
 * ステート付与判定より前に、既にかかっているかどうかが判定されます。
 * 
 * なお、プラグインパラメータで指定されていないステートは通常通り処理されます。
 * 
 * ステートID：対象となるステートを指定します。
 * 判定用ステートID：
 * 　付与するスキル等によって実際に付与されるステートが変化するような場合、
 * 　（例：ランダムで別のステートが付与されるなど）
 * 　既にかかっているかの判定に使いたいステートを指定（複数指定可）します。
 * 　未指定の場合は「ステートID」と同じと見なされます。
 * アクター／敵キャラが既にこの状態のとき：
 * 　各対象に既にステートがかかっていた場合に表示するメッセージを指定します。
 * 　%1は対象となるアクターまたは敵キャラの名前に置き換えられます。
 * 　空欄の場合はメッセージは表示されません。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param StateList
 * @text ステートリスト
 * @desc 重複してかからないステートを指定します。対象のステートと既にかかっていた時のメッセージを指定します。
 * @type struct<state>[]
 * 
 */
/*~struct~state:ja:
 * 
 * @param StateID
 * @text ステートID
 * @desc 対象となるステートを指定します。
 * @type state
 * @default 0
 * 
 * @param JudgeStateID
 * @text 判定用ステートID
 * @desc 再付与の判定に使用するステートを指定します。指定がなければ「ステートID」と同じと見なされます。複数指定が可能です。
 * @type state[]
 * @default []
 * 
 * @param AlreadyMessageForActor
 * @text アクターが既にこの状態のとき
 * @desc アクターにこのステートが既に付与されている時に表示するメッセージを指定します。%1は対象のアクター名に置換されます。
 * @type text
 * @default 
 * 
 * @param AlreadyMessageForEnemy
 * @text 敵キャラが既にこの状態のとき
 * @desc 敵キャラにこのステートが既に付与されている時に表示するメッセージを指定します。%1は対象の敵キャラ名に置換されます。
 * @type text
 * @default 
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 이미 부여된 상태는 중복으로 부여되지 않게 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250720182408.html
 * 
 * @help 플러그인 매개 변수로 지정된 상태가 이미 대상에게 작용되어 있는 경우,
 * 지정된 메시지를 표시하고 다시 적용되지 않도록 합니다.
 * 지속 턴 수의 갱신도 발생하지 않습니다.
 * 상태 부여 판정보다 먼저 이미 걸려 있는지를 판단합니다.
 * 
 * 플러그인 매개 변수로 지정되지 않은 상태는 표준 동작대로 처리됩니다.
 * 
 * 상태 ID : 대상이 되는 상태를 지정합니다.
 * 판정용 상태 ID :
 *   스킬 등에 따라 실제로 부여되는 상태가 다른 경우
 *   (예: 랜덤으로 다른 상태가 부여되는 경우 등), 중복 판정에 사용할
 *   상태를 지정합니다. 여러 개의 상태를 지정 가능합니다.
 *   지정이 없으면 "상태 ID"와 동일하게 간주됩니다.
 * 액터/적 캐릭터가 이미 이 상태일 때 :
 *   대상에게 이미 상태가 걸려 있는 경우 표시할 메시지를 지정합니다.
 *   %1은 대상 액터 또는 적 캐릭터의 이름으로 대체됩니다.
 * 　비워두면 메시지는 표시되지 않습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param StateList
 * @text 상태 리스트
 * @desc 중복되지 않는 상태를 지정합니다. 대상 상태와 이미 걸려 있을 때의 메시지를 지정합니다.
 * @type struct<state>[]
 * 
 */
/*~struct~state:ko:
 * 
 * @param StateID
 * @text 상태 ID
 * @desc 대상이 돠는 상태를 지정합니다.
 * @type state
 * @default 0
 * 
 * @param JudgeStateID
 * @text 판정용 상태 ID
 * @desc 재부여 판정에 사용할 상태를 지정합니다. 지정이 없으면 "상태 ID"와 동일하게 간주됩니다. 여러 개의 지정이 가능합니다.
 * @type state[]
 * @default []
 * 
 * @param AlreadyMessageForActor
 * @text 액터가 이미 이 상태일 때
 * @desc 약터에게 이 상태가 이미 부여되었을 때 표시할 메시지를 지정합니다. %1은 대상 액터의 이름으로 대체됩니다.
 * @type text
 * @default 
 * 
 * @param AlreadyMessageForEnemy
 * @text 적 캐릭터가 이미 이 상태일 때
 * @desc 적 캐릭터에게 이 상태가 이미 부여되었을 때 표시할 메시지를 지정합니다. %1은 대상 적 캐릭터의 이름으로 대체됩니다.
 * @type text
 * @default 
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const sls = JSON.parse(parameters['StateList']).map(item => (JSON.parse(item)));
	const StateList = sls.map(sl => ({'StateID': Number(sl.StateID)
	                                , 'JudgeStateID': JSON.parse(sl.JudgeStateID)
	                                , 'AlreadyMessageForActor': (sl.AlreadyMessageForActor || '')
	                                , 'AlreadyMessageForEnemy': (sl.AlreadyMessageForEnemy || '')}
	                                )
	                         ) || [];
	
	// Parse Judge State ID
	for (const i in StateList) {
		const stateId = StateList[i].StateID;
		const jsl = StateList[i].JudgeStateID || [];
		if (jsl.length === 0) {
			jsl.push(stateId);
		}
		StateList[i].JudgeStateID = jsl.map(item => (Number(item) || stateId));
	}
	
	
	//--------------------------------------------------
	// Game_Action.itemEffectAddAttackState
	//  [Modified Definition]
	//--------------------------------------------------
	Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
		for (const stateId of this.subject().attackStates()) {
			let chance = effect.value1;
			chance *= this.subject().attackStatesRate(stateId);
			const r = Math.random();
			if (r < chance) {
				const sl = StateList.find(item => (item.StateID === stateId));
				if (sl) {
					if (target.isStateAddable(stateId)) {
						if (sl.JudgeStateID.some(id => target.isStateAffected(id))) {
							target._result.pushDuplicatedState(stateId);
							this.makeSuccess(target);
							chance = 0;
						}
					}
				}
				chance *= target.stateRate(stateId);
				chance *= this.lukEffectRate(target);
				if (r < chance) {
					target.addState(stateId);
					this.makeSuccess(target);
				}
			}
		}
	};
	
	//--------------------------------------------------
	// Game_Action.itemEffectAddNormalState
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
	Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
		const sl = StateList.find(item => (item.StateID === effect.dataId));
		if (sl) {
			if (target.isStateAddable(effect.dataId)) {
				if (sl.JudgeStateID.some(id => target.isStateAffected(id))) {
					target._result.pushDuplicatedState(effect.dataId);
					this.makeSuccess(target);
				} else {
					_Game_Action_itemEffectAddNormalState.call(this, target, effect);
				}
			}
		} else {
			_Game_Action_itemEffectAddNormalState.call(this, target, effect);
		}
	};
	
	
	//--------------------------------------------------
	// Game_ActionResult.clear
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
	Game_ActionResult.prototype.clear = function() {
		_Game_ActionResult_clear.call(this);
		this.duplicatedStates = [];
	}
	
	//--------------------------------------------------
	// Game_ActionResult.isStatusAffected
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_ActionResult_isStatusAffected = Game_ActionResult.prototype.isStatusAffected;
	Game_ActionResult.prototype.isStatusAffected = function() {
		return _Game_ActionResult_isStatusAffected.call(this) || this.duplicatedStates.length > 0;
	}
	
	//--------------------------------------------------
	// Game_ActionResult.duplicatedStateObjects
	//  [New Definition]
	//--------------------------------------------------
	Game_ActionResult.prototype.duplicatedStateObjects = function() {
		return this.duplicatedStates.map(id => StateList.find(item => (item.StateID === id)));
	};
	
	//--------------------------------------------------
	// Game_ActionResult.isStateDuplicated
	//  [New Definition]
	//--------------------------------------------------
	Game_ActionResult.prototype.isStateDuplicated = function(stateId) {
		return this.duplicatedStates.includes(stateId);
	};
	
	//--------------------------------------------------
	// Game_ActionResult.pushDuplicatedState
	//  [New Definition]
	//--------------------------------------------------
	Game_ActionResult.prototype.pushDuplicatedState = function(stateId) {
		if (!this.isStateDuplicated(stateId)) {
			this.duplicatedStates.push(stateId);
		}
	};
	
	
	//--------------------------------------------------
	// Window_BattleLog.displayChangedStates
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_BattleLog_displayChangedStates = Window_BattleLog.prototype.displayChangedStates;
	Window_BattleLog.prototype.displayChangedStates = function(target) {
		this.displayDuplicatedStates(target);
		_Window_BattleLog_displayChangedStates.call(this, target);
	};
	
	//--------------------------------------------------
	// Window_BattleLog.displayDuplicatedStates
	//  [New Definition]
	//--------------------------------------------------
	Window_BattleLog.prototype.displayDuplicatedStates = function(target) {
		const result = target.result();
		const states = result.duplicatedStateObjects();
		for (const state of states) {
			const stateText = target.isActor() ? state.AlreadyMessageForActor : state.AlreadyMessageForEnemy;
			if (stateText) {
				this.push("popBaseLine");
				this.push("pushBaseLine");
				this.push("addText", stateText.format(target.name()));
				this.push("waitForEffect");
			}
		}
	};
	
})();

