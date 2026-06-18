//=============================================================================
// PANDA_HiddenEquipItem.js
//=============================================================================
// [Update History]
// 2023-10-03 Ver.1.0.0 First Release for MV/MZ.
// 2023-10-03 Ver.1.0.1 Added the descriptions.

/*:
 * @target MV MZ
 * @plugindesc Hide equipments of the specified equipment type from the item list.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231004011833.html
 * 
 * @help Hide equipments of the specified equipment type from the item list.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param HiddenETypes
 * @text Equipment types to hide
 * @desc Specify the numbers of the equipment types to be hidden in the item list.
 * @type number[]
 * @default 
 * @decimals 0
 * @min 1
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 特定の装備タイプの装備品をアイテム一覧で非表示にします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231004011833.html
 * 
 * @help 指定した装備タイプの装備品をアイテム一覧で非表示にします。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param HiddenETypes
 * @text 非表示にする装備タイプ
 * @desc アイテム一覧で非表示にする装備タイプの番号を指定します。
 * @type number[]
 * @default 
 * @decimals 0
 * @min 1
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 지정한 장비유형의 장비품을 아이템 리스트에서 표시하지 않게 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20231004011833.html
 * 
 * @help 지정한 장비유형의 장비품을 아이템 리스트에서 숨깁니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param HiddenETypes
 * @text 숨길 장비유형 번호
 * @desc 아이템 리스트에서 표시하지 않게 할 장비유형 번호를 지정합니다.
 * @type number[]
 * @default 
 * @decimals 0
 * @min 1
 * 
 */


(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const HiddenETypes = JSON.parse(parameters['HiddenETypes']).map(Number) || [];
	
	
	//--------------------------------------------------
	// Window_ItemList.includes
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_ItemList_includes = Window_ItemList.prototype.includes;
	Window_ItemList.prototype.includes = function(item) {
		if (_Window_ItemList_includes.call(this, item)) {
			if (this._category === 'weapon' || this._category === 'armor') {
				return !HiddenETypes.includes(item.etypeId);
			} else {
				return true;
			}
		} else {
			return false;
		}
	};
	
})();

