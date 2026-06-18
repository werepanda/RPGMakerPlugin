//=============================================================================
// PANDA_CrisisColorTo2Levels.js
//=============================================================================
// [Update History]
// 2024-11-25 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc divide the text color when in a pinch into 2 levels.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20241125220213.html
 * 
 * @help Divide the change of the actor's text color when HP is low
 * into 2 levels, Crisis and Fatal.
 * 
 * The threshold % and text color can be set in the plugin parameters.
 * The default settings are as follows.
 * Crisis: Yellow (color number 17) when HP is less than 25% of Max HP
 * Fatal : Vermilion (color number 2) when HP is less than 10% of Max HP
 * 
 * Can also use in conjunction with the plugin PANDA_CrisisColorForEnemy.js
 * which applies the text color in a pinch for enemy names.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param CrisisRate
 * @text HP Rate when in Crisis
 * @desc The battler will be in Crisis (Level 1) when HP is less than the specified % of Max HP.
 * @type number
 * @default 25
 * @decimals 0
 * @max 100
 * @min 0
 * 
 * @param CrisisColor
 * @text Color for Crisis
 * @desc Specify the color number for Crisis (Level 1).
 * @type color
 * @default 17
 * @decimals 0
 * @max 31
 * @min 0
 * 
 * @param FatalRate
 * @text HP Rate when in Fatal
 * @desc The battler will be in Fatal (Level 2) when HP is less than the specified % of Max HP.
 * @type number
 * @default 10
 * @decimals 0
 * @max 100
 * @min 0
 * 
 * @param FatalColor
 * @text Color for Fatal
 * @desc Specify the color number for Fatal (Level 2).
 * @type color
 * @default 2
 * @decimals 0
 * @max 31
 * @min 0
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc ピンチ状態の時の文字色を2段階に分けます。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20241125220213.html
 * 
 * @help HPが少なくなった時のアクターの文字色変化を
 * 危機(Crisis)と瀕死(Fatal)の2段階に分割します。
 * 
 * 閾値の%と文字色はプラグインパラメータで設定可能です。
 * デフォルトでは以下の設定となっています。
 * 危機(Crisis)：HPが最大HPの25%未満の時、黄色（色番号17）
 * 瀕死(Fatal) ：HPが最大HPの10%未満の時、朱色（色番号2）
 * 
 * ピンチ状態の文字色を敵キャラ名にも反映させるプラグイン
 * (PANDA_CrisisColorForEnemyName.js)との併用も可能です。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param CrisisRate
 * @text 危機のHP割合
 * @desc HPが最大HPの指定%未満になった時に危機状態（1段階目）とします。
 * @type number
 * @default 25
 * @decimals 0
 * @max 100
 * @min 0
 * 
 * @param CrisisColor
 * @text 危機時の文字色
 * @desc 危機状態（1段階目）の色番号を指定します。
 * @type color
 * @default 17
 * @decimals 0
 * @max 31
 * @min 0
 * 
 * @param FatalRate
 * @text 瀕死のHP割合
 * @desc HPが最大HPの指定%未満になった時に瀕死状態（2段階目）とします。
 * @type number
 * @default 10
 * @decimals 0
 * @max 100
 * @min 0
 * 
 * @param FatalColor
 * @text 瀕死時の文字色
 * @desc 瀕死状態（2段階目）の色番号を指定します。
 * @type color
 * @default 2
 * @decimals 0
 * @max 31
 * @min 0
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 핀치 상태일 때의 문자색을 2단계로 나눕니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20241125220213.html
 * 
 * @help HP가 적어졌을 때의 액터의 문자색 변화를
 * 위기(Crisis)와 빈사(Fatal)의 2단계로 분활합니다.
 * 
 * 임계값의 %와 문자색은 플러그인 매개 변수로 설정할 수 있습니다.
 * 초기값은 다음과 같습니다.
 * 위기(Crisis):HP가 최대HP의 25% 미만일 때 노란색 (색번호 17)
 * 빈사(Fatal) :HP가 최대HP의 10% 미만일 때 주홍색 (색번호 2)
 * 
 * 핀치 상태의 문자색을 적 캐릭터명에도 반영시키는 플러그인
 * (PANDA_CrisisColorForEnemyName.js)과도 같이 사용할 수 있습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param CrisisRate
 * @text 위기의 HP 비율
 * @desc HP가 최대HP의 지정% 미만이 되었을 때 위기 상태(1단계째)로 합니다.
 * @type number
 * @default 25
 * @decimals 0
 * @max 100
 * @min 0
 * 
 * @param CrisisColor
 * @text 위기시 문자색
 * @desc 위기 상태(1단계째)의 색 번호를 지정합니다.
 * @type color
 * @default 17
 * @decimals 0
 * @max 31
 * @min 0
 * 
 * @param FatalRate
 * @text 빈사의 HP 비율
 * @desc HP가 최대HP의 지정% 미만이 되었을 때 빈사 상태(2단계째)로 합니다.
 * @type number
 * @default 10
 * @decimals 0
 * @max 100
 * @min 0
 * 
 * @param FatalColor
 * @text 빈사시 문자색
 * @desc 빈사 상태(2단계째)의 색 번호를 지정합니다.
 * @type color
 * @default 2
 * @decimals 0
 * @max 31
 * @min 0
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const CrisisRate = Number(parameters['CrisisRate']) / 100 || 0;
	const CrisisColor = Number(parameters['CrisisColor']) || 0;
	const FatalRate = Number(parameters['FatalRate']) / 100 || 0;
	const FatalColor = Number(parameters['FatalColor']) || 0;
	
	
	//--------------------------------------------------
	// ColorManager.crisisColor
	//  [Added Definition]
	//--------------------------------------------------
	const _ColorManager_crisisColor = ColorManager.crisisColor;
	ColorManager.crisisColor = function() {
		//return this.textColor(17);
		return this.textColor(CrisisColor);
	};
	
	//--------------------------------------------------
	// ColorManager.fatalColor
	//  [New Definition]
	//--------------------------------------------------
	ColorManager.fatalColor = function() {
		return this.textColor(FatalColor);
	};
	
	//--------------------------------------------------
	// ColorManager.hpColor
	//  [Added Definition]
	//--------------------------------------------------
	const _ColorManager_hpColor = ColorManager.hpColor;
	ColorManager.hpColor = function(actor) {
		const color = _ColorManager_hpColor.call(this, actor);
		if (actor && actor.isFatal()) {
			return this.fatalColor();
		} else {
			return color;
		}
	};
	
	
	//--------------------------------------------------
	// Game_BattlerBase.isDying
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_BattlerBase_isDying = Game_BattlerBase.prototype.isDying;
	Game_BattlerBase.prototype.isDying = function() {
		//return this.isAlive() && this._hp < this.mhp / 4;
		return this.isAlive() && this._hp < this.mhp * CrisisRate;
	};
	
	//--------------------------------------------------
	// Game_BattlerBase.isFatal
	//  [New Definition]
	//--------------------------------------------------
	Game_BattlerBase.prototype.isFatal = function() {
		return this.isAlive() && this._hp < this.mhp * FatalRate;
	};
	
})();

