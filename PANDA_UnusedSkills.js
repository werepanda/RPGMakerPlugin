//=============================================================================
// PANDA_UnusedSkills.js
//=============================================================================
// [Update History]
// 2026-10-25 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc Marks skills that the actor has not used yet.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261025202056.html
 * 
 * @help Marks skills that the actor has not used yet,
 * making newly available but unused skills easier to identify.
 * The mark disappears once the skill is used.
 * 
 * In addition to skills learned through leveling up, this plugin generally
 * supports skills added by items or equipment, event commands, and plugins.
 * Initial skills are also treated as unused when the actor is initialized.
 * 
 * If this plugin is enabled in the middle of an existing save,
 * skills that are already available at that point will not be marked.
 * Skills that become newly available afterward will be marked.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param UnusedMark
 * @text Unused Skill Mark
 * @desc Specifies the mark added to skills that the target actor has not used yet.
 * @type string
 * @default ◆
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc そのアクターがまだ使用したことのいないスキルに記号を付けます。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261025202056.html
 * 
 * @help そのアクターがまだ使用したことのないスキルに記号を付けて、
 * 新たに使用可能になったけれど、まだ使ったことのないスキルを目立たせます。
 * 一度使用すると記号が消えます。
 * 
 * レベルアップによるスキル習得以外に、アイテムや装備によるスキル追加、
 * イベントコマンドやプラグインによるスキル追加にも概ね対応しています。
 * また、初期スキルはアクターの初期化の際に未使用状態となります。
 * 
 * なお、途中のセーブデータで本プラグインを有効にした場合、
 * その時点で使用可能なスキルには記号が付きません。
 * それ以降で新たに使用可能になったスキルから反映されます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param UnusedMark
 * @text 未使用記号
 * @desc 対象のアクターがまだ使用していないスキルに付加する記号を指定します。
 * @type string
 * @default ◆
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 해당 액터가 아직 사용한 적이 없는 스킬에 기호를 표시합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261025202056.html
 * 
 * @help 해당 액터가 아직 사용한 적이 없는 스킬에 기호를 표시하여,
 * 새로 사용 가능해졌는데 아직 사용하지 않은 스킬을 눈에 띄게 합니다.
 * 한 번 사용하면 기호가 사라집니다.
 * 
 * 레벨업으로 습득하는 스킬뿐만 아니라 아이템이나 장비에 의한 스킬 추가,
 * 이벤트 명령이나 플러그인에 의한 스킬 추가에도 대체로 대응합니다.
 * 또한 초기 스킬은 액터 초기화 시에 미사용 상태로 처리됩니다.
 * 
 * 기존 세이브 데이터에서 이 플러그인을 활성화한 경우,
 * 그 시점에 이미 사용 가능한 스킬에는 기호가 표시되지 않습니다.
 * 이후에 사로 사용 가능해진 스킬부터 반영됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param UnusedMark
 * @text 미사용 기호
 * @desc 대상 액터가 아직 사용하지 않은 스킬에 붙일 기호를 지정합니다.
 * @type string
 * @default ◆
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const UnusedMark = parameters['UnusedMark'] || '';
	
	
	//--------------------------------------------------
	// Game_Actor.initSkills
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Actor_initSkills = Game_Actor.prototype.initSkills;
	Game_Actor.prototype.initSkills = function() {
		this._unusedSkills = {};
		_Game_Actor_initSkills.call(this);
		this._skills.forEach(skillId => {
			this.setUnusedSkill(skillId);
		});
	};
	
	//--------------------------------------------------
	// Game_Actor.prepareUnusedSkills
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.prepareUnusedSkills = function() {
		if (this._unusedSkills === undefined) {
			this.skills();
		}
	};
	
	//--------------------------------------------------
	// Game_Actor.setUnusedSkill
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.setUnusedSkill = function(skillId) {
		this.prepareUnusedSkills();
		this._unusedSkills[skillId] = true;
	};
	
	//--------------------------------------------------
	// Game_Actor.setUsedSkill
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.setUsedSkill = function(skillId) {
		this.prepareUnusedSkills();
		this._unusedSkills[skillId] = false;
	};
	
	//--------------------------------------------------
	// Game_Actor.isUnusedSkill
	//  [New Definition]
	//--------------------------------------------------
	Game_Actor.prototype.isUnusedSkill = function(skillId) {
		this.prepareUnusedSkills();
		return !!this._unusedSkills[skillId];
	};
	
	//--------------------------------------------------
	// Game_Actor.skills
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Actor_skills = Game_Actor.prototype.skills;
	Game_Actor.prototype.skills = function() {
		const skills = _Game_Actor_skills.call(this);
		if (this._unusedSkills === undefined) {
			this._unusedSkills = {};
			skills.forEach(skill => {
				this.setUsedSkill(skill.id);
			});
		}
		skills.forEach(skill => {
			if (this._unusedSkills[skill.id] === undefined) {
				this.setUnusedSkill(skill.id);
			}
		});
		return skills;
	};
	
	
	//--------------------------------------------------
	// Game_Battler.useItem
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Battler_useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		_Game_Battler_useItem.call(this, item);
		if (this.isActor() && DataManager.isSkill(item)) {
			this.setUsedSkill(item.id);
		}
	};
	
	
	//--------------------------------------------------
	// Window_SkillList.drawItem
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_SkillList_drawItem = Window_SkillList.prototype.drawItem;
	Window_SkillList.prototype.drawItem = function(index) {
		_Window_SkillList_drawItem.call(this, index);
		const skill = this.itemAt(index);
		const actor = this._actor;
		if (actor && skill) {
			if (actor.isUnusedSkill(skill.id)) {
				const costWidth = _Window_SkillList_costWidth.call(this);
				const rect = this.itemLineRect(index);
				this.resetTextColor();
				this.drawText(UnusedMark, rect.x, rect.y, rect.width - costWidth, 'right');
			}
		}
	};
	
	//--------------------------------------------------
	// Window_SkillList.costWidth
	//  [Added Definition]
	//--------------------------------------------------
	const _Window_SkillList_costWidth = Window_SkillList.prototype.costWidth;
	Window_SkillList.prototype.costWidth = function() {
		return this.textWidth(UnusedMark) + _Window_SkillList_costWidth.call(this);
	};
	
})();
