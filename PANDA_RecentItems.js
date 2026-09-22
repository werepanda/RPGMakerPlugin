//=============================================================================
// PANDA_RecentItems.js
//=============================================================================
// [Update History]
// 2026-09-22 Ver.1.0.0 First Release for MZ.
// 2026-09-23 Ver.1.0.1 Add <NoRecentItem> meta tag option.

/*:
 * @target MZ
 * @plugindesc Adds a "Recent Items" category to the Items menu.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20260922132932.html
 * 
 * @help Adds a "Recent Items" category to the Items menu, listing
 * recently acquired items in acquisition order regardless of item type.
 * 
 * The number of items shown in the list can be set with the plugin parameter
 * "Recent Item Count". Set it to 0 for no limit.
 * 
 * To make recently acquired items easier to identify in the normal lists,
 * the character specified by "Recent Item Mark" is shown before the quantity.
 * Leave blank for no mark.
 * 
 * Items remain in the list even if their current quantity becomes 0
 * after being used or equipped.
 * If the same item is acquired again, it is not duplicated,
 * but instead moved to the top of the list.
 * 
 * Items of type "Hidden Item A/B", or items with <NoRecentItem>
 * written in the Note field, are not shown in the list.
 * 
 * An actor's initial equipment is also added to the list when the actor
 * joins the party for the first time.
 * If you do not want to register the actor's equipment as recent items
 * when the actor joins, or if you want to register it again on a later join,
 * use the plugin command "Register Equipment on Join" to control this.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param RecentTitle
 * @text Recent Category Name
 * @desc Specifies the name of the "Recent Item" category.
 * @type string
 * @default Recent Item
 * 
 * @param RecentCount
 * @text Recent Item Count
 * @desc Specifies the maximum number of items shown in the "Recent Item" category. Set to 0 for no limit.
 * @type number
 * @default 16
 * @decimals 0
 * @max 9999
 * @min 0
 * 
 * @param RecentMark
 * @text Recent Item Mark
 * @desc Specifies the mark shown for recently acquired items. Leave blank for no mark.
 * @type string
 * @default 
 * 
 * @command SET_EQUIPS_TO_RECENT_ITEM
 * @text Register Equipment on Join
 * @desc Sets whether to register the actor's current equipment as recently acquired items when the actor joins the party.
 * 
 * @arg actorId
 * @text Target Actor
 * @desc Specifies the ID of the target actor.
 * @type actor
 * @default 0
 * 
 * @arg enableToAdd
 * @text Register Equipment
 * @desc Specifies whether to register the target actor's current equipment as recently acquired items when the actor joins.
 * @type boolean
 * @on Register
 * @off Do Not Register
 * @default true
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc メニューのアイテム画面に「最近入手」のカテゴリーを追加します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20260922132932.html
 * 
 * @help メニューのアイテム画面に「最近入手」のカテゴリーを追加し、
 * 最近入手したアイテムを、種類に関わらず入手した順にまとめて表示します。
 * 
 * 一覧に表示する件数はプラグインパラメータ「最近入手表示件数」で指定可能です。
 * 0を指定すると表示件数が無制限になります。
 * 
 * また、通常の一覧でも最近入手したアイテムが識別しやすいよう、
 * 「最近入手記号」で指定した文字を、所持数表示の手前に表示します。
 * 
 * アイテムの使用や装備により現在の所持数が0になっても、一覧には表示されます。
 * また、同じアイテムを複数回入手した場合は重複して表示されず、
 * 再び入手したアイテムは一覧の先頭に移動します。
 * 
 * アイテム種別が「隠しアイテムA/B」の場合や、
 * メモ欄に <NoRecentItem> と記述した場合は、一覧には表示されません。
 * 
 * なお、アクターの初期装備も、そのアクターの初回加入時に一覧に追加されます。
 * 加入時に装備品を最近入手アイテムとして登録したくない場合や、
 * 2回目以降の加入時にも登録したい場合は、
 * プラグインコマンド「アクター加入時の装備登録」で制御可能です。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param RecentTitle
 * @text 最近入手カテゴリー表示名
 * @desc 「最近入手」カテゴリーの表示名を指定します。
 * @type string
 * @default 最近入手
 * 
 * @param RecentCount
 * @text 最近入手表示件数
 * @desc 「最近入手」カテゴリーに表示するアイテムの上限件数を指定します。0を指定すると無制限になります。
 * @type number
 * @default 16
 * @decimals 0
 * @max 9999
 * @min 0
 * 
 * @param RecentMark
 * @text 最近入手記号
 * @desc 最近入手したアイテムに付加する記号を指定します。空欄にすると記号は付きません。
 * @type string
 * @default 
 * 
 * @command SET_EQUIPS_TO_RECENT_ITEM
 * @text アクター加入時の装備登録
 * @desc 指定したアクターがパーティーに加入する際、現在の装備品を最近入手アイテムとして登録するかどうかを設定します。
 * 
 * @arg actorId
 * @text 対象アクター
 * @desc 対象となるアクターのIDを指定します。
 * @type actor
 * @default 0
 * 
 * @arg enableToAdd
 * @text 装備品を最近入手に登録
 * @desc 対象アクターがパーティーに加入する際、現在の装備品を最近入手アイテムとして登録するかどうかを指定します。
 * @type boolean
 * @on 登録する
 * @off 登録しない
 * @default true
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 메뉴의 아이템 화면에 "최근 획득" 카테고리를 추가합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20260922132932.html
 * 
 * @help 메뉴의 아이템 화면에 "최근 획득" 카테고리를 추가하고,
 * 최근에 획득한 아이템을 종류와 상관없이 획득한 순서대로 표시합니다.
 * 
 * 목록에 표시할 개수는 플러그인 매개 변수 [최근 획득 표시 개수]로
 * 설정할 수 있습니다. 0으로 설정하면 표시 개수에 제한이 없습니다.
 * 
 * 일반 목록에서도 최근에 획득한 아이템을 쉽게 구분할 수 있도록
 * [최근 획득 기호]로 지정한 문자를 소지 수량 앞에 표시합니다.
 * 
 * 아이템을 사용하거나 장비하여 현재 소지수가 0이 되어도 목록에는 표시됩니다.
 * 또한 같은 아이템을 여러 번 획득해도 종복해서 표시되지 않으며,
 * 다시 획득한 아이템은 목록에 맨 위로 이동합니다.
 * 
 * 아이템 종류가 [숨겨진 아이템 A/B] 이거나
 * 메모란에 <NoRecentItem> 이라고 기재한 경우에는 목록에 표시되지 않습니다.
 * 
 * 액터의 초기 장비도 해당 액터가 처음 파티에 합류할 때 목록에 추가됩니다.
 * 합류시에 장비를 최근 획득 아이템으로 등록하지 않거나
 * 두 번째 이후의 합류시에도 등록하고 싶은 경우에는
 * 플러그인 명령 [액터 가입시 장비 등록] 으로 설정할 수 있습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param RecentTitle
 * @text 최근 획득 카테고리 표시명
 * @desc "최근 획득" 카테고리의 표시명을 지정합니다.
 * @type string
 * @default 최근 획득
 * 
 * @param RecentCount
 * @text 최근 획득 표시 개수
 * @desc "최근 획득" 카테고리에 표시할 아이템의 최대 개수를 지정합니다. 0으로 설정하면 제한이 없습니다.
 * @type number
 * @default 16
 * @decimals 0
 * @max 9999
 * @min 0
 * 
 * @param RecentMark
 * @text 최근 획득 기호
 * @desc 최근 획득한 아이템에 붙일 기호를 지정합니다. 비워두면 표시하지 않습니다.
 * @type string
 * @default 
 * 
 * @command SET_EQUIPS_TO_RECENT_ITEM
 * @text 액터 가입시 장비 등록
 * @desc 대상 액터가 파티에 합류할 때 현재 장비를 최근 획득 아이템으로 등록할지 설정합니다.
 * 
 * @arg actorId
 * @text 대상 액터
 * @desc 대상이 되는 액터의 ID를 지정합니다.
 * @type actor
 * @default 0
 * 
 * @arg enableToAdd
 * @text 장비를 최근 획득 등록
 * @desc 대상 액터가 파티에 합류할 때 현재 장비를 최근 획득 아이템으로 등록할지 지정합니다.
 * @type boolean
 * @on 등록함
 * @off 등록 안 함
 * @default true
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const RecentTitle = parameters['RecentTitle'] || '';
	const RecentCount = Number(parameters['RecentCount']) || 0;
	const RecentMark = parameters['RecentMark'] || '';
	
	
	//--------------------------------------------------
	// Plugin Command "Set Equips To Recent Item"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'SET_EQUIPS_TO_RECENT_ITEM', function(args) {
		const actorId = Number(args['actorId']) || 0;
		const enableToAdd = (args['enableToAdd'] === 'true');
		const actor = $gameActors.actor(actorId);
		if (actor) {
			if (enableToAdd) {
				actor.resetEquipsToRecentItem();
			} else {
				actor.skipEquipsToRecentItem();
			}
		}
	});
	
	
	//--------------------------------------------------
	// Game_Party.initAllItems
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Party_initAllItems = Game_Party.prototype.initAllItems;
	Game_Party.prototype.initAllItems = function() {
		_Game_Party_initAllItems.call(this);
		this.initRecentItems();
	};
	
	//--------------------------------------------------
	// Game_Party.initRecentItems
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.initRecentItems = function() {
		if (!this._recentItems) {
			this._recentItems = [];
		}
	};
	
	//--------------------------------------------------
	// Game_Party.recentItems
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.recentItems = function() {
		this.initRecentItems();
		return this._recentItems.map(item => item.object()).filter(item => !!item);
	};
	
	//--------------------------------------------------
	// Game_Party.disableRecentItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.disableRecentItem = function() {
		this._recentItemEnabled = false;
	};
	
	//--------------------------------------------------
	// Game_Party.enableRecentItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.enableRecentItem = function() {
		this._recentItemEnabled = true;
	};
	
	//--------------------------------------------------
	// Game_Party.isRecentItemEnabled
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.isRecentItemEnabled = function() {
		return this._recentItemEnabled !== false;
	};
	
	//--------------------------------------------------
	// Game_Party.addRecentItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Party.prototype.addRecentItem = function(item) {
		this.initRecentItems();
		if (!!item && this.isRecentItemEnabled()) {
			if ((!DataManager.isItem(item) || item.itypeId <= 2) && !item.meta.NoRecentItem) {
				this._recentItems = this._recentItems.filter(obj => obj.object() !== item);
				this._recentItems.unshift(new Game_Item(item));
				if (RecentCount > 0) {
					this._recentItems.splice(RecentCount);
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
			this.addRecentItem(item);
		}
		_Game_Party_gainItem.call(this, item, amount, includeEquip);
	};
	
	//--------------------------------------------------
	// Game_Party.setupStartingMembers
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
	Game_Party.prototype.setupStartingMembers = function() {
		_Game_Party_setupStartingMembers.call(this);
		this.allMembers().forEach(actor => actor.addEquipsToRecentItem());
	};
	
	//--------------------------------------------------
	// Game_Party.addActor
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Party_addActor = Game_Party.prototype.addActor;
	Game_Party.prototype.addActor = function(actorId) {
		if (!this._actors.includes(actorId)) {
			const actor = $gameActors.actor(actorId);
			if (!actor.hasAddedEquipsToRecentItem()) {
				actor.addEquipsToRecentItem();
			}
		}
		_Game_Party_addActor.call(this, actorId);
	};
	
	
	//--------------------------------------------------
	// Game_Actor.hasAddedEquipsToRecentItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.hasAddedEquipsToRecentItem = function() {
		return !!this._addedEquipsToRecentItem;
	};
	
	//--------------------------------------------------
	// Game_Actor.resetEquipsToRecentItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.resetEquipsToRecentItem = function() {
		this._addedEquipsToRecentItem = false;
	};
	
	//--------------------------------------------------
	// Game_Actor.skipEquipsToRecentItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.skipEquipsToRecentItem = function() {
		this._addedEquipsToRecentItem = true;
	};
	
	//--------------------------------------------------
	// Game_Actor.addEquipsToRecentItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.addEquipsToRecentItem = function() {
		this._addedEquipsToRecentItem = true;
		this.equips().forEach(item => $gameParty.addRecentItem(item));
	};
	
	//--------------------------------------------------
	// Game_Actor.changeEquip
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
	Game_Actor.prototype.changeEquip = function(slotId, item) {
		$gameParty.disableRecentItem();
		_Game_Actor_changeEquip.call(this, slotId, item);
		$gameParty.enableRecentItem();
	};
	
	//--------------------------------------------------
	// Game_Actor.releaseUnequippableItems
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Actor_releaseUnequippableItems = Game_Actor.prototype.releaseUnequippableItems;
	Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
		$gameParty.disableRecentItem();
		_Game_Actor_releaseUnequippableItems.call(this, forcing);
		$gameParty.enableRecentItem();
	};
	
	
	//--------------------------------------------------
	// Window_ItemCategory.maxCols
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_ItemCategory_maxCols = Window_ItemCategory.prototype.maxCols;
	Window_ItemCategory.prototype.maxCols = function() {
		return _Window_ItemCategory_maxCols.call(this) + 1;
	};
	
	//--------------------------------------------------
	// Window_ItemCategory.makeCommandList
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_ItemCategory_makeCommandList = Window_ItemCategory.prototype.makeCommandList;
	Window_ItemCategory.prototype.makeCommandList = function() {
		_Window_ItemCategory_makeCommandList.call(this);
		this.addCommand(RecentTitle, 'recent');
	};
	
	
	//--------------------------------------------------
	// Window_ItemList.makeItemList
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
	Window_ItemList.prototype.makeItemList = function() {
		if (this._category === 'recent') {
			this._data = $gameParty.recentItems();
			if (this.includes(null)) {
				this._data.push(null);
			}
		} else {
			_Window_ItemList_makeItemList.call(this);
		}
	};
	
	//--------------------------------------------------
	// Window_ItemList.drawItemName
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_ItemList_drawItemName = Window_ItemList.prototype.drawItemName;
	Window_ItemList.prototype.drawItemName = function(item, x, y, width) {
		_Window_ItemList_drawItemName.call(this, item, x, y, width);
		if (item) {
			if (RecentMark !== '' && $gameParty.recentItems().includes(item)) {
				const textMargin = ImageManager.standardIconWidth + 4;
				const itemWidth = Math.max(0, width - textMargin);
				this.drawText(RecentMark, x + textMargin, y, itemWidth, 'right');
			}
		}
	};
	
})();
