//=============================================================================
// PANDA_MultiAction2.js
//=============================================================================
// [Update History]
// 2021-06-01 Ver.1.0.0 First Release for MV/MZ.
// 2021-06-23 Ver.1.1.0 fix for subfolder (MZ 1.3.0) and bug fix for transformation.
// 2021-07-05 Ver.1.1.1 revert fix for subfolder (MZ 1.3.2).
// 2022-10-15 Ver.2.0.0 Version 2 Release.
// 2024-02-23 Ver.2.1.0 Bug fix.

/*:
 * @target MV MZ
 * @plugindesc set the detail action pattern of enemies who have multiple action.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20221015191014.html
 * 
 * @help In the action pattern of the enemies who have multiple action,
 * you can make following actions.
 * - Actions valid only for specific times
 * - Cancel the after actions when this action is selected.
 * 
 * At first, create 2 dummy skills.
 * It will be simple if the skill names are "nth Action" and "Last Action".
 * Then, set the above skills to "nth Action Skill" and "Last Action Skill"
 * of the plug-in parameters.
 * 
 * If you specify "nth Action" skill and Rating in the action pattern,
 * the action pattern until the next "nth Action" skill appears
 * will be selected only for the action specified by Rating number.
 * 
 * Also, if you specify "Last Action" in the action pattern,
 * the action pattern until the next "nth Action" skill appears
 * will cancel the after actions when that action is selected.
 * The condition settings are ignored for nth Action and Last Action skills.
 * 
 * [Example]
 * When the action pattern is following:
 *   Normal Attack
 *   nth Action     R=1
 *   Fire
 *   Ice
 *   Last Action
 *   Flame
 *   Blizzard
 *   nth Action     R=2
 *   Heal
 * The action pattern is as follows:
 *  - Normal Attack can be selected in either 1st or 2nd action.
 *  - Fire, Ice, Flame, Blizzard can only be selected in the 1st action.
 *  - When Flame or Blizzard is selected, do not act the 2nd action.
 *  - Heal can only be selected in the 2nd action.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param MultiActionSkillID
 * @text nth Action Skill
 * @desc Specify the skill set for the action pattern used as the n-th action condition.
 * @type skill
 * @default 
 * 
 * @param LastActionSkillID
 * @text Last Action Skill
 * @desc Specify the skill set for the action pattern used as the last action condition.
 * @type skill
 * @default 
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 敵キャラの複数回行動で単独行動や特定回のみ有効な行動を作ります。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20221015191014.html
 * 
 * @help 1ターンに複数回行動する敵キャラの行動パターンにおいて、
 * 以下のような行動パターンを作成できるようになります。
 * ・特定回にのみ有効な行動
 * ・その行動を行ったら以降の行動は行わなくなる
 * 
 * まず最初に、2つのダミースキルを作成します。
 * 名前はそれぞれ「↓n回目行動」「↓行動終了」とすると分かりやすいでしょう。
 * そして、上記のスキルをプラグインパラメータの
 * 「n回目行動条件スキル」と「行動終了条件スキル」に設定します。
 * 
 * 敵キャラの行動パターンで、n回目行動条件スキルとレーティングを指定すると、
 * 次のn回目行動条件スキルが登場するまでの間の行動パターンは、
 * 複数回行動のうち、レーティングで指定された回の行動でのみ選択されます。
 * 
 * また、敵キャラの行動パターンで、行動終了条件スキルを指定すると、
 * 次のn回目行動条件スキルが登場するまでの間の行動パターンは、
 * その行動パターンを選択すると、以降の複数回行動は行わなくなります。
 * n回目行動条件スキルと行動終了条件スキルとも、条件の設定は無視されます。
 * 
 * ■ 例
 * 行動パターンが以下のように指定されている時、
 * 　通常攻撃
 * 　↓n回目行動　　R=1
 * 　ファイア
 * 　アイス
 * 　↓行動終了
 * 　フレイム
 * 　ブリザード
 * 　↓n回目行動　　R=2
 * 　ヒール
 * 以下のような行動パターンとなります。
 * ・通常攻撃は1回目の行動でも2回目の行動でも選択
 * ・ファイア、アイス、フレイム、ブリザードは1回目の行動でのみ選択
 * ・フレイムまたはブリザードを行った場合は2回目の行動はしない
 * ・ヒールは2回目の行動でのみ選択
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param MultiActionSkillID
 * @text n回目行動条件スキル
 * @desc n回目行動条件として使用する行動パターンに設定するスキルを指定します。
 * @type skill
 * @default 
 * 
 * @param LastActionSkillID
 * @text 行動終了条件スキル
 * @desc 最後の行動条件として使用する行動パターンに設定するスキルを指定します。
 * @type skill
 * @default 
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 적의 여러 번 행동에서 1회 행동이나 특정회에만 유효한 행동을 만듭니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20221015191014.html
 * 
 * @help 1턴에 여러 번 행동하는 적 캐릭터의 행동 패턴에서
 * 다음과 같은 행동 패턴을 만들 수 있습니다.
 * - 특정회에만 유효한 행동
 * - 그 행동을 하면 이후의 행동은 하지 않게 됨
 * 
 * 우선, 2개의 더미 스킬을 만듭니다.
 * 이름은 각각 "n회째 헹동", "행동 종료"라고 하는 것이 알기 쉽습니다.
 * 그리고 위의 스킬을 플러그인 매개 변수의
 * "n회째 헹동 조건 스킬"과 "행동 종료 조건 스킬"에 설정합니다.
 * 
 * 적의 행동 패턴에서 n회째 헹동 조건 스킬과 우선도를 지정하면,
 * 다음에 n회째 헹동 조건 스킬이 등장할 때까지의 행동 패턴은
 * 여러 번 행동중, 우선도에서 지정된 횟수의 행동에서만 선택됩나다.
 * 
 * 또, 적의 행동 패턴에서 행동 종료 조건 스킬을 지정하면,
 * 다음에 n회째 헹동 조건 스킬이 등장할 때까지의 행동 패턴은
 * 그 행동 패턴이 선택되면, 이후의 여러 번 행동은 하지 않게 됩니다.
 * n회째 헹동 조건 스킬과 행동 종료 조건 스킬 모두 조건 설정은 무시됩니다.
 * 
 * [ 예 ]
 * 행동 패턴이 다음과 같이 지정되었을 때
 *   일반 공격
 *   n회째 헹동     R=1
 *   단독 화염 마법
 *   단독 냉기 마법
 *   행동 종료
 *   전체 화염 마법
 *   전체 냉기 마법
 *   n회째 헹동     R=2
 *   회복 마법
 * 다음과 같은 행동 패턴이 됩니다.
 * - 일반 공격은 첫번째 행동이나 두번째 행동이나 선택됨
 * - 단독/전체 화염/냉기 마법은 첫번째 행동에서만 선택됨
 * - 전체 화염/냉기 마법이 선택되면 두번째 행동은 하지 않음
 * - 회복 마법은 두번째 행동에서만 선택됨
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param MultiActionSkillID
 * @text n회째 헹동 조건 스킬
 * @desc n회째 헹동 조건으로 사용할 행동 패턴에 설정할 스킬을 지정합니다.
 * @type skill
 * @default 
 * 
 * @param LastActionSkillID
 * @text 행동 종료 조건 스킬
 * @desc 행동 종료 조건으로 사용할 행동 패턴에 설정할 스킬을 지정합니다.
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
	const MultiActionSkillID = Number(parameters['MultiActionSkillID']) || 0;
	const LastActionSkillID = Number(parameters['LastActionSkillID']) || 0;
	
	
	//--------------------------------------------------
	// Game_Enemy.selectAllActions
	//  [Modified Definition]
	//--------------------------------------------------
	Game_Enemy.prototype.selectAllActions = function(actionList) {
		const ratingMax = Math.max(...actionList.map(a => a.rating));
		const ratingZero = ratingMax - 3;
		actionList = actionList.filter(a => a.rating > ratingZero);
		const action = this.selectAction(actionList, ratingZero);
		this.action(this._actionIndex).setEnemyAction(action);
		// delete next actions if last action
		if (this._lastActionList.indexOf(action) != -1) {
			this._actions.length = this._actionIndex + 1;
		}
	}
	
	
	//--------------------------------------------------
	// Game_Enemy.makeActions
	//  [Modified Definition]
	//--------------------------------------------------
	Game_Enemy.prototype.makeActions = function() {
		Game_Battler.prototype.makeActions.call(this);
		// make multi action list
		this.makeMultiActionList();
		// make multi actions
		for (let i = 0; i < this.numActions(); i++) {
			this._actionIndex = i;
			let actionList = this._multiActionList[0];
			if (this._multiActionList[i + 1]) {
				actionList = actionList.concat(this._multiActionList[i + 1]);
			}
			actionList = actionList.filter(a => this.isActionValid(a));
			if (actionList.length > 0) {
				this.selectAllActions(actionList);
			}
		}
		this.setActionState("waiting");
	}
	
	
	//--------------------------------------------------
	// Game_Enemy.makeMultiActionList
	//  [New Definition]
	//--------------------------------------------------
	Game_Enemy.prototype.makeMultiActionList = function() {
		// initialize action list
		this._lastActionList = [];
		this._multiActionList = [[], []];
		// initialize conditions
		let isLast = false;
		let n = 0;
		// make action list
		this.enemy().actions.forEach(action => {
			if (action.skillId === MultiActionSkillID) {
				// nth action
				n = action.rating;
				isLast = false;
			} else if (action.skillId === LastActionSkillID) {
				// last action
				isLast = true;
			} else {
				// action
				if (!this._multiActionList[n]) {
					this._multiActionList[n] = [];
				}
				this._multiActionList[n].push(action);
				if (isLast) {
					this._lastActionList.push(action);
				}
			}
		});
	}
	
})();

