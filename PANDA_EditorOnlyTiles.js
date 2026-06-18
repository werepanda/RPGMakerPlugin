//=============================================================================
// PANDA_EditorOnlyTiles.js
//=============================================================================
// [Update History]
// 2025-09-18 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc hides tiles (map chips) with the specified terrain tags in-game.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250918175350.html
 * 
 * @help Tiles that have the terrain tags specified in the plugin parameters
 * will not be displayed in the actual game screen.
 * 
 * They remain visible in the map editor, so placing dummy map chips
 * for passability, etc., will not affect the look during play.
 *  - Only the appearance is hidden.
 *    effects such as passability or bush remain as they are.
 *  - Tile images used by events are also hidden.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param HideTerrainTags
 * @text Hidden Terrain Tags
 * @desc Specify the terrain tags to hide in-game. Multiple entries can be specified.
 * @type number[]
 * @default []
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 指定した地形タグのタイルを実際のゲーム画面で非表示にします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250918175350.html
 * 
 * @help プラグインパラメータで指定された地形タグを持つマップチップは、
 * 実際のゲーム画面では表示されなくなります。
 * 
 * マップエディタ上では通常どおり表示されるため、
 * 通行設定用のダミーのタイル等を配置しても、プレイ時の見た目には影響しません。
 * ・見た目だけを非表示にし、通行設定や茂み属性等の効果はそのまま残ります。
 * ・イベントのタイル画像も同様に非表示になります。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param HideTerrainTags
 * @text 非表示地形タグ
 * @desc 実際のゲーム画面では非表示にする地形タグを指定します。複数指定が可能です。
 * @type number[]
 * @default []
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 지정한 지형 태그의 타일(맵칩)을 실제 게임 내에서 표시하지 않습니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250918175350.html
 * 
 * @help 플러그인 파라미터에서 지정한 지형 태그를 가진 타일(맵칩)은
 * 실제 게임 화면에서 표시되지 않습니다.
 * 
 * 맵 에디터에서는 그대로 보이므로, 통행 설정용 더미 타일 등을 배치해도
 * 플레이 시 외형에는 영향을 주지 않습니다.
 *  - 겉모습만 숨기며, 통행 설정이나 수풀 속성 등의 효과는 그대로 남습니다.
 *  - 이벤트의 타일 이미지도 동일하게 비표시됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param HideTerrainTags
 * @text 비표시 지형 태그
 * @desc 실제 게임 내에서 숨길 지형 태그를 지정합니다. 복수 지정이 가능합니다.
 * @type number[]
 * @default []
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const HideTerrainTags = (JSON.parse(parameters['HideTerrainTags']) || []).map(n => Number(n));
	
	
	//--------------------------------------------------
	// Game_CharacterBase.isTransparent
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_CharacterBase_isTransparent = Game_CharacterBase.prototype.isTransparent;
	Game_CharacterBase.prototype.isTransparent = function() {
		return _Game_CharacterBase_isTransparent.call(this) || (this._tileId > 0 && !Tilemap.isVisibleTile(this._tileId));
	};
	
	//--------------------------------------------------
	// Tilemap.isVisibleTile
	//  [Added Definition]
	//--------------------------------------------------
	const _Tilemap_isVisibleTile = Tilemap.isVisibleTile;
	Tilemap.isVisibleTile = function(tileId) {
		if (_Tilemap_isVisibleTile.call(this, tileId)) {
			const flags = this.flags || ($gameMap.tileset() && $gameMap.tileset().flags);
			const tag = flags[tileId] >> 12;
			return !HideTerrainTags.includes(tag);
		} else {
			return false;
		}
	};
	
	
})();

