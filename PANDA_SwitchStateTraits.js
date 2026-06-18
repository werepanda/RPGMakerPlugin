//=============================================================================
// PANDA_SwitchStateTraits.js
//=============================================================================
// [Update History]
// 2022-07-29 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc switch the traits of states between actors and enemies.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220729004348.html
 * 
 * @help [How to Use]
 * By writing the following in the note of the state,
 * the traits specified in the state can be applied only to actors or enemies.
 * 
 * <traitsOnlyActor:n> A trait #n applies only to actors.
 * <traitsOnlyEnemy:n> A trait #n applies only to enemies.
 * Multiple trait numbers can be specified by separating them with commas(,).
 * 
 * Example: When the traits are following:
 *   - Ex-Parameters  Hit Rate -50%
 *   - Ex-Parameters  Hit Rate -30%
 *   - Sp-Parameters  Target Rate *200%
 *   - Ex-Parameters  Evasion Rate -100%
 *  <traitsOnlyActor:3>   -> Target Rate * 200% applies only to actors.
 *  <traitsOnlyEnemy:2,4> -> Hit Rate -30% and Evasion Rate -100% applies only
 *                           to enemies.
 *  Trait #1 Hit Rate -50% applies to both actors and enemies.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc ステートの特徴をアクターか敵キャラかで切り替えられます。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220729004348.html
 * 
 * @help ■ 使い方
 * ステートのメモ欄に以下の記述をすることで、ステートに指定された特徴を
 * アクターのみ、または敵キャラのみに適用させることができます。
 * 
 * <traitsOnlyActor:特徴番号> 指定した番号の特徴はアクターにのみ適用されます。
 * <traitsOnlyEnemy:特徴番号> 指定した番号の特徴は敵キャラにのみ適用されます。
 * 特徴番号はカンマ(,)で区切ることで複数指定することが可能です。
 * 
 * 例：特徴が以下で指定されている時
 *   ・追加能力値　命中率 -50%
 *   ・追加能力値　命中率 -30%
 *   ・特殊能力値　狙われ率 *200%
 *   ・追加能力値　回避率 -100%
 *  <traitsOnlyActor:3>   → アクターのみ狙われ率*200%が適用
 *  <traitsOnlyEnemy:2,4> → 敵キャラのみ命中率-30%と回避率-100%が適用
 *  1番目の命中率-50%はアクター・敵キャラ両方に適用
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 스탯의 특성을 액터인지 적 캐릭터인지로 전환할 수 있습니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220729004348.html
 * 
 * @help [사용법]
 * 스탯의 메모란에 이하 같이 기술하면 스탯에 지정된 특성을
 * 액터에만, 또는 적 캐릭터에만 적용시킬 수 있습니다.
 * 
 * <traitsOnlyActor:특성 번호> 지정된 번호의 특성은 액터에만 적용됩니다.
 * <traitsOnlyEnemy:특성 번호> 지정된 번호의 특성은 적 캐릭터에만 적용됩니다.
 * 특성 번호는 쉼표(,)로 구분하여 복수 지정할 수 있습니다.
 * 
 * 예) 특성이 아래와 같이 지정될 때
 *   - 추가 능력치  명중률 -50%
 *   - 추가 능력치  명중률 -30%
 *   - 특수 능력치  표적이 될 확률 *200%
 *   - 추가 능력치  회피율 -100%
 *  <traitsOnlyActor:3>   -> 액터에만 표적이 될 확률 * 200%가 적용
 *  <traitsOnlyEnemy:2,4> -> 적 캐릭터에만 명중률 -30%와 회피율 -100%가 적용
 *  첫번째 명중률 -50%는 액터와 적 캐릭터 모두에 적용됨.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_BattlerBase.allTraits
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_BattlerBase_allTraits = Game_BattlerBase.prototype.allTraits;
	Game_BattlerBase.prototype.allTraits = function() {
		return this.traitObjects().reduce((r, obj) => r.concat(obj.traits.filter((value, index) => {
		  if (this.isActor()) {
				if (obj.meta.traitsOnlyEnemy) {
					return !(obj.meta.traitsOnlyEnemy.split(',').map(Number).includes(index + 1));
				} else {
					return true;
				}
			} else {
				if (obj.meta.traitsOnlyActor) {
					return !(obj.meta.traitsOnlyActor.split(',').map(Number).includes(index + 1));
				} else {
					return true;
				}
			}
		})), []);
	};
	
})();

