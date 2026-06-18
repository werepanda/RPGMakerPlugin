//=============================================================================
// PANDA_BuffState.js
//=============================================================================
// [Update History]
// 2022-03-09 Ver.1.0.0 First Release for MV/MZ.
// 2022-03-12 Ver.1.0.1 Bug fix for debuff.

/*:
 * @target MV MZ
 * @plugindesc apply a specific state in conjunction with buff / debuff.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220309032714.html
 * 
 * @help A specific state is automatically applied according to the buff / debuff.
 * It is also possible to apply a state which means no buff / debuff.
 * 
 * This makes it easy to create enemies
 * that only attack normally when the attack power is raised,
 * or that uses the buff skill when the attack power is not raised.
 * 
 * [Advance Preparation]
 * 
 * 1. Creating states for buff / debuff
 * First, create states for buff / debuff in [States] of [Database].
 * The default requires a total of 40 states, for 8 parameters (MaxHP ~ Luck)
 * buff 1 level, 2 level, debuff 1 level, 2 level and normal.
 * The buff / debuff states should be in the same order as the icons.
 * These states are dummy, so the settings of states are not necessary.
 * Check only [Remove at Battle End] at [Removal Conditions].
 * Buff, debuff and normal can be omitted if not used.
 * 
 * 2. Setting plug-in parameters
 * Make the following settings in the plug-in parameters.
 * - Buff Start State  : Specify the state at the beginning of the buff.
 * - Debuff Start State: Specify the state at the beginning of the debuff.
 * - Normal Start State: Specify the state at the beginning of no buff/debuff.
 *    You can set them to [None] if you do not want to use them.
 * - Buff Max Level  : Specify the maximum number of levels of buff.
 * - Debuff Max Level: Specify the maximum number of levels of debuff.
 * - Set Lower Level State
 *    ON : When in buff/debuff level 2, the state of level 1 is also applied.
 *    OFF: When in buff/debuff level 2, only the state of level 2 is applied.
 * 
 * Now, you are ready to go.
 * Please use the buff / debuff states
 * for the condition of the action patterns of the enemies.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param StateBuffStart
 * @text Buff Start State
 * @desc Specify the state of MaxHP Buff Level 1. Based on this state, the states of parameters x levels are used.
 * @type state
 * @default 
 * 
 * @param StateDebuffStart
 * @text Debuff Start State
 * @desc Specify the state of MaxHP Debuff Level 1. Based on this state, the states of parameters x levels are used.
 * @type state
 * @default 
 * 
 * @param StateNormalStart
 * @text Normal Start State
 * @desc Specify the state of MaxHP No Buff / Debuff. Based on this state, the states of parameters are used.
 * @type state
 * @default 
 * 
 * @param MaxBuffLevel
 * @text Buff Max Level
 * @desc Specify the maximum number of levels of buff.
 * @type number
 * @decimals 0
 * @default 2
 * 
 * @param MaxDebuffLevel
 * @text Debuff Max Level
 * @desc Specify the maximum number of levels of debuff.
 * @type number
 * @decimals 0
 * @default 2
 * 
 * @param SetLowerLevel
 * @text Set Lower Level State
 * @desc The state of the lower level is also applied. When in buff/debuff level 2, the state of level 1 is also applied.
 * @type boolean
 * @default false
 * 
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 能力強化・弱体に連動して特定のステートを付与します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220309032714.html
 * 
 * @help 能力値の強化・弱体状態に応じて自動的に特定のステートを付与します。
 * 能力値が強化・弱体されていない状態を表すステートを付与することも可能です。
 * 
 * これにより、攻撃力強化時は通常攻撃のみしてくる敵キャラや
 * 強化されていない時に強化魔法を使う敵キャラなどが、簡単に実装できます。
 * 
 * ■ 事前準備
 * 
 * 1. 強化・弱体用ステートの作成
 * まず「データベース」の「ステート」で強化・弱体用のステートを作成します。
 * デフォルトでは、8つの能力値（最大HP～運）の強化1段階、強化2段階、
 * 弱体1段階、弱体2段階、および通常の、計40個のステートが必要です。
 * 強化、弱体のステートの順序はアイコンの順序と同じにします。
 * ステートはダミーステートのため、アイコンやメッセージ等は設定不要です。
 * 「戦闘終了時に解除」のみチェックしてください。
 * 強化、弱体、通常は、それぞれ使わない場合は省略可能です。
 * 
 * 2. プラグインパラメータの設定
 * プラグインパラメータで以下の設定をします。
 * - 強化開始ステート：強化の先頭のステートを指定します。
 * - 弱体開始ステート：弱体の先頭のステートを指定します。
 * - 通常開始ステート：強化・弱体がない状態の先頭のステートを指定します。
 * 　 使用しない場合は「なし」に設定することもできます。
 * - 強化最大段階：強化が最大で何段階まであるかを指定します。
 * - 弱体最大段階：弱体が最大で何段階まであるかを指定します。
 * - 低段階ステート付与
 * 　 ON ：強化・弱体が2段階の時に強化・弱体1段階のステートも付与されます。
 * 　 OFF：強化・弱体が2段階の時は強化・弱体2段階のステートのみ付与されます。
 * 
 * 以上で事前準備は完了です。
 * 敵キャラの行動パターンの条件に強化・弱体のステートをご利用ください。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param StateBuffStart
 * @text 強化開始ステート
 * @desc 最大HPの強化1段階を表すステートを指定します。このステートを基準に能力値×段階分のステートが使用されます。
 * @type state
 * @default 
 * 
 * @param StateDebuffStart
 * @text 弱体開始ステート
 * @desc 最大HPの弱体1段階を表すステートを指定します。このステートを基準に能力値×段階分のステートが使用されます。
 * @type state
 * @default 
 * 
 * @param StateNormalStart
 * @text 通常開始ステート
 * @desc 最大HPが強化・弱体されていない状態を表すステートを指定します。このステートを基準に能力値分のステートが使用されます。
 * @type state
 * @default 
 * 
 * @param MaxBuffLevel
 * @text 強化最大段階
 * @desc 強化の段階の最大値を指定します。
 * @type number
 * @decimals 0
 * @default 2
 * 
 * @param MaxDebuffLevel
 * @text 弱体最大段階
 * @desc 弱体の段階の最大値を指定します。
 * @type number
 * @decimals 0
 * @default 2
 * 
 * @param SetLowerLevel
 * @text 低段階ステート付与
 * @desc 現状より低い段階のステートも同時に付与します。例えば、攻撃力2段階上昇時に攻撃力1段階上昇のステートも付与します。
 * @type boolean
 * @default false
 * 
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 능력 강화/약화에 연동하여 특정 스탯을 부여합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220309032714.html
 * 
 * @help 능력치의 강화/약화 상태에 따라 자동적으로 특정 스탯을 부여합니다.
 * 능력치가 강화/약화되어 있지 않은 상태를 나타내는 스탯도 부여할 수 있습니다.
 * 
 * 이것으로 공격력 강화시는 보통 공격만 해오는 적 캐릭터나
 * 강화되어 있지 않을 때에 강화 스킬을 사용하는 적 캐릭터 등을
 * 간단하게 만들 수 있습니다.
 * 
 * [사전 준비]
 * 
 * 1. 강화/약화용 스탯 작성
 * 우선 [데이터베이스] [스탯]에서 강화/약화용 스탯을 작성합니다.
 * 표준으로는 8개 능력치(최대HP - 운)의 강화 1단계, 강화 2단계,
 * 약화 1단계, 약화 2단계, 및 통상시의 총 40개 스탯이 필요합니다.
 * 강화, 약화 스탯의 순서는 아이콘의 순서와 같습니다.
 * 스탯은 더미이기 때문에 아이콘이나 메세지등은 설정이 불필요합니다.
 * [전투 종료 시에 해제]에만 체크하시기 바랍니다.
 * 강화, 약화, 통상은 각각 사용하지 않는 경우에는 생략 가능합니다.
 * 
 * 2. 플러그인 매개 변수 설정
 * 플러그인 매개 변수로 이하를 설정합니다.
 * - 강화 사작 스탯: 강화의 시작 스탯을 지정합니다.
 * - 약화 사작 스탯: 약화의 시작 스탯을 지정합니다.
 * - 통상 사작 스탯: 강화/약화가 없는 상태의 시작 스탯을 지정합니다.
 *    사용하지 않는 경우에는 [없음]으로 설정할 수도 있습니다.
 * - 강화 최대 단계: 강화가 최대 몇 단계까지 있는지를 지정합니다.
 * - 약화 최대 단계: 약화가 최대 몇 단계까지 있는지를 지정합니다.
 * - 저단계 스탯 부여
 * 　 ON : 강화/약화가 2단계일 때, 강화/약화 1단계 스탯도 부여됩니다.
 * 　 OFF: 강화/약화가 2단계일 때는, 강화/약화 2단계 스탯만이 부여됩니다.
 * 
 * 이상으로 사전 준비는 완료입니다.
 * 적들의 행동 패턴 조건으로 이 강화/약화 스탯을 이용하십시오.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param StateBuffStart
 * @text 강화 사작 스탯
 * @desc 최대HP 강화 1단계 스탯을 지정합니다. 이 스탯을 기준으로 능력치 x 단계분의 스탯이 사용됩니다.
 * @type state
 * @default 
 * 
 * @param StateDebuffStart
 * @text 약화 사작 스탯
 * @desc 최대HP 약화 1단계 스탯을 지정합니다. 이 스탯을 기준으로 능력치 x 단계분의 스탯이 사용됩니다.
 * @type state
 * @default 
 * 
 * @param StateNormalStart
 * @text 통상 사작 스탯
 * @desc 최대HP가 강화/약화되어 있지 않은 상태의 스탯을 지정합니다. 이 스탯을 기준으로 능력치분의 스탯이 사용됩니다.
 * @type state
 * @default 
 * 
 * @param MaxBuffLevel
 * @text 강화 최대 단계
 * @desc 강화 단계의 최대치를 지정합니다.
 * @type number
 * @decimals 0
 * @default 2
 * 
 * @param MaxDebuffLevel
 * @text 약화 최대 단계
 * @desc 약화 단계의 최대치를 지정합니다.
 * @type number
 * @decimals 0
 * @default 2
 * 
 * @param SetLowerLevel
 * @text 저단계 스탯 부여
 * @desc 현재보다 낮은 단계의 스탯도 동시에 부여합니다. 예를 들어 공격력 2단계 강화시에 공격력 1단계 강화 스탯도 부여합니다.
 * @type boolean
 * @default false
 * 
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const StateBuffStart = Number(parameters['StateBuffStart']) || 0;
	const StateDebuffStart = Number(parameters['StateDebuffStart']) || 0;
	const StateNormalStart = Number(parameters['StateNormalStart']) || 0;
	const MaxBuffLevel = Number(parameters['MaxBuffLevel']) || 2;
	const MaxDebuffLevel = Number(parameters['MaxDebuffLevel']) || 2;
	const SetLowerLevel = (parameters['SetLowerLevel'] == 'true') || false;
	
	const buffStateList = [];
	
	
	//--------------------------------------------------
	// Game_BattlerBase.setBuffState
	//  [New Definition]
	//--------------------------------------------------
	Game_BattlerBase.prototype.setBuffState = function() {
		const states = [];
		for (let i = 0; i < this._buffs.length; i++) {
			if (this._buffs[i] === 0) {
				if (StateNormalStart) {
					states.push(i + StateNormalStart);
				}
			} else if (this._buffs[i] > 0) {
				if (StateBuffStart) {
					for (let j = this._buffs[i]; j >= (SetLowerLevel ? 1 : this._buffs[i]); j--) {
						const index = this.buffIconIndex(j, i) - Game_BattlerBase.ICON_BUFF_START;
						states.push(index + StateBuffStart);
					}
				}
			} else if (this._buffs[i] < 0) {
				if (StateDebuffStart) {
					for (let j = this._buffs[i]; j <= (SetLowerLevel ? -1 : this._buffs[i]); j++) {
						const index = this.buffIconIndex(j, i) - Game_BattlerBase.ICON_DEBUFF_START;
						states.push(index + StateDebuffStart);
					}
				}
			}
		}
		if (buffStateList.length === 0) {
			this.makeBuffStateList();
		}
		this._states = this._states.filter(value => !buffStateList.includes(value)).concat(states);
	};
	
	
	//--------------------------------------------------
	// Game_BattlerBase.makeBuffStateList
	//  [New Definition]
	//--------------------------------------------------
	Game_BattlerBase.prototype.makeBuffStateList = function() {
		buffStateList.length = 0;
		if (StateNormalStart) {
			for (let i = 0; i < this._buffs.length; i++) {
				buffStateList.push(i + StateNormalStart);
			}
		}
		if (StateBuffStart) {
			for (let i = 0; i < this._buffs.length; i++) {
				for (let j = 1; j <= MaxBuffLevel; j++) {
					const index = this.buffIconIndex(j, i) - Game_BattlerBase.ICON_BUFF_START;
					buffStateList.push(index + StateBuffStart);
				}
			}
		}
		if (StateDebuffStart) {
			for (let i = 0; i < this._buffs.length; i++) {
				for (let j = 1; j <= MaxDebuffLevel; j++) {
					const index = this.buffIconIndex(-j, i) - Game_BattlerBase.ICON_DEBUFF_START;
					buffStateList.push(index + StateDebuffStart);
				}
			}
		}
	}
	
	
	//--------------------------------------------------
	// Game_BattlerBase.refresh
	//  [Addtional Definition]
	//--------------------------------------------------
	const _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
	Game_BattlerBase.prototype.refresh = function() {
		_Game_BattlerBase_refresh.call(this);
		if (this.isAlive()) {
			this.setBuffState();
		}
	}
	
	
})();

