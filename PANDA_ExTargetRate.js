//=============================================================================
// PANDA_ExTargetRate.js
//=============================================================================
// [Update History]
// 2023-10-25 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc target rate lower than a certain value is considered 0%.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231025234529.html
 * 
 * @help A target rate that is lower than the max target rate of the party members
 * by a threshold specified in the plugin parameters will be considered 0%.
 * 
 * When implementing a so-called "taunt" skill that focuses the attacks of
 * enemies on the skill user, simply increasing the target rate may result
 * in a small number of other members being targeted.
 * This plugin makes you to exclude members whose target rate is lower than
 * the value specified in the plugin parameters from the attack target,
 * and to correctly focus the attacks on the skill user.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param ThresholdTargetRate
 * @text Target Rate Threshold(%)
 * @desc Target rate lower than the specified value from the max in the party will be treated as 0%. Specify the value in %.
 * @type number
 * @min 0
 * @default 500
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 一定値以上低い狙われ率を0%と見なします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231025234529.html
 * 
 * @help パーティー内のメンバーの狙われ率の最大値より、
 * プラグインパラメータで指定した閾値以上に低い狙われ率を、0%として見なします。
 * 
 * 敵の攻撃対象を自分に集中させる、いわゆる「挑発」スキルを実装する際に、
 * 自身の狙われ率を上げただけでは、わずかに他のメンバーが対象になり得ます。
 * このプラグインを使えば、狙われ率が一定値以上低いメンバーは攻撃対象から外れ、
 * 正しく自分に攻撃を集中させることができるようになります。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param ThresholdTargetRate
 * @text 狙われ率 閾値(%)
 * @desc パーティー内の狙われ率の最大値より指定した値以上に低い狙われ率は0%と扱います。値は%で指定します。
 * @type number
 * @min 0
 * @default 500
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 일정치 이상 낮은 표적이 될 확률을 0%로 간주합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231025234529.html
 * 
 * @help 파티 내 멤버의 표적이 될 확률(표적률)의 최대값보다 플러그인 매개 변수로
 * 지정한 임계값 이상으로 낮은 표적률을 0%로 간주합니다.
 * 
 * 적의 공격 대상을 자신에게 집중시키는 이른바 "도발" 스킬을 만들 때,
 * 자신의 표적률을 올린 것만으로는 다른 멤버가 표적이 될 가능성이 약간 있습니다.
 * 이 플러그인을 사용하면, 표적이 될 확률이 일정치 이상 낮은 멤버는
 * 공격 대상에서 벗어나, 정확히 자신에게 공격을 집중시킬 수 있게 됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param ThresholdTargetRate
 * @text 표적률 임계값(%)
 * @desc 파티 내의 표적이 될 확률의 최대값보다 여기서 지정된 값 이상으로 낮은 확률은 0%로 취급됩니다. 값은 %로 지정합니다.
 * @type number
 * @min 0
 * @default 500
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const ThresholdTargetRate = Number(parameters['ThresholdTargetRate']) / 100 || 5;
	
	
	//--------------------------------------------------
	// Game_Unit.aliveMembers
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Unit_aliveMembers = Game_Unit.prototype.aliveMembers;
	Game_Unit.prototype.aliveMembers = function() {
		return this._targetable ? this.targetableMembers() : this.aliveMembersOriginal();
	};
	
	//--------------------------------------------------
	// Game_Unit.aliveMembersOriginal
	//  [New Definition]
	//--------------------------------------------------
	Game_Unit.prototype.aliveMembersOriginal = function() {
		return _Game_Unit_aliveMembers.call(this);
	};
	
	//--------------------------------------------------
	// Game_Unit.tgrMax
	//  [New Definition]
	//--------------------------------------------------
	Game_Unit.prototype.tgrMax = function() {
		return this.aliveMembersOriginal().reduce((r, member) => Math.max(r, member.tgr), 0);
	};
	
	//--------------------------------------------------
	// Game_Unit.targetableMembers
	//  [New Definition]
	//--------------------------------------------------
	Game_Unit.prototype.targetableMembers = function() {
		const tgrThreshold = this.tgrMax() - ThresholdTargetRate;
		return this.aliveMembersOriginal().filter(member => (member.tgr >= tgrThreshold));
	};
	
	//--------------------------------------------------
	// Game_Unit.randomTarget
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Unit_randomTarget = Game_Unit.prototype.randomTarget;
	Game_Unit.prototype.randomTarget = function() {
		this._targetable = true;
		const target = _Game_Unit_randomTarget.call(this);
		this._targetable = false;
		return target;
	};
	
})();

