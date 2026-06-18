//=============================================================================
// PANDA_ShopUsedGold.js
//=============================================================================
// [Update History]
// 2023-03-23 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc stores the amount of money purchased and sold in "Shop Processing".
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20230323212518.html
 * 
 * @help In "Shop Processing" event command, the amount of money purchased and
 * sold is stored in designated variables.
 * The variables will be reset to 0 when "Shop Processing" is executed.
 * 
 * It is possible to branch depending on whether or not the purchase was made,
 * or to trigger ab event when the purchase amount exceeds a certain amount.
 * If the shop is for purchase only, you can compare the before and after gold,
 * but if the shop allows selling, you cannot get the amount of money used
 * by simple comparison.
 * With this plug-in, you can get the purchase and selling amounts separately,
 * so you can judge the exact amount of money used.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param BuyGoldVariable
 * @text Purchase Amount Variable
 * @desc Specify a variable to store the amount of money spent on purchasing in "Shop Processing".
 * @type variable
 * @default 0
 * 
 * @param SellGoldVariable
 * @text Selling Amount Variable
 * @desc Specify a variable to store the amount of money earned from selling in "Shop Processing".
 * @type variable
 * @default 0
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc ショップの処理で購入・売却した金額をそれぞれ指定した変数に格納します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20230323212518.html
 * 
 * @help イベントコマンドの「ショップの処理」で、購入および売却した金額を
 * それぞれ指定した変数に格納します。
 * 指定した変数は「ショップの処理」実行の際に、0にリセットされます。
 * 
 * 購入したか否かで分岐したり、購入金額が一定以上でイベントを起こしたり、
 * といったことが可能になります。
 * 
 * 購入のみのショップであれば、前後の所持金を比較すれば済みますが、
 * 売却が可能なショップだと、単純比較では利用金額を取得できません。
 * このプラグインを使えば、購入金額と売却金額を別々に取得できるので、
 * 正確な利用額での判定が可能です。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param BuyGoldVariable
 * @text 購入金額格納変数
 * @desc ショップの処理で購入した金額を格納する変数を指定します。
 * @type variable
 * @default 0
 * 
 * @param SellGoldVariable
 * @text 売却金額格納変数
 * @desc ショップの処理で売却した金額を格納する変数を指定します。
 * @type variable
 * @default 0
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc "상점의 처리"에서 구매/판매한 금액을 각각 지정한 변수에 저장합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20230323212518.html
 * 
 * @help 이벤트 명령 "상점의 처리"에서 구매 및 판매한 금액을
 * 각각 지정한 변수에 저장합니다.
 * 자정한 변수는 "상점의 처리" 실행시에 0으로 재설정됩니다.
 * 
 * 구매 여부에 따라 분기하거나 구매 금액이 일정 금액 이상이면 이벤트를
 * 일으키거나 하는 것이 가능하게 됩니다.
 * 
 * 구매만 가능한 상점이라면 전후의 소지금을 비교하면 되지만,
 * 판매도 가능한 상점이라면 단순한 비교로는 이용 금액을 취득할 수 없습니다.
 * 이 플러그인을 사용하면, 구매 금액과 판매 금액을 각각 취득할 수 있으므로,
 * 정확한 이용 금액으로 판단할 수 있습니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param BuyGoldVariable
 * @text 구매 금액 저장 변수
 * @desc "상점의 처리"에서 구매한 금액을 저장할 변수를 지정합니다.
 * @type variable
 * @default 0
 * 
 * @param SellGoldVariable
 * @text 판매 금액 저장 변수
 * @desc "상점의 처리"에서 판매한 금액을 저장할 변수를 지정합니다.
 * @type variable
 * @default 0
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const BuyGoldVariable  = Number(parameters['BuyGoldVariable'])  || 0;
	const SellGoldVariable = Number(parameters['SellGoldVariable']) || 0;
	
	
	//--------------------------------------------------
	// Scene_Shop.prepare
	//  [Additional Definition]
	//--------------------------------------------------
	const _Scene_Shop_prepare = Scene_Shop.prototype.prepare;
	Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
		_Scene_Shop_prepare.call(this, goods, purchaseOnly);
		// initialize buy & sell gold variables
		if (BuyGoldVariable > 0) {
			$gameVariables.setValue(BuyGoldVariable, 0)
		}
		if (SellGoldVariable > 0) {
			$gameVariables.setValue(SellGoldVariable, 0)
		}
	}
	
	//--------------------------------------------------
	// Scene_Shop.doBuy
	//  [Additional Definition]
	//--------------------------------------------------
	const _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
	Scene_Shop.prototype.doBuy = function(number) {
		const before_gold = $gameParty.gold();
		_Scene_Shop_doBuy.call(this, number);
		const after_gold = $gameParty.gold();
		if (BuyGoldVariable > 0) {
			const gold = before_gold - after_gold;
			$gameVariables.setValue(BuyGoldVariable, $gameVariables.value(BuyGoldVariable) + gold);
		}
	};
	
	//--------------------------------------------------
	// Scene_Shop.doSell
	//  [Additional Definition]
	//--------------------------------------------------
	const _Scene_Shop_doSell = Scene_Shop.prototype.doSell;
	Scene_Shop.prototype.doSell = function(number) {
		const before_gold = $gameParty.gold();
		_Scene_Shop_doSell.call(this, number);
		const after_gold = $gameParty.gold();
		if (SellGoldVariable > 0) {
			const gold = after_gold - before_gold;
			$gameVariables.setValue(SellGoldVariable, $gameVariables.value(SellGoldVariable) + gold);
		}
	};
	
})();

