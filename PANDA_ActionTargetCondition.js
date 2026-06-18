//=============================================================================
// PANDA_ActionTargetCondition.js
//=============================================================================
// [Update History]
// 2025-11-13 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc enable target selection conditions for enemy action patterns.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251113010144.html
 * @orderAfter PANDA_FixedRandomDeadTarget
 * 
 * @help This plugin adds target-selection conditions to enemy action patterns.
 * 
 * [Preparation]
 * Create a "Target Condition" skill first.
 * (Name it like "↑Target Condition" to be clear.)
 * Then set that skill to the plugin parameter "Target Condition Skill".
 * 
 * In the enemy action patterns, place one or more condition rows
 * immediately after the action you want to control targets.
 * The conditions and ratings on those rows decide the targets.
 * Multiple condition rows are allowed.
 * 
 * [Conditions]
 * Always : everyone is eligible.
 * Turn : specify by index or ID as follows:
 *   0 + 0 * X -> the user itself
 *   A + 0 * X -> member whose index (1-based) is A
 *   0 + B * X -> member whose Actor/Enemy ID is B
 *   A + B * X -> index (1-based) that metches A + B * X
 * HP : members whose current HP is in the range.
 * MP : members whose current MP is in the range.
 * State : members with the specified state.
 * Party Level : that actor's level, the party's max level for enemies.
 * Switch : only affects whether the action is adopted.
 * 
 * [Rating (Priority)]
 * Default rating is 5. Lower than 5 makes a member less likely to be chosen,
 * higher than 5 makes them more likely.
 * If multiple conditions match, their ratings are added.
 * Rating 1 excludes a member, rating 9 always includes a member.
 * If both 1 and 9 apply, the later row takes precedence.
 * 
 * [Target lottery]
 * If any members match rating=9, draw only from them.
 * Otherwise, draw from members that are not excluded (rating is not 1).
 * Based on the maximum rating, the selection chance decreases by one third
 * for each - 1. Anything at least 3 below the maximum is not selected.
 * "Target Rate"(tgr) is also considered.
 * 
 * [Rejection and re-selection]
 * If no candidates exist, the action is rejected.
 * Conditions are checked twice: when actions are first chosen in the turn,
 * and again right before execution. If no candidates remain at execution time,
 * the enemy re-selects another action.
 * For all-targets or self-target skills, no narrowing occurs,
 * but if no one satisfies the conditions, the action is rejected.
 * 
 * [Examples]
 * (1)
 * Attack
 * ↑Target Condition  State: Sleep  R=4
 * ↑Target Condition  State: Confuse  R=4
 * If sleep or confuse applies, chance is 2/3 of normal; if both apply, 1/3.
 * 
 * (2)
 * Poison attack (single)
 * ↑Target Condition  State: Poison  R=1
 * Poisoned members are excluded from the target.
 * If everyone is poisoned, the ation is rejected.
 * 
 * (3)
 * Raise (single revive)
 * ↑Target Condition  Always  R=1
 * ↑Target Condition  State: Dead  R=9
 * Draw from the dead members. If none are dead, the action is rejected.
 * 
 * (4)
 * Heal (single HP recovery)
 * ↑Target Condition  HP: 50-80%  R=6
 * ↑Target Condition  HP: 0-50%  R=7
 * HP 50-80% members are double chance; 0-50% members are triple.
 * 
 * (5)
 * Attack
 * ↑Target Condition  Turn: 4 + 0 * X  R=8
 * ↑Target Condition  Turn: 3 + 0 * X  R=7
 * ↑Target Condition  Turn: 2 + 0 * X  R=6
 * Back-row members are more likely to be chosen.
 * Unless member #4 is dead, member #1 is not attacked.
 * 
 * [Conflict and Compatibility]
 * May conflict with other battle plugins.
 * Changing plugin order may resolve issues.
 * Compatible with panda (werepanda.jp) plugins.
 * When using together with PANDA_FixedRandomDeadTarget.js,
 * place this plugin after it.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param TargetConditionSkillID
 * @text Target Condition Skill
 * @desc Specify the skill to be set for the action pattern to be used as target conditions.
 * @type skill
 * @default 
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 敵キャラの行動で指定条件に合致するターゲットが選ばれやすくします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251113010144.html
 * @orderAfter PANDA_FixedRandomDeadTarget
 * 
 * @help 敵キャラの行動パターンでターゲット選択条件を指定できるプラグインです。
 * 
 * ■ 事前準備
 * 事前準備として、まずターゲット条件指定用のスキルを作成します。
 * （スキル名は「↑ターゲット条件」などとすると分かりやすいです）
 * 次にプラグインパラメータ「ターゲット条件用スキル」にそのスキルを設定します。
 * 
 * 敵キャラの行動パターンで、ターゲットを指定したい行動の直後に
 * 上記の「ターゲット条件用スキル」をスキルに設定した行動パターンを並べます。
 * この条件行の条件とレーティング（優先度）で、ターゲットが決定されます。
 * 条件行は2行以上並べることも可能です。
 * 
 * ■ 条件指定
 * 常時：全員が対象となります
 * ターン：以下のように対象のインデックスやIDを指定します
 *   0 + 0 * X → 自分自身
 *   A + 0 * X → インデックス（1始まり）がAのメンバー
 *   0 + B * X → アクターIDまたは敵キャラIDがBのメンバー
 *   A + B * X → インデックス（1始まり）がA + B * Xに合致するメンバー
 * HP：現在のHPが指定範囲内にあるメンバー
 * MP：現在のMPが指定範囲内にあるメンバー
 * ステート：指定ステートが付与されているメンバー
 * パーティLv：対象アクターのレベル、敵の場合は味方パーティの最高レベル
 * スイッチ：ターゲットの絞り込みには影響せず、行動の採用可否にのみ影響します
 * 
 * ■ レーティング（優先度）
 * 優先度はデフォルトが5で、5より小さい値を指定するとターゲットに選ばれにくく、
 * 大きい値を指定すると選ばれやすくなります。
 * 複数の条件に合致する場合は、それぞれの条件での優先度が加算されます。
 * ただしレーティングに1を指定するとターゲットから除外され、
 * 9を指定すると必ずターゲットに選ばれるようになります。
 * 1と9の両方が指定された場合は、後から指定された方が優先されます。
 * 
 * ■ ターゲットの抽選
 * レーティング=9に該当するメンバーがいれば、その中から抽選されます。
 * いなければ、レーティング=1の除外対象者を除いた中から抽選されます。
 * この時、最大のレーティングを基準に、それよりも1小さくなるごとに選択確率が
 * 1/3ずつ下がります。最大値より3以上小さい場合は選ばれなくなります。
 * なお、ターゲットの抽選には「狙われ率」も参照されます。
 * 
 * ■ 行動の不採用と再選択
 * ターゲット候補が1人もいない場合は、その行動は不採用となります。
 * ターゲット条件は、ターン最初の行動決定時と実際の行動直前の2回確認され、
 * 実際の行動時に対象者が1人もいない場合は、行動が再選択されます。
 * なおスキルの範囲が全体や使用者自身の場合、ターゲット選択はされませんが、
 * 条件を満たす対象者が1人もいなければ、その行動は不採用となります。
 * 
 * ■ 設定例
 * (1)
 * 攻撃
 * ↑ターゲット条件 ステート：睡眠 R=4
 * ↑ターゲット条件 ステート：混乱 R=4
 * 睡眠か混乱にかかっている場合、通常メンバーに比べて選択確率が2/3、
 * 両方かかっている場合は1/3となります。
 * 
 * (2)
 * 単体毒攻撃
 * ↑ターゲット条件 ステート：毒 R=1
 * 毒にかかっているメンバーは対象外。
 * 全員が毒にかかっていた場合は行動自体が不採用となります。
 * 
 * (3)
 * レイズ（単体蘇生）
 * ↑ターゲット条件 常時 R=1
 * ↑ターゲット条件 ステート：戦闘不能 R=9
 * 戦闘不能のメンバーの中から抽選されます。
 * 誰も戦闘不能になっていない場合は行動自体が不採用となります。
 * 
 * (4)
 * ヒール（単体HP回復）
 * ↑ターゲット条件 HP：50～80% R=6
 * ↑ターゲット条件 HP：0～50% R=7
 * HPが50～80%のメンバーは選択確率が通常の倍、0～50%のメンバーは3倍となります。
 * 
 * (5)
 * 攻撃
 * ↑ターゲット条件 ターン：4 + 0 * X R=8
 * ↑ターゲット条件 ターン：3 + 0 * X R=7
 * ↑ターゲット条件 ターン：2 + 0 * X R=6
 * 後ろのメンバーほど狙われやすくなります。
 * 4人目のメンバーが戦闘不能でない限り、1人目のメンバーは攻撃されません。
 * 
 * ■ 競合・互換性について
 * 戦闘システムに関わる他のプラグインとは競合する可能性があります。
 * プラグインの順序を入れ替えることで解決する場合もあります。
 * panda(werepanda.jp)制作のプラグインとは互換性があります。
 * 敵蘇生対象選択修正プラグイン(PANDA_FixedRandomDeadTarget.js)と併用する場合、
 * 本プラグインの方を後に配置してください。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param TargetConditionSkillID
 * @text ターゲット条件用スキル
 * @desc ターゲット条件として使用する行動パターンに設定するスキルを指定します。
 * @type skill
 * @default 
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 적 캐릭터의 행동 패턴에 대상 선택 조건을 지정 가능하게 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20251113010144.html
 * @orderAfter PANDA_FixedRandomDeadTarget
 * 
 * @help 적 캐릭터의 행동 패턴에 대상 선택 조건을 부여할 수 있는 플러그인입니다.
 * 
 * [사전 준비]
 * 먼저, 대상 조건 지정용 스킬을 만듭니다.
 * (스킬명은 "↑대상 조건"처럼 붙이면 명확합니다.)
 * 그리고 플러그인 매개 변수 [대상 조건용 스킬]에 이 스킬을 설정합니다.
 * 
 * 적의 행동 패턴에서 대상 지정을 하고 싶은 행동 바로 뒤에
 * 위에서 지정한 [대상 조건용 스킬]을 스킬에 설정한 행동 패턴을 나열합니다.
 * 이 조건 행의 조건과 레이팅(우선도)으로 대상이 결정됩니다.
 * 조건 행은 2개 이상 나열할 수 있습니다.
 * 
 * [조건 지정]
 * 항상 : 전원이 대상입니다.
 * 턴 : 인덱스 또는 ID를 다음과 같이 지정합니다.
 *   0 + 0 * X -> 사용자 자신
 *   A + 0 * X -> 인덱스(1부터 시작)가 A인 멤버
 *   0 + B * X -> 액터/적 ID가 B인 멤버
 *   A + B * X -> 인덱스(1부터 시작)가 A + B * X에 부합하는 멤버
 * HP : 현재 HP가 범위 안인 멤버
 * MP : 현재 MP가 범위 안인 멤버
 * 상태 : 지정한 상태가 부여된 멤버
 * 파티 Lv : 해당 액터의 레벨, 적일 때는 플레이어 파티의 최고 레벨
 * 스위치 : 대상 좁히기에는 영향이 없으며, 행동 채택 여부에만 영향을 줍니다.
 * 
 * [레이팅(우선도)]
 * 기본값은 5입니다. 5보다 작은 값을 지정하면 선택될 가능성이 낮아지고,
 * 5보다 큰 값을 지정하면 선택될 가능성이 높아집니다.
 * 여러 조건이 동시에 맞으면 값을 합산합니다.
 * 다만, 레이팅 1을 지정하면 대상에서 제외되고,
 * 9를 지정하면 반드시 대상이 됩니다.
 * 1과 9가 모두 적용되면, 나중 행이 우선합니다.
 * 
 * [대상 추첨]
 * 레이팅=9가 있으면 그 집합에서만 대상이 추첨됩니다.
 * 없으면 레이팅=1인 제외 대상자를 제외한 집합에서 추첨됩니다.
 * 최대 레이팅을 기준으로, 1 낮아질 때마다 선택 확률이 1/3씩 감소합니다.
 * 최대값보다 3 이상 낮은 경우는 대상으로 선택되지 않습니다.
 * 또한 "노려짐률"(tgr)도 참고합니다.
 * 
 * [행동 미채택과 재선택]
 * 후보가 하나도 없으면 그 행동은 채택되지 않습니다.
 * 조건은 턴 시작의 행동 결정 시점과 실제 행동 직전에 두 번 확인됩니다.
 * 실행 직전에 대상이 없으면, 다른 행동으로 다시 선택됩니다.
 * 범위가 전체/사용자 자신인 스킬은 대상 좁히기는 하지 않지만,
 * 조건 충족자가 하나도 없으면, 그 행동은 채택되지 않습니다.
 * 
 * [설정 예시]
 * (1)
 * 공격
 * ↑대상 조건  상태: 수면  R=4
 * ↑대상 조건  상태: 혼란  R=4
 * 수면 또는 혼란이면 선택 확률이 2/3, 둘 다면 1/3이 됩니다.
 * 
 * (2)
 * 단일 독 공격
 * ↑대상 조건  상태: 독  R=1
 * 독 상태의 멤버는 대상 후보에서 제외됩니다.
 * 전원이 독이면 행동 자체가 채택되지 않습니다.
 * 
 * (3)
 * 레이즈 (단일 부활)
 * ↑대상 조건  항상  R=1
 * ↑대상 조건  상태: 전투불능  R=9
 * 전투불능 멤버 중에서 추첨됩니다.
 * 아무도 전투불능이 아니면 행동 자체가 채택되지 않습니다.
 * 
 * (4)
 * 힐 (단일 HP 회복)
 * ↑대상 조건  HP: 50-80%  R=6
 * ↑대상 조건  HP: 0-50%  R=7
 * HP가 50-80%인 멤버는 2배, 0-50%인 멤버는 3배의 확률로 선택됩니다.
 * 
 * (5)
 * 공격
 * ↑대상 조건  턴: 4 + 0 * X  R=8
 * ↑대상 조건  턴: 3 + 0 * X  R=7
 * ↑대상 조건  턴: 2 + 0 * X  R=6
 * 뒤쪽 멤버일수록 노려지기 쉽습니다.
 * 4번째 멤버가 전투불능이 아닌 이상 첫 번째 멤버는 공격받지 않습니다.
 * 
 * [충돌과 호환성]
 * 다른 전투 관련 플러그인과는 충돌할 수 있습니다.
 * 플러그인 순서 변경으로 해결될 가능성도 있습니다.
 * panda (werepanda.jp) 제작 플러그인과는 호환성이 있습니다.
 * 적 부활 대상 선택 수정 플러그인 (PANDA_FixedRandomDeadTarget.js)과
 * 함께 쓰는 경우, 본 플러그인을 뒤에 배치하십시오.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param TargetConditionSkillID
 * @text 대상 조건용 스킬
 * @desc 대상 조건으로 사용할 행동 패턴에 설정할 스킬을 지정합니다.
 * @type skill
 * @default 
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const TargetConditionSkillID = Number(parameters['TargetConditionSkillID']) || 0;
	const TargetConditionBaseRating = 5;
	const TargetConditionIgnoreRatingDifference = 3;
	
	
	//--------------------------------------------------
	// DataManager.onLoad
	//  [Added Definition]
	//--------------------------------------------------
	const _DataManager_onLoad = DataManager.onLoad;
	DataManager.onLoad = function(object) {
		_DataManager_onLoad.call(this, object);
		if (this.isEnemiesObject(object)) {
			this.makeTargetConditions(object);
		}
	};
	
	//--------------------------------------------------
	// DataManager.isEnemiesObject
	//  [New Definition]
	//--------------------------------------------------
	DataManager.isEnemiesObject = function(object) {
		if (Array.isArray(object)) {
			if (object[1]) {
				return !!(object[1].actions);
			}
		}
		return false;
	};
	
	//--------------------------------------------------
	// DataManager.makeTargetConditions
	//  [New Definition]
	//--------------------------------------------------
	DataManager.makeTargetConditions = function(array) {
		if (Array.isArray(array)) {
			for (const data of array) {
				if (data && 'actions' in data) {
					this.makeTargetCondition(data);
				}
			}
		}
	};
	
	//--------------------------------------------------
	// DataManager.makeTargetCondition
	//  [New Definition]
	//--------------------------------------------------
	DataManager.makeTargetCondition = function(data) {
		const actions = [];
		let baseAction;
		for (const action of data.actions) {
			if (action.skillId !== TargetConditionSkillID) {
				baseAction = action;
				baseAction['targetConditions'] = [];
				actions.push(baseAction);
			} else if (baseAction) {
				baseAction['targetConditions'].push({'conditionType': action.conditionType,
				                                     'conditionParam1': action.conditionParam1,
				                                     'conditionParam2': action.conditionParam2,
				                                     'rating': action.rating
				                                    });
			}
		}
		data.actions = actions;
	};
	
	
	//--------------------------------------------------
	// Game_Action.setEnemyAction
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_setEnemyAction = Game_Action.prototype.setEnemyAction;
	Game_Action.prototype.setEnemyAction = function(action) {
		_Game_Action_setEnemyAction.call(this, action);
		if (action) {
			this.setTargetConditions(action.targetConditions);
		}
	};
	
	//--------------------------------------------------
	// Game_Action.setTargetConditions
	//  [New Definition]
	//--------------------------------------------------
	Game_Action.prototype.setTargetConditions = function(targetConditions) {
		this._targetConditions = targetConditions;
	};
	
	//--------------------------------------------------
	// Game_Action.targetConditions
	//  [New Definition]
	//--------------------------------------------------
	Game_Action.prototype.targetConditions = function() {
		return this._targetConditions || [];
	};
	
	
	//--------------------------------------------------
	// Game_Action.existsTarget
	//  [New Definition]
	//--------------------------------------------------
	Game_Action.prototype.existsTarget = function() {
		if (this.item()) {
			this._applyTargetConditions = true;
			return (this.makeTargets().length > 0);
		} else {
			return false;
		}
	};
	
	//--------------------------------------------------
	// Game_Action.targetsForDead
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_targetsForDead = Game_Action.prototype.targetsForDead;
	Game_Action.prototype.targetsForDead = function(unit) {
		this._applyTargetConditions ||= (this.isForOne() && this._targetIndex < 0);
		if (this._applyTargetConditions) {
			unit.setTargetConditions(this.targetConditions());
		}
		const targets = _Game_Action_targetsForDead.call(this, unit);
		if (this._applyTargetConditions) {
			unit.resetTargetConditions();
		}
		this._applyTargetConditions = false;
		return targets;
	};
	
	//--------------------------------------------------
	// Game_Action.targetsForAlive
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Action_targetsForAlive = Game_Action.prototype.targetsForAlive;
	Game_Action.prototype.targetsForAlive = function(unit) {
		this._applyTargetConditions ||= (this.isForOne() && this._targetIndex < 0);
		if (this._applyTargetConditions) {
			unit.setTargetConditions(this.targetConditions());
		}
		const targets = _Game_Action_targetsForAlive.call(this, unit);
		if (this._applyTargetConditions) {
			unit.resetTargetConditions();
		}
		this._applyTargetConditions = false;
		return targets;
	};
	
	
	//--------------------------------------------------
	// Game_BattlerBase.evaluateTargetRating
	//  [New Definition]
	//--------------------------------------------------
	Game_BattlerBase.prototype.evaluateTargetRating = function(conditions) {
		// initialize
		this._rating = TargetConditionBaseRating;
		this._excluded = false;
		this._included = false;
		// judge conditions
		for (const condition of conditions) {
			if (this.meetsTargetCondition(condition)) {
				const r = Number(condition.rating) || TargetConditionBaseRating;
				if (r === 1) {
					this._excluded = true;
					this._included = false;
				} else if (r === 9) {
					this._excluded = false;
					this._included = true;
				} else {
					this._rating += (r - TargetConditionBaseRating);
				}
			}
		}
	}
	
	
	//--------------------------------------------------
	// Game_BattlerBase.meetsTargetCondition
	//  [New Definition]
	//--------------------------------------------------
	Game_BattlerBase.prototype.meetsTargetCondition = function(condition) {
		const param1 = condition.conditionParam1;
		const param2 = condition.conditionParam2;
		switch (condition.conditionType) {
			case 1:
				return this.meetsIndexCondition(param1, param2);
			case 2:
				return this.meetsHpCondition(param1, param2);
			case 3:
				return this.meetsMpCondition(param1, param2);
			case 4:
				return this.meetsStateCondition(param1);
			case 5:
				return this.meetsLevelCondition(param1);
			case 6:
				return this.meetsSwitchCondition(param1);
			default:
				return true;
		}
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.meetsIndexCondition
	//  [New Definition]
	//--------------------------------------------------
	Game_BattlerBase.prototype.meetsIndexCondition = function(param1, param2) {
		const n = this.index() + 1;
		if (param1 === 0 && param2 === 0) {
			return (BattleManager._subject === this);
		} else if (param2 === 0) {
			return n === param1;
		} else if (param1 === 0) {
			const id = this.isActor() ? this.actorId() : this.enemyId();
			return id === param2;
		} else {
			return n > 0 && n >= param1 && n % param2 === param1 % param2;
		}
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.meetsHpCondition
	//  [New Definition]
	//--------------------------------------------------
	const _Game_Enemy_meetsHpCondition = Game_Enemy.prototype.meetsHpCondition;
	Game_BattlerBase.prototype.meetsHpCondition = function(param1, param2) {
		return _Game_Enemy_meetsHpCondition.call(this, param1, param2);
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.meetsMpCondition
	//  [New Definition]
	//--------------------------------------------------
	const _Game_Enemy_meetsMpCondition = Game_Enemy.prototype.meetsMpCondition;
	Game_BattlerBase.prototype.meetsMpCondition = function(param1, param2) {
		return _Game_Enemy_meetsMpCondition.call(this, param1, param2);
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.meetsStateCondition
	//  [New Definition]
	//--------------------------------------------------
	const _Game_Enemy_meetsStateCondition = Game_Enemy.prototype.meetsStateCondition;
	Game_BattlerBase.prototype.meetsStateCondition = function(param) {
		return _Game_Enemy_meetsStateCondition.call(this, param);
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.meetsLevelCondition
	//  [New Definition]
	//--------------------------------------------------
	const _Game_Enemy_meetsPartyLevelCondition = Game_Enemy.prototype.meetsPartyLevelCondition;
	Game_BattlerBase.prototype.meetsLevelCondition = function(param) {
		if (this.isActor()) {
			return (this.level >= param);
		} else if (this.isEnemy()) {
			return _Game_Enemy_meetsPartyLevelCondition.call(this, param);
		} else {
			return false;
		}
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.meetsSwitchCondition
	//  [New Definition]
	//--------------------------------------------------
	const _Game_Enemy_meetsSwitchCondition = Game_Enemy.prototype.meetsSwitchCondition;
	Game_BattlerBase.prototype.meetsSwitchCondition = function(param) {
		return _Game_Enemy_meetsSwitchCondition.call(this, param);
	};
	
	
	//--------------------------------------------------
	// Game_Battler.clearActions
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Battler_clearActions = Game_Battler.prototype.clearActions;
	Game_Battler.prototype.clearActions = function() {
		this._actionIndex = 0;
		_Game_Battler_clearActions.call(this);
	};
	
	//--------------------------------------------------
	// Game_Battler.currentAction
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Battler_currentAction = Game_Battler.prototype.currentAction;
	Game_Battler.prototype.currentAction = function() {
		const action = _Game_Battler_currentAction.call(this);
		if (action && this.isEnemy()) {
			if (action.existsTarget()) {
				return action;
			} else {
				const actionIndex = this._actionIndex;
				this.makeActions();
				for (let i = 0; i < actionIndex; i++) {
					this._actions.shift();
				}
				return this._actions[0];
			}
		} else {
			return action;
		}
	};
	
	//--------------------------------------------------
	// Game_Battler.removeCurrentAction
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Battler_removeCurrentAction = Game_Battler.prototype.removeCurrentAction;
	Game_Battler.prototype.removeCurrentAction = function() {
		this._actionIndex = this._actionIndex + 1;
		_Game_Battler_removeCurrentAction.call(this);
	};
	
	
	//--------------------------------------------------
	// Game_Enemy.isActionValid
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Enemy_isActionValid = Game_Enemy.prototype.isActionValid;
	Game_Enemy.prototype.isActionValid = function(action) {
		const valid = _Game_Enemy_isActionValid.call(this, action);
		if (valid) {
			const objAction = new Game_Action(this);
			objAction.setEnemyAction(action);
			return objAction.existsTarget();
		} else {
			return false;
		}
	};
	
	
	//--------------------------------------------------
	// Game_Unit.setTargetConditions
	//  [New Definition]
	//--------------------------------------------------
	Game_Unit.prototype.setTargetConditions = function(targetConditions) {
		this._targetConditions = targetConditions;
	};
	
	//--------------------------------------------------
	// Game_Unit.resetTargetConditions
	//  [New Definition]
	//--------------------------------------------------
	Game_Unit.prototype.resetTargetConditions = function() {
		this._targetConditions = null;
	};
	
	
	//--------------------------------------------------
	// Game_Unit.makeTargetMembers
	//  [New Definition]
	//--------------------------------------------------
	Game_Unit.prototype.makeTargetMembers = function(members, targetConditions) {
		members.forEach(member => member.evaluateTargetRating(targetConditions));
		const includedTargets = members.filter(member => member._included);
		if (includedTargets.length > 0) {
			return includedTargets;
		} else {
			const targets = [];
			const applicants = members.filter(member => !member._excluded);
			if (applicants.length > 0) {
				// max rating
				let ratingMax = 0;
				for (const member of applicants) {
					if (ratingMax < member._rating) {
						ratingMax = member._rating;
					}
				}
				// make target list by ratings
				const ratingZero = ratingMax - TargetConditionIgnoreRatingDifference;
				for (const member of applicants) {
					for (let i = 0; i < member._rating - ratingZero; i++) {
						targets.push(member);
					}
				}
			}
			return targets;
		}
	}
	
	//--------------------------------------------------
	// Game_Unit.aliveMembers
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Unit_aliveMembers = Game_Unit.prototype.aliveMembers;
	Game_Unit.prototype.aliveMembers = function() {
		if (this._targetConditions) {
			const members = _Game_Unit_aliveMembers.call(this);
			return this.makeTargetMembers(members, this._targetConditions);
		} else {
			return _Game_Unit_aliveMembers.call(this);
		}
	};
	
	//--------------------------------------------------
	// Game_Unit.deadMembers
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Unit_deadMembers = Game_Unit.prototype.deadMembers;
	Game_Unit.prototype.deadMembers = function() {
		if (this._targetConditions) {
			const members = _Game_Unit_deadMembers.call(this);
			return this.makeTargetMembers(members, this._targetConditions);
		} else {
			return _Game_Unit_deadMembers.call(this);
		}
	};
	
	
})();

