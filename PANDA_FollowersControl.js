//=============================================================================
// PANDA_FollowersControl.js
//=============================================================================
// [Update History]
// 2022-09-24 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc plug-in command set to control the follower members.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220924223133.html
 * 
 * @help This plug-in provides the following plug-in commands
 * to control the follower members.
 * 
 * * Followers to Events
 * Copy the image, position, and direction of the followers
 * to the specified events, and enables operations with event commands
 * in the same way as normal events.
 * - Event ID List :
 *    Specify the event IDs to convert from the followers
 *    in order from the first follower.
 *    The followers specified 0 will be not converted to events.
 * - Continue Showing Followers :
 *    Specify ON/OFF to continue showing player followers.
 *    It should be better to specify ON when only some followers leaves,
 *    and OFF when converting all followers to events.
 * 
 * * Set Followers Direction
 * Turn the followers to the specified direction.
 * - Follower Index :
 *    Specify the index of the target follower.
 *    1 is the first follower (= the second party member).
 *    When 0 is specified, all followers will be targeted.
 * - Direction :
 *    Specify the direction followers to turn.
 *    In addition to up, down, left, and right,
 *    you can also specify the same direction as the player character.
 * 
 * * Get Followers Position
 * Gets the current location and direction of the specified follower
 * into variables. Items without specifying variables will be ignored.
 * - Follower Index :
 *    Specify the index of the target follower.
 *    1 is the first follower (= the second party member).
 * - Map X Variable :
 *    Specify the variable to get the Map X coordinate of the target follower.
 * - Map Y Variable :
 *    Specify the variable to get the Map Y coordinate of the target follower.
 * - Direction Variable :
 *    Specify the variable to get the direction of the target follower.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @command ToEvents
 * @text Followers to Events
 * @desc Converts followers into the specified events. The follower's image, position, and direction will be inherited to the event.
 * 
 * @arg eventList
 * @text Event ID List
 * @desc Event IDs converted from the followers. Specify ID in order from the first follower. If 0, it will be ignored.
 * @type number[]
 * @decimals 0
 * @min 0
 * @default ["0"]
 * 
 * @arg followersState
 * @text Continue Showing Followers
 * @desc Specify ON/OFF to continue showing player followers.
 * @type boolean
 * @default false
 * 
 * 
 * @command SetDirection
 * @text Set Followers Direction
 * @desc Turn the followers to the specified direction.
 * 
 * @arg followerIndex
 * @text Follower Index
 * @desc Specify the index of the target follower. 1 is the first follower. 0 means all followers.
 * @type number
 * @decimals 0
 * @min 0
 * @default 0
 * 
 * @arg direction
 * @text Direction
 * @desc Specify the direction followers to turn
 * @type select
 * @default 0
 * @option The same direction as the player
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * 
 * 
 * @command GetPosition
 * @text Get Followers Position
 * @desc Gets the current location and direction of the specified follower into variables.
 * 
 * @arg followerIndex
 * @text Follower Index
 * @desc Specify the index of the target follower. 1 is the first follower.
 * @type number
 * @decimals 0
 * @min 1
 * @default 1
 * 
 * @arg varMapX
 * @text Map X Variable
 * @desc Specify the variable number to get the Map X coordinate of the target follower.
 * @type variable
 * @default 0
 * 
 * @arg varMapY
 * @text Map Y Variable
 * @desc Specify the variable number to get the Map Y coordinate of the target follower.
 * @type variable
 * @default 0
 * 
 * @arg varDirection
 * @text Direction Variable
 * @desc Specify the variable number to get the direction of the target follower.
 * @type variable
 * @default 0
 * 
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 隊列歩行のメンバーを操作するプラグインです。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220924223133.html
 * 
 * @help 隊列歩行のメンバーの操作に関する以下のプラグインコマンドを提供します。
 * 
 * ◆ 隊列メンバーをイベントに変換
 * 指定したIDのイベントに隊列歩行メンバーの画像、位置、向きをコピーして、
 * 通常のイベントと同じようにイベントコマンドでの操作を可能にします。
 * - イベントIDリスト：
 *     隊列メンバーから変換されるイベントIDを、
 *     1番目の隊列メンバーから順にリストで指定します。
 *     0を指定するとそのメンバーはイベントに変換されません。
 * - 隊列歩行継続：
 *     隊列歩行を継続するかどうか、ON/OFFで指定します。
 *     一部のメンバーのみ離脱させる場合はON、
 *     全メンバーをイベントに変換する場合はOFFを指定するのがよいでしょう。
 * 
 * ◆ 隊列メンバーの向き指定
 * 隊列歩行メンバーを指定した方向に向かせます。
 * - 隊列メンバー番号：
 *     対象となる隊列メンバーの番号を指定します。
 *     1が1番目の隊列メンバー（＝2番目のパーティーメンバー）です。
 *     0を指定すると隊列メンバー全員が対象になります。
 * - 向き：
 *     向かせたい方向を指定します。
 *     上下左右のほか、プレイヤーキャラクターと同じ向きも指定できます。
 * 
 * ◆ 隊列メンバーの位置取得
 * 指定した隊列歩行メンバーの現在の位置と向きを変数に取得します。
 * 変数を指定しなかった項目は無視されます。
 * - 隊列メンバー番号：
 *     対象となる隊列メンバーの番号を指定します。
 *     1が1番目の隊列メンバー（＝2番目のパーティーメンバー）です。
 * - マップX変数番号：
 *     対象となる隊列メンバーのマップX座標を取得する変数番号を指定します。
 * - マップY変数番号：
 *     対象となる隊列メンバーのマップY座標を取得する変数番号を指定します。
 * - 向き変数番号：
 *     対象となる隊列メンバーの向きを取得する変数番号を指定します。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @command ToEvents
 * @text 隊列メンバーをイベントに変換
 * @desc 隊列メンバーを指定したID番号のイベントに変換します。メンバーの画像・位置・向きがイベントに引き継がれます。
 * 
 * @arg eventList
 * @text イベントIDリスト
 * @desc 隊列メンバーから変換されるイベントID。一番目の隊列メンバーから順にリストで指定します。0を指定すると無視されます。
 * @type number[]
 * @decimals 0
 * @min 0
 * @default ["0"]
 * 
 * @arg followersState
 * @text 隊列歩行継続
 * @desc 隊列歩行を継続するかどうか、ON/OFFで指定します。
 * @type boolean
 * @default false
 * 
 * 
 * @command SetDirection
 * @text 隊列メンバーの向き指定
 * @desc 隊列メンバーを指定した方向に向かせます。
 * 
 * @arg followerIndex
 * @text 隊列メンバー番号
 * @desc 対象となる隊列メンバーの番号を指定します。1が1番目の隊列メンバーで、0を指定すると隊列メンバー全員が対象になります。
 * @type number
 * @decimals 0
 * @min 0
 * @default 0
 * 
 * @arg direction
 * @text 向き
 * @desc 向かせたい方向を指定します。
 * @type select
 * @default 0
 * @option プレイヤーと同じ向き
 * @value 0
 * @option 下
 * @value 2
 * @option 左
 * @value 4
 * @option 右
 * @value 6
 * @option 上
 * @value 8
 * 
 * 
 * @command GetPosition
 * @text 隊列メンバーの位置取得
 * @desc 指定した隊列メンバーの現在の位置と向きを変数に取得します。
 * 
 * @arg followerIndex
 * @text 隊列メンバー番号
 * @desc 対象となる隊列メンバーの番号を指定します。1が1番目の隊列メンバーです。
 * @type number
 * @decimals 0
 * @min 1
 * @default 1
 * 
 * @arg varMapX
 * @text マップX変数番号
 * @desc 対象となる隊列メンバーのマップX座標を取得する変数番号を指定します。
 * @type variable
 * @default 0
 * 
 * @arg varMapY
 * @text マップY変数番号
 * @desc 対象となる隊列メンバーのマップY座標を取得する変数番号を指定します。
 * @type variable
 * @default 0
 * 
 * @arg varDirection
 * @text 向き変数番号
 * @desc 対象となる隊列メンバーの向きを取得する変数番号を指定します。
 * @type variable
 * @default 0
 * 
 * 
 */


/*:ko
 * @target MZ
 * @plugindesc 대열 보행 멤버를 조작하는 플러그인입니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20220924223133.html
 * 
 * @help 대열 보행 멤버의 조작에 관한 이하의 플러그인 명령을 제공합니다.
 * 
 * * 대열 멤버를 이벤트에 변환
 * 지정된 ID의 이벤트에 대열 보행 멤버의 이미지, 위치, 방향을 카피해서
 * 일반 이벤트와 마찬가지로 이벤트 명령으로 조작할 수 있게 합니다.
 * - 이벤트 ID 리스트 :
 *    대열 멤버에서 변환될 이벤트 ID를
 *    첫번째 대열 멤버부터 순서대로 리스트로 지정합니다.
 *    0을 지정하면 그 멤버는 이벤트로 변환되지 않습니다.
 * - 대열 보행 계속 :
 *    대열 보행을 계속할지 여부를 ON/OFF로 지정합니다.
 *    일부 멤버만 이탈시킬 경우에는 ON,
 *    모든 멤버를 이벤트에 변환시킬 경우에는 OFF를 지정하는 것이 좋겠습니다.
 * 
 * * 대열 멤버 방향 지정
 * 대열 멤버를 지정한 방향으로 꺾어지게 합니다.
 * - 대열 멤버 번호 :
 *    대상이 될 대열 멤버의 번호를 지정합니다.
 *    1이 첫번째 대열 멤버(=2번째 파티 멤버)입니다.
 *    0을 지정하면 대열 멤버 모두가 대상이 됩니다.
 * - 방향 :
 *    꺾어지게 할 방향을 지정합니다.
 *    상하좌우 외에 플레이어 캐릭터와 같은 방향도 지정한 수 있습니다.
 * 
 * * 대열 멤버의 위치 취득
 * 지정한 대열 멤버의 현재 위치와 방향을 변수에 취득합니다.
 * 변수를 지정하지 않았던 항목은 무시됩니다.
 * - 대열 멤버 번호 :
 *    대상이 될 대열 멤버의 번호를 지정합니다.
 *    1이 첫번째 대열 멤버(=2번째 파티 멤버)입니다.
 * - 지도 X 변수 번호 :
 *    대상이 된 대열 멤버의 지도 X 좌표를 취득하는 변수 번호를 지정합니다.
 * - 지도 Y 변수 번호 :
 *    대상이 된 대열 멤버의 지도 Y 좌표를 취득하는 변수 번호를 지정합니다.
 * - 방향 변수 번호 :
 *    대상이 된 대열 멤버의 방향을 취득하는 변수 번호를 지정합니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * 
 * @command ToEvents
 * @text 대열 멤버를 이벤트에 변환
 * @desc 대열 멤버를 지정된 ID의 이벤트에 변환합니다. 멤버의 이미지, 위치, 방향이 이벤트에 계승됩니다.
 * 
 * @arg eventList
 * @text 이벤트 ID 리스트
 * @desc 대열 멤버에서 변환될 이벤트 ID. 첫번째 대열 멤버부터 순서대로 리스트로 지정합니다. 0을 지정하면 무시됩니다.
 * @type number[]
 * @decimals 0
 * @min 0
 * @default ["0"]
 * 
 * @arg followersState
 * @text 대열 보행 계속
 * @desc 대열 보행을 계속할지 여부를 ON/OFF로 지정합니다.
 * @type boolean
 * @default false
 * 
 * 
 * @command SetDirection
 * @text 대열 멤버 방향 지정
 * @desc 대열 멤버를 지정한 방향으로 꺾어지게 합니다.
 * 
 * @arg followerIndex
 * @text 대열 멤버 번호
 * @desc 대상이 될 대열 멤버의 번호를 지정합니다. 1이 첫번째 대열 멤버입니다. 0을 지정하면 대열 멤버 모두가 대상이 됩니다.
 * @type number
 * @decimals 0
 * @min 0
 * @default 0
 * 
 * @arg direction
 * @text 방향
 * @desc 꺾어지게 할 방향을 지정합니다.
 * @type select
 * @default 0
 * @option 플레이어와 같은 방향
 * @value 0
 * @option 아래쪽
 * @value 2
 * @option 왼쪽
 * @value 4
 * @option 오른쪽
 * @value 6
 * @option 위쪽
 * @value 8
 * 
 * 
 * @command GetPosition
 * @text 대열 멤버의 위치 취득
 * @desc 지정된 대열 멤버의 현재 위치와 방향을 변수에 취득합니다.
 * 
 * @arg followerIndex
 * @text 대열 멤버 번호
 * @desc 대상이 될 대열 멤버의 번호를 지정합니다. 1이 첫번째 대열 멤버입니다.
 * @type number
 * @decimals 0
 * @min 1
 * @default 1
 * 
 * @arg varMapX
 * @text 지도 X 변수 번호
 * @desc 대상이 된 대열 멤버의 지도 X 좌표를 취득하는 변수 번호를 지정합니다.
 * @type variable
 * @default 0
 * 
 * @arg varMapY
 * @text 지도 Y 변수 번호
 * @desc 대상이 된 대열 멤버의 지도 Y 좌표를 취득하는 변수 번호를 지정합니다.
 * @type variable
 * @default 0
 * 
 * @arg varDirection
 * @text 방향 변수 번호
 * @desc 대상이 된 대열 멤버의 방향을 취득하는 변수 번호를 지정합니다.
 * @type variable
 * @default 0
 * 
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	
	//--------------------------------------------------
	// Plugin Command "Followers to Events"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'ToEvents', function(args) {
		
		// only when followers are shown
		if ($gamePlayer.isNormal() && $gamePlayer.followers().isVisible()) {
			
			// get arguments
			const eventList = JSON.parse(args['eventList']) || [];
			const followersState = (args['followersState'] !== 'false');
			
			// all followers
			const n = $gamePlayer.followers().data().length;
			for (let i in eventList) {
				
				// get follower
				const follower = $gamePlayer.followers().follower(i);
				if (follower) {
					
					// get event
					const eventID = parseInt(eventList[i]);
					if (eventID > 0 && $gameMap.event(eventID)) {
						let event = $gameMap.event(eventID);
						// copy the properties from follower
						event.copyPosition(follower);
						event.setImage(follower.characterName(), follower.characterIndex());
					}
					
				}
				
			}
			
			// hide followers
			if (!followersState) {
				$gamePlayer.hideFollowers();
			}
			$gamePlayer.refresh();
			
		}
		
	});
	
	
	//--------------------------------------------------
	// Plugin Command "Set Followers Direction"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'SetDirection', function(args) {
		
		// only when followers are shown
		if (!$gamePlayer.isInAirship() && $gamePlayer.followers().isVisible()) {
			
			// get arguments
			const followerIndex = Number(args['followerIndex']) || 0;
			const direction = Number(args['direction']) || $gamePlayer.direction();
			
			// all followers
			const n = $gamePlayer.followers().data().length;
			for (let i = 0; i < n; i++) {
				
				// get follower
				if (followerIndex === 0 || followerIndex === i + 1) {
					const follower = $gamePlayer.followers().follower(i);
					
					// set direction
					follower.setDirection(direction);
					
				}
				
			}
			
			$gamePlayer.refresh();
			
		}
		
	});
	
	
	//--------------------------------------------------
	// Plugin Command "Get Followers Position"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'GetPosition', function(args) {
		
		// only when followers are shown
		if ($gamePlayer.isNormal() && $gamePlayer.followers().isVisible()) {
			
			// get arguments
			const followerIndex = Number(args['followerIndex']) || 1;
			const varMapX = Number(args['varMapX']) || 0;
			const varMapY = Number(args['varMapY']) || 0;
			const varDirection = Number(args['varDirection']) || 0;
			
			// get follower
			const follower = $gamePlayer.followers().follower(followerIndex - 1);
			if (follower) {
				
				// get map X
				if (varMapX > 0) {
					$gameVariables.setValue(varMapX, follower.x);
				}
				
				// get map Y
				if (varMapY > 0) {
					$gameVariables.setValue(varMapY, follower.y);
				}
				
				// get direction
				if (varDirection > 0) {
					$gameVariables.setValue(varDirection, follower.direction());
				}
			
			}
			
		}
		
	});
	
	
})();

