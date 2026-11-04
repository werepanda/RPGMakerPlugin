//=============================================================================
// PANDA_EquipCandidates.js
//=============================================================================
// [Update History]
// 2026-11-04 Ver.1.0.0 First Release for MZ.
// 2026-11-05 Ver.1.0.1 Bug fix for recent equipment.

/*:
 * @target MZ
 * @plugindesc Displays equippable items below the equipment slots on the Equip menu.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261104190137.html
 * 
 * @help When an equipment slot is selected on the Equip menu,
 * this plugin displays the total number of different items
 * the actor can equip in that slot, along with a list of candidates
 * from the party's inventory, below the equipment slot list.
 * 
 * You can check whether other equipment is available
 * without opening the equipment selection list.
 * 
 * The number of candidates displayed depends on the available space
 * below the equipment slot list. If there is not enough space for at least
 * two rows below the slots, the candidate list will not be displayed.
 * 
 * Equipment candidates are displayed in order of first acquisition,
 * with the most recently acquired new items first.
 * Obtaining the same item again does not change its position.
 * However, equipment already owned when this plugin is installed
 * is displayed in ID order.
 * 
 * The display order of the actual equipment selection list remains unchanged.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param CandidateTitle
 * @text Equipment Candidate Header
 * @desc Specifies the header text displayed above the equipment candidates.
 * @type string
 * @default Equip Candidates
 * 
 * @param CountFormat
 * @text Equipment Count Format
 * @desc Specifies the text showing the total number of equippable item types. %1 is replaced with the count.
 * @type string
 * @default Total: %1
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 装備画面で装備スロットの下に装備可能な所持品の候補を表示します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261104190137.html
 * 
 * @help メニューの装備画面で装備スロットを選択した際に、
 * そのアクターがそのスロットで装備可能な所持品の総種類数と装備候補を
 * 装備スロット一覧の下に表示します。
 * 装備変更のリストを開かなくても、他に装備可能なものがあるか確認できます。
 * 
 * 装備候補の表示件数は、装備スロット一覧の下の空き領域に応じて決まります。
 * 装備スロットの下に2行以上の空き領域がない場合、装備候補は表示されません。
 * 
 * 装備候補は、初めて入手した順（新しいものから）に表示されます。
 * 同じ装備品を再度入手しても表示上の順序は変わりません。
 * ただし、本プラグインの導入時に既に所持している装備品は、ID順で表示されます。
 * 
 * なお、実際の装備変更時の装備品リストの表示順は変更されません。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param CandidateTitle
 * @text 装備候補の見出し
 * @desc 装備候補欄に表示する見出しのテキストを指定します。
 * @type string
 * @default 装備品候補（入手順）
 * 
 * @param CountFormat
 * @text 装備可能総数の表示形式
 * @desc 装備可能な所持品の総種類数を表示する文字列を指定します。%1が種類数に置き換わります。
 * @type string
 * @default 全 %1 種
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 장비 화면에서 장비 슬롯 아래에 장착 가능한 소지품 후보를 표시합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261104190137.html
 * 
 * @help 메뉴의 장비 화면에서 장비 슬롯을 선택하면,
 * 해당 액터가 그 슬롯에 장작할 수 있는 소지 장비의 총 종류수와 장비 후보를
 * 장비 슬롯 목록 아래에 표시합니다.
 * 
 * 장비 변경 목록을 열지 않고도
 * 장착 가능한 다른 장비가 있는지 확인할 수 있습니다.
 * 
 * 장비 후보의 표시 개수는 장비 슬롯 목록 아래의 여유 공간에 따라 결정됩니다.
 * 장비 슬롯 아래에 2줄 이상의 여유 공간이 없으면
 * 장비 후보가 표시되지 않습니다.
 * 
 * 장비 후보는 처음 획득한 시점이 최근인 순서대로 표시됩니다.
 * 같은 장비를 다시 획득해도 표시 순서는 바뀌지 않습니다.
 * 단, 이 플러그인을 도입할 때 이미 소지하고 있던 장비는 ID순으로 표시됩니다.
 * 
 * 실제 장비 변경 시 나타나는 장비 목록의 표시 순서는 변경되지 않습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param CandidateTitle
 * @text 장비 후보 제목
 * @desc 장비 후보 영역에 표시할 제목 텍스트를 지정합니다.
 * @type string
 * @default 장비 후보 (획득순)
 * 
 * @param CountFormat
 * @text 장착 가능 총수 표시 형식
 * @desc 장착 가능한 소지 장비의 총 종류수를 표시할 문자열을 지정합니다. %1은 종류수로 치환됩니다.
 * @type string
 * @default 총 %1 종
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const CandidateTitle = parameters['CandidateTitle'] || '';
	const CountFormat = parameters['CountFormat'] || '';
	
	
	//--------------------------------------------------
	// Game_Party.initAllItems
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Party_initAllItems = Game_Party.prototype.initAllItems;
	Game_Party.prototype.initAllItems = function() {
		_Game_Party_initAllItems.call(this);
		this.initRecentEquipments();
	};
	
	//--------------------------------------------------
	// Game_Party.initRecentEquipments
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.initRecentEquipments = function() {
		if (!this._recentEquipments) {
			this._recentEquipments = this.equipItems().map(item => new Game_Item(item));
		}
	};
	
	//--------------------------------------------------
	// Game_Party.recentEquipments
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.recentEquipments = function() {
		this.initRecentEquipments();
		return this._recentEquipments.map(item => item.object()).filter(item => !!item);
	};
	
	//--------------------------------------------------
	// Game_Party.addRecentEquipment
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.addRecentEquipment = function(item) {
		this.initRecentEquipments();
		if (!!item) {
			if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
				if (this._recentEquipments.every(obj => obj.object() !== item)) {
					this._recentEquipments.unshift(new Game_Item(item));
				}
			}
		}
	};
	
	//--------------------------------------------------
	// Game_Party.gainItem
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Party_gainItem = Game_Party.prototype.gainItem;
	Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
		if (amount > 0) {
			this.addRecentEquipment(item);
		}
		_Game_Party_gainItem.call(this, item, amount, includeEquip);
	};
	
	
	//--------------------------------------------------
	// Window_EquipSlot.maxCandidates
	//  [New Definition]
	//--------------------------------------------------
	Window_EquipSlot.prototype.maxCandidates = function() {
		const rows = this.maxPageRows();
		const slots = this.maxItems();
		return rows - slots - 1;
	};
	
	//--------------------------------------------------
	// Window_EquipSlot.visibleCandidates
	//  [New Definition]
	//--------------------------------------------------
	Window_EquipSlot.prototype.visibleCandidates = function() {
		return (this.maxCandidates() >= 1);
	};
	
	//--------------------------------------------------
	// Window_EquipSlot.select
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_EquipSlot_select = Window_EquipSlot.prototype.select;
	Window_EquipSlot.prototype.select = function(index) {
		const lastIndex = this.index();
		_Window_EquipSlot_select.call(this, index);
		if (this.index() !== lastIndex) {
			this.refreshCandidates();
		}
	};
	
	//--------------------------------------------------
	// Window_EquipSlot.refresh
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_EquipSlot_refresh = Window_EquipSlot.prototype.refresh;
	Window_EquipSlot.prototype.refresh = function() {
		_Window_EquipSlot_refresh.call(this);
		this.refreshCandidates();
	};
	
	//--------------------------------------------------
	// Window_EquipSlot.refreshCandidates
	//  [New Definition]
	//--------------------------------------------------
	Window_EquipSlot.prototype.refreshCandidates = function() {
		if (!this.contents || !this.visibleCandidates()) {
			return;
		}
		const rect = this.itemRect(this.maxItems());
		const y = rect.y - this.rowSpacing() / 2;
		this.contents.clearRect(0, y, this.innerWidth, this.innerHeight - y);
		if (this._actor && this.index() >= 0 && this.index() < this.maxItems()) {
			const etypeId = this._actor.equipSlots()[this.index()];
			this.showCandidates(etypeId);
		}
	};
	
	//--------------------------------------------------
	// Window_EquipSlot.showCandidates
	//  [New Definition]
	//--------------------------------------------------
	Window_EquipSlot.prototype.showCandidates = function(etypeId) {
		// header
		const headerIndex = this.maxItems();
		const rect = this.itemLineRect(headerIndex);
		this.changeTextColor(ColorManager.systemColor());
		this.changePaintOpacity(true);
		this.drawText(CandidateTitle, rect.x, rect.y, rect.width);
		// get candidate items
		const candidateItems = $gameParty.recentEquipments().filter(item => ($gameParty.hasItem(item) && this._actor.canEquip(item) && item.etypeId === etypeId));
		// total count
		this.changeTextColor(ColorManager.normalColor());
		this.drawText(CountFormat.format(candidateItems.length), rect.x, rect.y, rect.width, 'right');
		// draw candidates
		const maxCandidates = this.maxCandidates();
		if (candidateItems.length > maxCandidates) {
			candidateItems.length = maxCandidates;
		}
		const startIndex = headerIndex + 1;
		candidateItems.forEach((item, index) => { this.drawCandidates(item, index + startIndex); });
	};
	
	//--------------------------------------------------
	// Window_EquipSlot.drawCandidates
	//  [New Definition]
	//--------------------------------------------------
	Window_EquipSlot.prototype.drawCandidates = function(item, index) {
		if (item) {
			const rect = this.itemLineRect(index);
			this.drawItemName(item, rect.x, rect.y, rect.width);
		}
	};
	
})();
