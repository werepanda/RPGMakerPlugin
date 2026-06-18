//=============================================================================
// PANDA_ExAirshipLand.js
//=============================================================================
// [Update History]
// 2024-04-04 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc Enables to get off the airship even if it overlaps with dummy events.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240404003801.html
 * @orderBefore PANDA_VehicleCommon
 * 
 * @help By RPG Maker default, players can not get off the airship
 * at a position that overlaps with an event.
 * This plugin makes it possible to get off the airship even in a position
 * that overlaps with an event that meets any of the following.
 *  - Through is ON
 *  - Priority is "Below characters" and Contents is empty
 * 
 * When using this plugin together with "PANDA_VehicleCommon.js",
 * which execute a common event when boarding/disembarking from vehicle etc.
 * please place this plugin before "PANDA_VehicleCommon.js".
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc ダミーイベントと重なる位置でも飛行船から下りられるようにします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240404003801.html
 * @orderBefore PANDA_VehicleCommon
 * 
 * @help ツクール標準では、イベントと重なる位置では飛行船から下りられませんが、
 * このプラグインを導入すると、以下のいずれかを満たすイベントであれば、
 * 重なった位置でも飛行船から下りられるようになります。
 *  - すり抜けがON
 *  - プライオリティが「通常キャラの下」かつ実行内容が空
 * 
 * 乗り物への乗降開始時・完了時・下船不可時にコモンイベントを実行する
 * 「PANDA_VehicleCommon.js」と併用する場合は、
 * 本プラグインを「PANDA_VehicleCommon.js」より前に配置してください。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 더미 이벤트와 겹치는 위치에서도 비행선에서 내릴 수 있도록 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240404003801.html
 * @orderBefore PANDA_VehicleCommon
 * 
 * @help RPG Maker 표준에서는 이벤트와 겹치는 위치에서는 비행선에서 내릴 수 없지만,
 * 이 플래그인을 도입하면, 다음 중 하나에 맞는 이벤트라면,
 * 겹치는 위치에서도 비행선에서 내릴 수 있게 됩니다.
 *  - 통과가 ON
 *  - 우선권이 "보통 캐릭터의 아래"이고 실행 내용이 비어 있음
 * 
 * 탈 것에 승강 개시시, 완료시, 하선 불가시에 공통 이벤트를 실행하는
 * "PANDA_VehicleCommon.js"와 같이 사용하는 경우에는,
 * 본 플래그인을 "PANDA_VehicleCommon.js"보다 앞에 배치해 주십시오.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_Vehicle.isLandOk
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Vehicle_isLandOk = Game_Vehicle.prototype.isLandOk;
	Game_Vehicle.prototype.isLandOk = function(x, y, d) {
		let result = _Game_Vehicle_isLandOk.call(this, x, y, d);
		if (this.isAirship() && !result) {
			result = $gameMap.isAirshipLandOk(x, y) && !this.isCollidedWithAirship(x, y);
		}
		return result;
	};
	
	//--------------------------------------------------
	// Game_CharacterBase.isCollidedWithAirship
	//  [New Definition]
	//--------------------------------------------------
	Game_CharacterBase.prototype.isCollidedWithAirship = function(x, y) {
		let result = this.isCollidedWithVehicles(x, y);
		if (!result) {
			const events = $gameMap.eventsXyNt(x, y);
			result = events.some(event => event.isCollidedEvent());
		}
		return result;
	};
	
	//--------------------------------------------------
	// Game_CharacterBase.isCollidedEvent
	//  [New Definition]
	//--------------------------------------------------
	Game_CharacterBase.prototype.isCollidedEvent = function() {
		if (this._priorityType === 0) {
			const list = this.list();
			return (list && list.length > 1);
		}
		return true;
	}
	
})();

