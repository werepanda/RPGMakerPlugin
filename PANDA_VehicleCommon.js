//=============================================================================
// PANDA_VehicleCommon.js
//=============================================================================
// [Update History]
// 2024-03-24 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc Execute a common event when getting on/off the vehicles.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240324161555.html
 * 
 * @help Execute the specified common event at the following timings for each vehicle.
 * - When starting to board
 * - When boarding is completed
 * - When starting to disembark
 * - When disembarkation is completed
 * - When can't get off the vehicle
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * [Reference]
 * VehicleCommon.js by Yana
 *
 * @param GetOnBoatCommonID
 * @text Starting to get on a boat Common Event
 * @desc Specify the common event ID to be executed when starting to get on a boat.
 * @type common_event
 * @default 0
 *
 * @param GetOnShipCommonID
 * @text Starting to get on a ship Common Event
 * @desc Specify the common event ID to be executed when starting to get on a ship.
 * @type common_event
 * @default 0
 *
 * @param GetOnAirshipCommonID
 * @text Starting to get on an airship Common Event
 * @desc Specify the common event ID to be executed when starting to get on an airship.
 * @type common_event
 * @default 0
 *
 * @param GotOnBoatCommonID
 * @text Completed to get on a boat Common Event
 * @desc Specify the common event ID to be executed when completed to get on a boat.
 * @type common_event
 * @default 0
 *
 * @param GotOnShipCommonID
 * @text Completed to get on a ship Common Event
 * @desc Specify the common event ID to be executed when completed to get on a ship.
 * @type common_event
 * @default 0
 *
 * @param GotOnAirshipCommonID
 * @text Completed to get on an airship Common Event
 * @desc Specify the common event ID to be executed when completed to get on an airship.
 * @type common_event
 * @default 0
 *
 * @param GetOffBoatCommonID
 * @text Starting to get off a boat Common Event
 * @desc Specify the common event ID to be executed when starting to get off a boat.
 * @type common_event
 * @default 0
 *
 * @param GetOffShipCommonID
 * @text Starting to get off a ship Common Event
 * @desc Specify the common event ID to be executed when starting to get off a ship.
 * @type common_event
 * @default 0
 *
 * @param GetOffAirshipCommonID
 * @text Starting to get off an airship Common Event
 * @desc Specify the common event ID to be executed when starting to get off an airship.
 * @type common_event
 * @default 0
 *
 * @param GotOffBoatCommonID
 * @text Completed to get off a boat Common Event
 * @desc Specify the common event ID to be executed when completed to get off a boat.
 * @type common_event
 * @default 0
 *
 * @param GotOffShipCommonID
 * @text Completed to get off a ship Common Event
 * @desc Specify the common event ID to be executed when completed to get off a ship.
 * @type common_event
 * @default 0
 *
 * @param GotOffAirshipCommonID
 * @text Completed to get off an airship Common Event
 * @desc Specify the common event ID to be executed when completed to get off an airship.
 * @type common_event
 * @default 0
 *
 * @param LandNGBoatCommonID
 * @text Can't get off a boat Common Event
 * @desc Specify the common event ID to be executed when getting off a boat is not possible.
 * @type common_event
 * @default 0
 *
 * @param LandNGShipCommonID
 * @text Can't get off a ship Common Event
 * @desc Specify the common event ID to be executed when getting off a ship is not possible.
 * @type common_event
 * @default 0
 *
 * @param LandNGAirshipCommonID
 * @text Can't get off an airship Common Event
 * @desc Specify the common event ID to be executed when getting off an airship is not possible.
 * @type common_event
 * @default 0
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 乗り物への乗降開始時・完了時・下船不可時にコモンイベントを実行します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240324161555.html
 * 
 * @help それぞれの乗り物への以下のタイミングで指定したコモンイベントを実行します。
 * - 乗り込みを開始した時
 * - 乗り込みが完了した時
 * - 下船を開始した時
 * - 下船が完了した時
 * - 乗り物から下りられない時
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * ■ 参考
 * VehicleCommon.js by Yana様
 *
 * @param GetOnBoatCommonID
 * @text 小型船乗込開始時コモンイベント
 * @desc 小型船に乗り込みを開始した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GetOnShipCommonID
 * @text 大型船乗込開始時コモンイベント
 * @desc 大型船に乗り込みを開始した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GetOnAirshipCommonID
 * @text 飛行船乗込開始時コモンイベント
 * @desc 飛行船に乗り込みを開始した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GotOnBoatCommonID
 * @text 小型船乗込完了時コモンイベント
 * @desc 小型船に乗り込みを完了した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GotOnShipCommonID
 * @text 大型船乗込完了時コモンイベント
 * @desc 大型船に乗り込みを完了した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GotOnAirshipCommonID
 * @text 飛行船乗込完了時コモンイベント
 * @desc 飛行船に乗り込みを完了した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GetOffBoatCommonID
 * @text 小型船下船開始時コモンイベント
 * @desc 小型船から下船を開始した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GetOffShipCommonID
 * @text 大型船下船開始時コモンイベント
 * @desc 大型船から下船を開始した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GetOffAirshipCommonID
 * @text 飛行船下船開始時コモンイベント
 * @desc 飛行船から下船を開始した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GotOffBoatCommonID
 * @text 小型船下船完了時コモンイベント
 * @desc 小型船から下船を完了した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GotOffShipCommonID
 * @text 大型船下船完了時コモンイベント
 * @desc 大型船から下船を完了した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param GotOffAirshipCommonID
 * @text 飛行船下船完了時コモンイベント
 * @desc 飛行船から下船を完了した時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param LandNGBoatCommonID
 * @text 小型船下船不可時コモンイベント
 * @desc 小型船から下りられない時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param LandNGShipCommonID
 * @text 大型船下船不可時コモンイベント
 * @desc 大型船から下りられない時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 *
 * @param LandNGAirshipCommonID
 * @text 飛行船下船不可時コモンイベント
 * @desc 飛行船から下りられない時に実行するコモンイベントのIDを指定します。
 * @type common_event
 * @default 0
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 탈 것에 승강 개시시, 완료시, 하선 불가시에 공통 이벤트를 실행합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20240324161555.html
 * 
 * @help 각 탈 것에 대한 다음과 같은 타이밍에서 지정된 공통 이벤트를 실행합니다.
 * - 탑승을 시작했을 때
 * - 탑승이 완료됐을 때
 * - 하선을 시작했을 때
 * - 하선이 완료됐을 때
 * - 탈 것에서 내릴 수 없을 때
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * [참조]
 * VehicleCommon.js by Yana 님
 *
 * @param GetOnBoatCommonID
 * @text 보트 탑승 개시시 공통 이벤트
 * @desc 보트에 탑승을 시작했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GetOnShipCommonID
 * @text 선박 탑승 개시시 공통 이벤트
 * @desc 선박에 탑승을 시작했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GetOnAirshipCommonID
 * @text 비행선 탑승 개시시 공통 이벤트
 * @desc 비행선에 탑승을 시작했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GotOnBoatCommonID
 * @text 보트 탑승 완료시 공통 이벤트
 * @desc 보트에 탑승을 완료했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GotOnShipCommonID
 * @text 선박 탑승 완료시 공통 이벤트
 * @desc 선박에 탑승을 완료했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GotOnAirshipCommonID
 * @text 비행선 탑승 완료시 공통 이벤트
 * @desc 비행선에 탑승을 완료했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GetOffBoatCommonID
 * @text 보트 하선 개시시 공통 이벤트
 * @desc 보트에 하선을 시작했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GetOffShipCommonID
 * @text 선박 하선 개시시 공통 이벤트
 * @desc 선박에 하선을 시작했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GetOffAirshipCommonID
 * @text 비행선 하선 개시시 공통 이벤트
 * @desc 비행선에 하선을 시작했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GotOffBoatCommonID
 * @text 보트 하선 완료시 공통 이벤트
 * @desc 보트에 하선을 완료했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GotOffShipCommonID
 * @text 선박 하선 완료시 공통 이벤트
 * @desc 선박에 하선을 완료했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param GotOffAirshipCommonID
 * @text 비행선 하선 완료시 공통 이벤트
 * @desc 비행선에 하선을 완료했을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param LandNGBoatCommonID
 * @text 보트 하선 불가시 공통 이벤트
 * @desc 보트에서 내릴 수 없을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param LandNGShipCommonID
 * @text 선박 하선 불가시 공통 이벤트
 * @desc 선박에서 내릴 수 없을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 *
 * @param LandNGAirshipCommonID
 * @text 비행선 하선 불가시 공통 이벤트
 * @desc 비행선에서 내릴 수 없을 때 실행할 공통 이벤트의 ID를 지정합니다.
 * @type common_event
 * @default 0
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const GetOnBoatCommonID = Number(parameters['GetOnBoatCommonID']) || 0;
	const GetOnShipCommonID = Number(parameters['GetOnShipCommonID']) || 0;
	const GetOnAirshipCommonID = Number(parameters['GetOnAirshipCommonID']) || 0;
	const GotOnBoatCommonID = Number(parameters['GotOnBoatCommonID']) || 0;
	const GotOnShipCommonID = Number(parameters['GotOnShipCommonID']) || 0;
	const GotOnAirshipCommonID = Number(parameters['GotOnAirshipCommonID']) || 0;
	const GetOffBoatCommonID = Number(parameters['GetOffBoatCommonID']) || 0;
	const GetOffShipCommonID = Number(parameters['GetOffShipCommonID']) || 0;
	const GetOffAirshipCommonID = Number(parameters['GetOffAirshipCommonID']) || 0;
	const GotOffBoatCommonID = Number(parameters['GotOffBoatCommonID']) || 0;
	const GotOffShipCommonID = Number(parameters['GotOffShipCommonID']) || 0;
	const GotOffAirshipCommonID = Number(parameters['GotOffAirshipCommonID']) || 0;
	const LandNGBoatCommonID = Number(parameters['LandNGBoatCommonID']) || 0;
	const LandNGShipCommonID = Number(parameters['LandNGShipCommonID']) || 0;
	const LandNGAirshipCommonID = Number(parameters['LandNGAirshipCommonID']) || 0;
	
	
	//--------------------------------------------------
	// Game_Player.updateVehicleGetOff
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Player_updateVehicleGetOff = Game_Player.prototype.updateVehicleGetOff;
	Game_Player.prototype.updateVehicleGetOff = function() {
		if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
			if (this.isInBoat() && GotOffBoatCommonID) {
				$gameTemp.reserveCommonEvent(GotOffBoatCommonID);
			}
			if (this.isInShip() && GotOffShipCommonID) {
				$gameTemp.reserveCommonEvent(GotOffShipCommonID);
			}
			if (this.isInAirship() && GotOffAirshipCommonID) {
				$gameTemp.reserveCommonEvent(GotOffAirshipCommonID);
			}
		}
		_Game_Player_updateVehicleGetOff.call(this);
	};
	
	//--------------------------------------------------
	// Game_Player.getOnVehicle
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Player_getOnVehicle = Game_Player.prototype.getOnVehicle;
	Game_Player.prototype.getOnVehicle = function() {
		if (_Game_Player_getOnVehicle.call(this)) {
			if (this.isInBoat() && GetOnBoatCommonID) {
				$gameTemp.reserveCommonEvent(GetOnBoatCommonID);
			}
			if (this.isInShip() && GetOnShipCommonID) {
				$gameTemp.reserveCommonEvent(GetOnShipCommonID);
			}
			if (this.isInAirship() && GetOnAirshipCommonID) {
				$gameTemp.reserveCommonEvent(GetOnAirshipCommonID);
			}
		}
		return this._vehicleGettingOn;
	};
	
	//--------------------------------------------------
	// Game_Vehicle.getOff
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Vehicle_getOff = Game_Vehicle.prototype.getOff;
	Game_Vehicle.prototype.getOff = function() {
		_Game_Vehicle_getOff.call(this);
		if (this.isBoat() && GetOffBoatCommonID) {
			$gameTemp.reserveCommonEvent(GetOffBoatCommonID);
		}
		if (this.isShip() && GetOffShipCommonID) {
			$gameTemp.reserveCommonEvent(GetOffShipCommonID);
		}
		if (this.isAirship() && GetOffAirshipCommonID) {
			$gameTemp.reserveCommonEvent(GetOffAirshipCommonID);
		}
	};
	
	//--------------------------------------------------
	// Game_Vehicle.getOn
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Vehicle_getOn = Game_Vehicle.prototype.getOn;
	Game_Vehicle.prototype.getOn = function() {
		_Game_Vehicle_getOn.call(this);
		if (this.isBoat() && GotOnBoatCommonID) {
			$gameTemp.reserveCommonEvent(GotOnBoatCommonID);
		}
		if (this.isShip() && GotOnShipCommonID) {
			$gameTemp.reserveCommonEvent(GotOnShipCommonID);
		}
		if (this.isAirship() && GotOnAirshipCommonID) {
			$gameTemp.reserveCommonEvent(GotOnAirshipCommonID);
		}
	};
	
	//--------------------------------------------------
	// Game_Vehicle.isLandOk
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Vehicle_isLandOk = Game_Vehicle.prototype.isLandOk;
	Game_Vehicle.prototype.isLandOk = function(x, y, d) {
		const result = _Game_Vehicle_isLandOk.call(this, x, y, d);
		if (!result) {
			if (this.isBoat() && LandNGBoatCommonID) {
				$gameTemp.reserveCommonEvent(LandNGBoatCommonID);
			}
			if (this.isShip() && LandNGShipCommonID) {
				$gameTemp.reserveCommonEvent(LandNGShipCommonID);
			}
			if (this.isAirship() && LandNGAirshipCommonID) {
				$gameTemp.reserveCommonEvent(LandNGAirshipCommonID);
			}
		}
		return result;
	};
	
})();

