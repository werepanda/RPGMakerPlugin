//=============================================================================
// PANDA_AnimationOffsetByEnemy.js
//=============================================================================
// [Update History]
// 2024-04-14 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc Allows animation offset to be changed for each enemy.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240414122820.html
 * 
 * @help By writing the following in the Note field of enemies,
 * you can adjust the display position of the battle animation for each enemy.
 *  <animationOffsetX:n> Shifts all target animations by n dots horizontally.
 *  <animationOffsetY:n> Shifts all target animations by n dots vertically.
 *  <animationOffsetXm:n> Shifts ID=m animation by n dots horizontally.
 *  <animationOffsetYm:n> Shifts ID=m animation by n dots vertically.
 * 
 * Only animations whose Display Type is "For each target" are the target.
 * MV-compatible animations are not applicable.
 * The above values will be added to the Offset XY in the animation itself.
 * The values specified for all animations will not be reflected
 * in individually specified animations.
 * 
 * Setting Example:
 *  <animationOffsetX:100>
 *  <animationOffsetY:-200>
 *  <animationOffsetY21:50>
 *  <animationOffsetX123:-150>
 *  <animationOffsetY123:0>
 * For this enemy, all animations whose Display Type is "For each enemy"
 * will be displayed shifted horizontally by 100 dots to the right
 * and vertically shifted by 200 dots upwards.
 * Animation ID 21 is displayed horizontally shifted 100 dots to the right
 * like the others, but vertically shifted 50 dots downward.
 * Animation ID 123 is displayed horizontally shifted 150 dots to the left,
 * and displayed without shifting in the vertical direction.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc アニメーションのオフセットを敵ごとに変えられるようにします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240414122820.html
 * 
 * @help 敵キャラのメモ欄に以下の記述をすることで、
 * その敵キャラに対する戦闘アニメーションの表示位置を調整することができます。
 *  <animationOffsetX:n>  全ての対象アニメーションを横方向にnドットずらします
 *  <animationOffsetY:n>  全ての対象アニメーションを縦方向にnドットずらします
 *  <animationOffsetXm:n> IDがm番のアニメーションを横方向にnドットずらします
 *  <animationOffsetYm:n> IDがm番のアニメーションを縦方向にnドットずらします
 * 
 * 対象となるアニメーションは、表示タイプが「対象ごと」のもののみです。
 * また、MV互換アニメーションは対象外です。
 * アニメーション自体に設定されているオフセットXYに上記の値が加算されます。
 * 個別に指定されたアニメーションには、全てで指定した値は反映されません。
 * 
 * 設定例：
 *  <animationOffsetX:100>
 *  <animationOffsetY:-200>
 *  <animationOffsetY21:50>
 *  <animationOffsetX123:-150>
 *  <animationOffsetY123:0>
 * この敵キャラに対して、表示タイプが「対象ごと」のアニメーションは全て
 * 横方向は右に100ドット、縦方向は上に200ドットずれて表示されます。
 * IDが21番のアニメーションは、横方向は他と同じく右に100ドットずれますが、
 * 縦方向は下に50ドットずれて表示されます。
 * IDが123番のアニメーションは、横方向は左に150ドットずれて表示され、
 * 縦方向はずれずに表示されます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 애니메이션 오프셋을 적 캐릭터마다 변경할 수 있게 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240414122820.html
 * 
 * @help 적 캐릭터의 메모란에 아래와 같이 기재하면,
 * 그 적 캐릭터에 대한 전투 애니메이션의 표시 위치를 조정할 수 있습니다.
 *  <animationOffsetX:n>  모든 대상 애니메이션을 가로 방향으로 n도트 이동시킴.
 *  <animationOffsetY:n>  모든 대상 애니메이션을 세로 방향으로 n도트 이동시킴.
 *  <animationOffsetXm:n> ID가 m번인 애니메이션을 가로 방향으로 n도트 이동시킴.
 *  <animationOffsetYm:n> ID가 m번인 애니메이션을 세로 방향으로 n도트 이동시킴.
 * 
 * 대상이 되는 애니메이션은 디스플레이 유형이 "대상별"인 것뿐입니다.
 * 또 MV호환 애니메이션은 대상외입니다.
 * 애니메이션 자체에 설정된 오프셋 XY에 위의 값이 더해집니다.
 * 개별적으로 지정된 애니메이션에는 모두로 지정한 값은 반영되지 않습니다.
 * 
 * 설정 예:
 *  <animationOffsetX:100>
 *  <animationOffsetY:-200>
 *  <animationOffsetY21:50>
 *  <animationOffsetX123:-150>
 *  <animationOffsetY123:0>
 * 이 적 캐릭터에 대해서, 디스플레이 유형이 "대상별"인 애니메이션은 모두
 * 가로 방향은 오른쪽으로 100 도트, 세로 방향은 위로 200 도트
 * 이동되어 표시됩니다.
 * ID가 21번인 애니메이션은 가로 방향은 다른 것과 같이 오른쪽으로 100 도트
 * 이동되어 표시되지만, 세로 방향은 아래로 50 도트 이동되어 표시됩니다.
 * ID가 123번인 애니메이션은 가로 방향이 왼쪽으로 150 도트 이동되어 표시되고
 * 세로 방향으로는 이동되지 않고 표시됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Sprite_Animation.setup
	//  [Additional Definition]
	//--------------------------------------------------
	const _Sprite_Animation_setup = Sprite_Animation.prototype.setup;
	Sprite_Animation.prototype.setup = function(targets, animation, mirror, delay, previous) {
		_Sprite_Animation_setup.apply(this, arguments);
		if (animation.displayType === 0 && targets.length === 1 && targets[0]._enemy) {
			const enemy = targets[0]._enemy;
			const animationId = animation.id;
			const offsetX = enemy.animationOffsetX(animationId);
			const offsetY = enemy.animationOffsetY(animationId);
			if (offsetX || offsetY) {
				const ani = JsonEx.makeDeepCopy(animation);
				ani.offsetX += offsetX;
				ani.offsetY += offsetY;
				this._animation = ani;
			}
		}
	};
	
	
	//--------------------------------------------------
	// Game_Enemy.animationOffsetX
	//  [New Definition]
	//--------------------------------------------------
	Game_Enemy.prototype.animationOffsetX = function(animationId) {
		const enemy = this.enemy();
		if (enemy.meta['animationOffsetX' + animationId] === undefined) {
			return Number(enemy.meta.animationOffsetX) || 0;
		} else {
			return Number(enemy.meta['animationOffsetX' + animationId]) || 0;
		}
	}
	
	//--------------------------------------------------
	// Game_Enemy.animationOffsetY
	//  [New Definition]
	//--------------------------------------------------
	Game_Enemy.prototype.animationOffsetY = function(animationId) {
		const enemy = this.enemy();
		if (enemy.meta['animationOffsetY' + animationId] === undefined) {
			return Number(enemy.meta.animationOffsetY) || 0;
		} else {
			return Number(enemy.meta['animationOffsetY' + animationId]) || 0;
		}
	}
	
})();

