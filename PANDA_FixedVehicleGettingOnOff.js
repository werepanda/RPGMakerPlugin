//=============================================================================
// PANDA_FixedVehicleGettingOnOff.js
//=============================================================================
// [Update History]
// 2023-10-13 Ver.1.0.0 First Release for MZ/MV.

/*:
 * @target MV MZ
 * @plugindesc menu screen is disabled while getting on or off vehicle.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231013020949.html
 * 
 * @help This plugin prevents players from opening the menu screen
 * while getting on or off a vehicle.
 * 
 * By default, when the party gets on or off a vehicle with player followers,
 * a player can open the menu screen while followers are getting on or off.
 * However, this can cause unexpected errors,
 * so the menu screen is disabled until followers have get on or off the vehicle.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 乗り物の乗降中はメニュー画面を禁止します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231013020949.html
 * 
 * @help 乗り物の乗降中はメニュー画面を開けないようにするプラグインです。
 * 
 * 標準では、パーティーの隊列歩行がONの状態で乗り物の乗り降りをすると、
 * 隊列メンバーの乗降が済むまでの間に、メニュー画面を開くことができてしまいます。
 * しかしこれは思わぬ不具合の原因となるため、
 * 乗降が済むまではメニュー画面を開けないようにします。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 탈 것에 승강하는 중에는 메뉴 화면을 금지합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231013020949.html
 * 
 * @help 탈 것에 승강하는 중에는 메뉴 화면을 열지 못하도록 하는 플러그인입니다.
 * 
 * 표준으로는 파티의 대열 보행이 ON 상태에서 탈 것에 오르거나 내리거나 할 때,
 * 대열 멤버의 승강이 끝나기 전에 메뉴 화면을 열 수 있습니다.
 * 그러나 이는 예상치 못한 오류의 원인이 되기 때문에,
 * 승강이 다 끝날 때까지는 메뉴 화면을 열 수 없게 합니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_Player.isVehicleGetting
	//  [New Definition]
	//--------------------------------------------------
	Game_Player.prototype.isVehicleGetting = function() {
		return this._vehicleGettingOn || this._vehicleGettingOff;
	};
	
	//--------------------------------------------------
	// Scene_Map.isMenuEnabled
	//  [Added Definition]
	//--------------------------------------------------
	const _Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
	Scene_Map.prototype.isMenuEnabled = function() {
		return _Scene_Map_isMenuEnabled.call(this) && !$gamePlayer.isVehicleGetting();
	};
	
})();

