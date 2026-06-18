//=============================================================================
// PANDA_StealItem.js
//=============================================================================
// [Update History]
// 2023-03-16 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc implement the skill "Steal" items from enemy characters.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20230316222814.html
 * 
 * @help This plug-in allows you to implement the skill of "Steal" items
 * from enemy characters.
 * It doesn't support that the enemy steals the player's items.
 * 
 * At first, create a dummy state to indicate "Steal" was successful.
 * Because it is a dummy state, there is no need to settings or messages.
 * Specify this state in the plug-in parameter of "Steal Success State".
 * 
 * Next, create a "Steal" skill.
 * Specify the "Steal Success State" in [Add State] in the [Effects].
 * The success rate of "Steal" can be adjusted with the rate of this state.
 * For each enemy character, you can also adjust the success rate
 * with [State Rate] in [Traits].
 * 
 * Items that can be stolen follow [Drop Items] settings of enemies.
 * You can specify the stolen items in detail with "Stolen Item Type"
 * in the plug-in parameter.
 * If you specify "Depends on Drop Items Probability", it will be determined
 * according to the probability of multiple drop items.
 * 
 * If you turn on the plug-in parameter "Whether can steal again",
 * players can steal from the same enemy many times.
 * When turned off, players can only steal from the same enemy once,
 * and they will not drop items when defeated.
 * 
 * You can specify the following messages and animations
 * in the plug-in parameters.
 *  - When "Steal" succeeded
 *  - When "Steal" failed
 *  - When the enemy does not any items to steal
 *  - When players have already stolen an item from the enemy
 * The two below are judged with priority over the success judgement.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param StolenStateID
 * @text Steal Success State
 * @desc Specify the state to be applied to the enemy when "Steal" succeeds.
 * @type state
 * @default 
 * 
 * @param StealItemType
 * @text Stolen Item Type
 * @desc Specify the target of the item which can be stolen.
 * @default 0
 * @type select
 * @option Depends on Drop Items Probability
 * @value 0
 * @option Drop Item 1 only
 * @value 1
 * @option Drop Item 2 only
 * @value 2
 * @option Drop Item 3 only
 * @value 3
 * 
 * @param AllowStealAgain
 * @text Whether can steal again
 * @desc If ON, can steal from the same enemy many times. OFF, can not steal from enemies who stole it once, and not drop it.
 * @type boolean
 * @default false
 * 
 * @param StealSuccessMessage
 * @text Steal Success Message
 * @desc Message when "Steal" succeeded. %1 = Actor character name, %2 = Enemy character name, %3 = Item name
 * @type text
 * @default %1 stole %3 from %2!
 * 
 * @param StealFailureMessage
 * @text Steal Failure Message
 * @desc Message when "Steal" failed. %1 = Actor character name, %2 = Enemy character name
 * @type text
 * @default But %1 couldn't steal from %2!
 * 
 * @param NoItemMessage
 * @text No Item Message
 * @desc Message when the enemy does not have any items to steal. %1 = Actor character name, %2 = Enemy character name
 * @type text
 * @default But %2 had nothing!
 * 
 * @param AlreadyStolenMessage
 * @text Already Stolen Message
 * @desc Message when players have already stolen an item. %1 = Actor character name, %2 = Enemy character name
 * @type text
 * @default %2 didn't have any more!
 * 
 * @param StealSuccessAnimation
 * @text Steal Success Animation
 * @desc Animation when "Steal" succeeded.
 * @type animation
 * @default 
 * 
 * @param StealFailureAnimation
 * @text Steal Failure Animation
 * @desc Animation when "Steal" failed.
 * @type animation
 * @default 
 * 
 * @param NoItemAnimation
 * @text No Item Animation
 * @desc Animation when the enemy does not have any items to steal.
 * @type animation
 * @default 
 * 
 * @param AlreadyStolenAnimation
 * @text Already Stolen Animation
 * @desc Animation when players have already stolen an item.
 * @type animation
 * @default 
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 敵キャラからアイテムを「盗む」スキルを実装できるプラグインです。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20230316222814.html
 * 
 * @help 敵キャラからアイテムを「盗む」スキルを実装できるプラグインです。
 * 敵キャラがプレイヤーの所持品を盗む仕様には対応していません。
 * 
 * 最初に「盗む」が成功した状態を表すダミーステートを作成します。
 * ダミーステートなので設定やメッセージなどは無しで構いません。
 * プラグインパラメータの「盗む成功ステート」で、このステートを指定します。
 * 
 * 次に「盗む」のスキルを作成します。
 * 「使用効果」の「ステート付加」で、「盗む成功ステート」を指定します。
 * 「盗む」の成功確率は、このステートの付与確率で調整できます。
 * 敵キャラごとに、特徴の「ステート有効度」でも、成功確率を調整できます。
 * 
 * 盗めるアイテムは、基本的に敵キャラのドロップアイテムが適用されます。
 * プラグインパラメータの「盗めるアイテム」で細かく対象を指定できます。
 * 「ドロップアイテムの出現率依存」を指定した場合、
 * 複数のドロップアイテムの出現率に応じて決まります。
 * 
 * プラグインパラメータの「再度盗めるかどうか」をONにすると、
 * 同じ敵から何度でも盗むことができます。
 * OFFにすると、同じ敵からは一度しか盗めず、
 * 倒した時にアイテムをドロップすることもなくなります。
 * 
 * プラグインパラメータで、以下のメッセージとアニメーションを指定できます。
 *  - 「盗む」が成功した時
 *  - 「盗む」が失敗した時
 *  - 相手が盗めるアイテムを何も持っていなかった時
 *  - 相手から既にアイテムを盗んでいた時
 * 下の2つは成功判定よりも優先して判定されます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param StolenStateID
 * @text 盗む成功ステート
 * @desc 「盗む」が成功した時に相手に付与するステートを指定します。
 * @type state
 * @default 
 * 
 * @param StealItemType
 * @text 盗めるアイテム
 * @desc 盗めるアイテムの対象を指定します。
 * @default 0
 * @type select
 * @option ドロップアイテムの出現率依存
 * @value 0
 * @option ドロップアイテム1のみ
 * @value 1
 * @option ドロップアイテム2のみ
 * @value 2
 * @option ドロップアイテム3のみ
 * @value 3
 * 
 * @param AllowStealAgain
 * @text 再度盗めるかどうか
 * @desc ONにすると同じ相手から何度も盗めます。OFFにすると一度盗んだ相手からは盗めなくなり、ドロップもしなくなります。
 * @type boolean
 * @default false
 * 
 * @param StealSuccessMessage
 * @text 盗む成功時メッセージ
 * @desc 盗むが成功した時のメッセージです。%1=自キャラ名、%2=敵キャラ名、%3=アイテム名
 * @type text
 * @default %1は%2から%3を盗んだ！
 * 
 * @param StealFailureMessage
 * @text 盗む失敗時メッセージ
 * @desc 盗むが失敗した時のメッセージです。%1=自キャラ名、%2=敵キャラ名
 * @type text
 * @default しかし%2からは盗めなかった！
 * 
 * @param NoItemMessage
 * @text 盗めるアイテムなしメッセージ
 * @desc 盗めるアイテムを相手が持っていなかった時のメッセージです。%1=自キャラ名、%2=敵キャラ名
 * @type text
 * @default しかし%2は何も持っていなかった！
 * 
 * @param AlreadyStolenMessage
 * @text 既に盗み済みメッセージ
 * @desc 既にアイテムを盗んでいた時のメッセージです。%1=自キャラ名、%2=敵キャラ名
 * @type text
 * @default %2はもう何も持っていなかった！
 * 
 * @param StealSuccessAnimation
 * @text 盗む成功時アニメーション
 * @desc 盗むが成功した時のアニメーションを指定します。
 * @type animation
 * @default 
 * 
 * @param StealFailureAnimation
 * @text 盗む失敗時アニメーション
 * @desc 盗むが失敗した時のアニメーションを指定します。
 * @type animation
 * @default 
 * 
 * @param NoItemAnimation
 * @text 盗めるアイテムなしアニメーション
 * @desc 盗めるアイテムを相手が持っていなかった時のアニメーションを指定します。
 * @type animation
 * @default 
 * 
 * @param AlreadyStolenAnimation
 * @text 既に盗み済みアニメーション
 * @desc 既にアイテムを盗んでいた時のアニメーションを指定します。
 * @type animation
 * @default 
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 적 캐릭터로부터 아이템을 훔치는 스킬을 만들 수 있는 플러그인입니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20230316222814.html
 * 
 * @help 적 캐릭터로부터 아이템을 훔치는 스킬을 만들 수 있는 플러그인입니다.
 * 적 캐릭터가 플레이어의 소지품을 훔치는 사양에는 대응하고 있지 않습니다.
 * 
 * 우선 "훔치기"가 성공한 상태를 나타내는 더미 스탯을 만듭니다.
 * 더미 스탯이므로 설정이나 메시지 등은 없어도 됩니다.
 * 플러그인 매개 변수 "훔치기 성공 스탯"에서 이 스탯을 지정합니다.
 * 
 * 그 다음에 "훔치기" 스킬을 만듭니다.
 * [사용 효과]의 [스탯 추가]에서 "훔치기 성공 스탯"을 지정합니다.
 * "훔치기"의 성공 확률은 이 스탯의 부여 확률로 조정할 수 있습니다.
 * 적 캐릭터마다 [특성]의 [스탯 비율]에서도 성공 확률을 조정할 수 있습니다.
 * 
 * 훔치는 아이템은 기본적으로 적 캐릭터의 드롭 아이템이 적용됩니다.
 * 플러그인 매개 변수 "훔치는 아이템"으로 자세히 대상을 지정할 수 있습니다.
 * "드롭 아이템의 출현율 의존"을 지정하면,
 * 여러 드롭 아이템의 출현율에 따라 결정됩니다.
 * 
 * 플러그인 매개 변수 "다시 훔치기"를 ON으로 하면,
 * 같은 적으로부터 몇번이나 훔칠 수 있습니다.
 * OFF로 하면 같은 적으로부터는 한 번밖에 훔칠 수 없고
 * 승리한 후에 아이템을 드롭하는 일도 없어집니다.
 * 
 * 플러그인 매개 변수에서 이하의 메시지와 애니메이션을 지정할 수 있습니다.
 *  - "훔치기"가 성공했을 때
 *  - "훔치기"가 실패했을 때
 *  - 상대가 훔치는 아이템을 아무것도 가지고 있지 않았을 때
 *  - 상대로부터 이미 아이템을 훔쳤을 때
 * 아래의 2개는 "훔치기" 성공 판정에 앞서 판정됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param StolenStateID
 * @text 훔치기 성공 스탯
 * @desc "훔치기"가 성공했을 때 상대에 부여할 스탯을 지정합니다.
 * @type state
 * @default 
 * 
 * @param StealItemType
 * @text 훔치는 아이템
 * @desc 훔치는 아이템의 대상을 지정합니다.
 * @default 0
 * @type select
 * @option 드롭 아이템의 출현율 의존
 * @value 0
 * @option 드롭 아이템 1만
 * @value 1
 * @option 드롭 아이템 2만
 * @value 2
 * @option 드롭 아이템 3만
 * @value 3
 * 
 * @param AllowStealAgain
 * @text 다시 훔치기
 * @desc ON이면 같은 적으로부터 몇번이라도 훔칠 수 있습니다. OFF이면 한번 훔친 적으로부터는 훔치지 못하고, 드롭도 없습니다.
 * @type boolean
 * @default false
 * 
 * @param StealSuccessMessage
 * @text 훔치기 성공 메시지
 * @desc "훔치기"가 성공했을 때의 메시지입니다. %1=자기 캐릭터 명, %2=적 캐릭터 명, %3=아이템 명
 * @type text
 * @default %1는 %2로부터 %3를 훔쳤다!
 * 
 * @param StealFailureMessage
 * @text 훔치기 실패 메시지
 * @desc "훔치기"가 실패했을 때의 메시지입니다. %1=자기 캐릭터 명, %2=적 캐릭터 명
 * @type text
 * @default 하지만 %2로부터는 흠치지 못했다!
 * 
 * @param NoItemMessage
 * @text 훔치는 아이템 없음 메시지
 * @desc 훔치는 아이템을 상대가 아무것도 가지고 있지 않았을 때의 메시지입니다. %1=자기 캐릭터 명, %2=적 캐릭터 명
 * @type text
 * @default 하지만 %2는 아무것도 가지고 있지 않았다!
 * 
 * @param AlreadyStolenMessage
 * @text 이미 훔친 메시지
 * @desc 이미 아이템을 상대로부터 훔쳤을 때의 메시지입니다. %1=자기 캐릭터 명, %2=적 캐릭터 명
 * @type text
 * @default %2는 더 이상 아무것도 가지고 있지 않았다!
 * 
 * @param StealSuccessAnimation
 * @text 훔치기 성공 애니메이션
 * @desc "훔치기"가 성공했을 때의 애니메이션을 지정합니다.
 * @type animation
 * @default 
 * 
 * @param StealFailureAnimation
 * @text 훔치기 실패 애니메이션
 * @desc "훔치기"가 실패했을 때의 애니메이션을 지정합니다.
 * @type animation
 * @default 
 * 
 * @param NoItemAnimation
 * @text 훔치는 아이템 없음 애니메이션
 * @desc 훔치는 아이템을 상대가 아무것도 가지고 있지 않았을 때의 애니메이션을 지정합니다.
 * @type animation
 * @default 
 * 
 * @param AlreadyStolenAnimation
 * @text 이미 훔친 애니메이션
 * @desc 이미 아이템을 상대로부터 훔쳤을 때의 애니메이션을 지정합니다.
 * @type animation
 * @default 
 * 
 */


(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const StolenStateID = Number(parameters['StolenStateID']) || 0;
	const StealItemType = Number(parameters['StealItemType']) || 0;
	const AllowStealAgain = (parameters['AllowStealAgain'] == 'true');
	// Messages
	const StealSuccessMessage = parameters['StealSuccessMessage'] || '';
	const StealFailureMessage = parameters['StealFailureMessage'] || '';
	const NoItemMessage = parameters['NoItemMessage'] || '';
	const AlreadyStolenMessage = parameters['AlreadyStolenMessage'] || '';
	// Animations
	const StealSuccessAnimation = Number(parameters['StealSuccessAnimation']) || 0;
	const StealFailureAnimation = Number(parameters['StealFailureAnimation']) || 0;
	const NoItemAnimation = Number(parameters['NoItemAnimation']) || 0;
	const AlreadyStolenAnimation = Number(parameters['AlreadyStolenAnimation']) || 0;
	
	
	//--------------------------------------------------
	// Window_BattleLog.displayActionResults
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
	Window_BattleLog.prototype.displayActionResults = function(subject, target) {
		this._subject = subject;	// save subject
		_Window_BattleLog_displayActionResults.call(this, subject, target);
	}
	
	//--------------------------------------------------
	// Window_BattleLog.displayAddedStates
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
	Window_BattleLog.prototype.displayAddedStates = function(target) {
		_Window_BattleLog_displayAddedStates.call(this, target);
		if (target.isEnemy() && target.result().steal === 'succeeded') {
			let text, animation;
			// stolen item
			const item = target.makeStolenItem();
			if (item) {
				// success
				$gameParty.gainItem(item, 1);
				text = StealSuccessMessage.format(this._subject.name(), target.name(), item.name);
				animation = StealSuccessAnimation;
			} else {
				// no item
				text = NoItemMessage.format(this._subject.name(), target.name());
				animation = NoItemAnimation;
			}
			this.push("showNormalAnimation", [target], animation, false);
      this.push("popBaseLine");
      this.push("pushBaseLine");
      this.push("addText", text);
      this.push("waitForEffect");
		}
	}
	
	//--------------------------------------------------
	// Window_BattleLog.displayFailure
	//  [Additional Definition]
	//--------------------------------------------------
	const _Window_BattleLog_displayFailure = Window_BattleLog.prototype.displayFailure;
	Window_BattleLog.prototype.displayFailure = function(target) {
		if (target.isEnemy() && target.result().steal !== '') {
			let text, animation;
			switch (target.result().steal) {
				case 'failed':
					text = StealFailureMessage.format(this._subject.name(), target.name());
					animation = StealFailureAnimation;
					break;
				case 'noitem':
					text = NoItemMessage.format(this._subject.name(), target.name());
					animation = NoItemAnimation;
					break;
				case 'already':
					text = AlreadyStolenMessage.format(this._subject.name(), target.name());
					animation = AlreadyStolenAnimation;
					break;
			}
			if (animation || text) {
				this.push("showNormalAnimation", [target], animation, false);
	      this.push("popBaseLine");
	      this.push("pushBaseLine");
	      this.push("addText", text);
	      this.push("waitForEffect");
			}
		} else {
			_Window_BattleLog_displayFailure.call(this, target);
		}
	}
	
	
	//--------------------------------------------------
	// Game_Action.itemEffectAddNormalState
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
	Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
		_Game_Action_itemEffectAddNormalState.call(this, target, effect);
		if (target.isEnemy() && effect.dataId === StolenStateID) {
			// set steal result
			if (target._stolen) {
				target.result().steal = 'already';
			} else {
				const item = target.makeStolenItem();
				if (item) {
					if (target.isStateAffected(StolenStateID)) {
						target.result().steal = 'succeeded';
						if (AllowStealAgain) {
							target.removeState(StolenStateID);
						} else {
							target._stolen = true;
						}
					} else {
						target.result().steal = 'failed';
					}
				} else {
					target.result().steal = 'noitem';
				}
			}
		}
	}
	
	//--------------------------------------------------
	// Game_ActionResult.clear
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
	Game_ActionResult.prototype.clear = function() {
		_Game_ActionResult_clear.call(this);
		this.steal = '';
	}
	
	
	//--------------------------------------------------
	// Game_Enemy.initMembers
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
	Game_Enemy.prototype.initMembers = function() {
		_Game_Enemy_initMembers.call(this);
		this._stolen = false;
	}
	
	//--------------------------------------------------
	// Game_Enemy.makeDropItems
	//  [Additional Definition]
	//--------------------------------------------------
	const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
	Game_Enemy.prototype.makeDropItems = function() {
		if (this._stolen) {
			return [];
		} else {
			return _Game_Enemy_makeDropItems.call(this);
		}
	}
	
	//--------------------------------------------------
	// Game_Enemy.makeStolenItem
	//  [New Definition]
	//--------------------------------------------------
	Game_Enemy.prototype.makeStolenItem = function() {
		if (StealItemType === 0) {
			// rely on drop item rate
			const items = this.enemy().dropItems.filter(di => (di.kind > 0 && di.denominator > 0));
			let sum = 0;
			for (let i = 0; i < items.length; i++) {
				let rate = 1;
				for (let j = 0; j < items.length; j++) {
					if (i != j) {
						rate *= items[j].denominator;
					}
				}
				sum += rate;
				items[i].rate = sum;
			}
			const r = Math.random() * sum;
			const di = items.find(di => (r < di.rate));
			if (di) {
				return this.itemObject(di.kind, di.dataId);
			}
		} else {
			// drop item 1-3
			const di = this.enemy().dropItems[StealItemType - 1];
			return this.itemObject(di.kind, di.dataId);
		}
	}
	
})();

