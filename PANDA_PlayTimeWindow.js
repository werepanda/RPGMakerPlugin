//=============================================================================
// PANDA_PlayTimeWindow.js
//=============================================================================
// [Update History]
// 2026-10-20 Ver.1.0.0 First Release for MZ.

/*:
 * @target MZ
 * @plugindesc display the total play time on the main menu.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261020001711.html
 * 
 * @help Adds a window to the main menu that displays the total play time.
 * You can set the windows's position and size using X, Y, width and height.
 * By default, it appears above the gold window.
 * In that case, the height of the command window is adjusted automatically.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param TitleText
 * @text Title Text
 * @desc Specify the label text shown before the play time.
 * @type string
 * @default Play Time
 * 
 * @param WindowLayout
 * @text Window Layout
 * @desc Specify the windows's position and size. If set to default, the window will appear above the gold window.
 * @type struct<rect>
 * 
 */
/*~struct~rect:
 * 
 * @param IsDefault
 * @text Default Layout
 * @desc If ON, adjusts command window height and shows this window above the gold window. Ignores individual layout settings.
 * @type boolean
 * @default true
 * 
 * @param IsSeparateLines
 * @text Display on Two Lines
 * @desc If ON, shows the title and play time on separate lines. If OFF, displays them on the same line.
 * @type boolean
 * @default true
 * 
 * @param Left
 * @text Window Left
 * @desc Specify the left X position of the window in pixels.
 * @type number
 * @default 568
 * 
 * @param Top
 * @text Window Top
 * @desc Specify the top Y position of the window in pixels.
 * @type number
 * @default 440
 * 
 * @param Width
 * @text Window Width
 * @desc Specify the width of the window in pixels.
 * @type number
 * @default 240
 * 
 * @param Height
 * @text Window Height
 * @desc Specify the height of the window in pixels.
 * @type number
 * @default 108
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc メニュー画面に現在のプレイ時間を表示します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261020001711.html
 * 
 * @help メニュー画面に現在のプレイ時間を表示するウィンドウを追加します。
 * 
 * ウィンドウの位置やサイズは、X座標・Y座標・幅・高さで自由な設定可能です。
 * デフォルトではメニュー画面の所持金ウィンドウの上に配置され、
 * その場合はコマンドウィンドウの高さが自動調整されます。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param TitleText
 * @text タイトルテキスト
 * @desc プレイ時間の前に表示するラベルの文字列を入力します。
 * @type string
 * @default プレイ時間
 * 
 * @param WindowLayout
 * @text ウィンドウレイアウト
 * @desc ウィンドウの位置とサイズを指定します。デフォルトにすると所持金ウィンドウの上に配置されます。
 * @type struct<rect>
 * 
 */
/*~struct~rect:ja:
 * 
 * @param IsDefault
 * @text デフォルトレイアウト
 * @desc ONにするとコマンドウィンドウの高さを調整して所持金ウィンドウの上に配置し、個別のレイアウト設定は無視します。
 * @type boolean
 * @default true
 * 
 * @param IsSeparateLines
 * @text 2行に分けて表示
 * @desc ONにするとタイトルとプレイ時間を2行に分けて表示し、OFFにすると同じ行に並べて表示します。
 * @type boolean
 * @default true
 * 
 * @param Left
 * @text ウィンドウ左上X座標
 * @desc ウィンドウの左上のX座標をピクセルで指定します。
 * @type number
 * @default 568
 * 
 * @param Top
 * @text ウィンドウ左上Y座標
 * @desc ウィンドウの左上のY座標をピクセルで指定します。
 * @type number
 * @default 440
 * 
 * @param Width
 * @text ウィンドウ幅
 * @desc ウィンドウの幅をピクセルで指定します。
 * @type number
 * @default 240
 * 
 * @param Height
 * @text ウィンドウ高さ
 * @desc ウィンドウの高さをピクセルで指定します。
 * @type number
 * @default 108
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 메뉴 화면에 현재 플레이 시간을 표시합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20261020001711.html
 * 
 * @help 메뉴 화면에 현재 플레이 시간을 표시하는 창을 추가합니다.
 * X좌표, Y좌표 너비, 높이로 창의 위치와 크기를 자유롭게 배치할 수 있습니다.
 * 기본값으로는 소지금 창 위에 표시되며,
 * 이 경우 커맨드 창의 높이는 자동으로 조정됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @param TitleText
 * @text 제목 텍스트
 * @desc 플레이 시간 앞에 표시될 라벨 텍스트를 지정합니다.
 * @type string
 * @default 플레이 시간
 * 
 * @param WindowLayout
 * @text 창 레이아웃
 * @desc 창의 위치와 크기를 지정합니다. 기본값으로 설정하면 소지금 창 위에 배치됩니다.
 * @type struct<rect>
 * 
 */
/*~struct~rect:ko:
 * 
 * @param IsDefault
 * @text 기본 레이아웃
 * @desc ON으로 설정하면 커맨드 창의 높이를 조정하여 소지금 창 위에 배치되며, 개별 레이아웃 설정은 무시됩니다.
 * @type boolean
 * @default true
 * 
 * @param IsSeparateLines
 * @text 두 줄로 표시
 * @desc ON으로 설정하면 제목과 플레이 시간을 두 줄로 나누어 표시하고, OFF로 하면 같은 줄에 나란히 표시됩니다.
 * @type boolean
 * @default true
 * 
 * @param Left
 * @text 창 X좌표
 * @desc 창 왼쪽 상단의 X좌표를 픽셀로 지정합니다.
 * @type number
 * @default 568
 * 
 * @param Top
 * @text 창 Y좌표
 * @desc 창 왼쪽 상단의 Y좌표를 픽셀로 지정합니다.
 * @type number
 * @default 440
 * 
 * @param Width
 * @text 창 너비
 * @desc 창 너비를 픽셀로 지정합니다.
 * @type number
 * @default 240
 * 
 * @param Height
 * @text 창 높이
 * @desc 창 높이를 픽셀로 지정합니다.
 * @type number
 * @default 108
 * 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	// Parameters
	const parameters = PluginManager.parameters(pluginName);
	const TitleText = parameters['TitleText'] || '';
	
	// Window Layout
	const WindowLayout = JSON.parse(parameters['WindowLayout'] || '{"IsDefault": "true"}');
	const LayoutDefault = (WindowLayout.IsDefault !== 'false');
	const IsSeparateLines = (WindowLayout.IsSeparateLines !== 'false');
	const WindowLeft   = parseInt(WindowLayout.Left);
	const WindowTop    = parseInt(WindowLayout.Top);
	const WindowWidth  = parseInt(WindowLayout.Width);
	const WindowHeight = parseInt(WindowLayout.Height);
	
	
	//--------------------------------------------------
	// Scene_Menu.create
	//  [Added Definition]
	//--------------------------------------------------
	const _Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		_Scene_Menu_create.call(this);
		this.createPlayTimeWindow();
	};
	
	//--------------------------------------------------
	// Scene_Menu.update
	//  [Added Definition]
	//--------------------------------------------------
	const _Scene_Menu_update = Scene_Menu.prototype.update;
	Scene_Menu.prototype.update = function() {
		_Scene_Menu_update.call(this);
		this._playTimeWindow.refresh();
	};
	
	//--------------------------------------------------
	// Scene_Menu.commandWindowRect
	//  [Added Definition]
	//--------------------------------------------------
	const _Scene_Menu_commandWindowRect = Scene_Menu.prototype.commandWindowRect;
	Scene_Menu.prototype.commandWindowRect = function() {
		if (LayoutDefault) {
			const ww = this.mainCommandWidth();
			const wh = this.mainAreaHeight() - this.goldWindowRect().height - this.playTimeWindowRect().height;
			const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
			const wy = this.mainAreaTop();
			return new Rectangle(wx, wy, ww, wh);
		} else {
			return _Scene_Menu_commandWindowRect.call(this);
		}
	};
	
	//--------------------------------------------------
	// Scene_Menu.createPlayTimeWindow
	//  [New Definition]
	//--------------------------------------------------
	Scene_Menu.prototype.createPlayTimeWindow = function() {
		const rect = this.playTimeWindowRect();
		this._playTimeWindow = new Window_PlayTime(rect);
		this.addWindow(this._playTimeWindow);
	};
	
	//--------------------------------------------------
	// Scene_Menu.playTimeWindowRect
	//  [New Definition]
	//--------------------------------------------------
	Scene_Menu.prototype.playTimeWindowRect = function() {
		if (LayoutDefault) {
			const ww = this.mainCommandWidth();
			const wh = this.calcWindowHeight(IsSeparateLines ? 2 : 1, true);
			const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
			const wy = this.mainAreaBottom() - this.goldWindowRect().height - wh;
			return new Rectangle(wx, wy, ww, wh);
		} else {
			return new Rectangle(WindowLeft, WindowTop, WindowWidth, WindowHeight);
		}
	};
	
	
	//--------------------------------------------------
	// Window_PlayTime
	//  [New Definition]
	//--------------------------------------------------
	function Window_PlayTime() {
		this.initialize(...arguments);
	}
	
	Window_PlayTime.prototype = Object.create(Window_Selectable.prototype);
	Window_PlayTime.prototype.constructor = Window_PlayTime;
	
	Window_PlayTime.prototype.initialize = function(rect) {
		Window_Selectable.prototype.initialize.call(this, rect);
		this.refresh();
	};
	
	Window_PlayTime.prototype.colSpacing = function() {
		return 0;
	}
	
	Window_PlayTime.prototype.refresh = function() {
		this.contents.clear();
		this.drawTitle();
		this.drawPlayTime();
	};
	
	Window_PlayTime.prototype.drawTitle = function() {
		const rect = this.itemLineRect(0);
		const x = rect.x;
		const y = rect.y;
		const width = rect.width;
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(this.titleText(), x, y, width);
		this.resetTextColor();
	};
	
	Window_PlayTime.prototype.drawPlayTime = function() {
		const rect = this.itemLineRect(IsSeparateLines ? 1 : 0);
		const x = rect.x;
		const y = rect.y;
		const width = rect.width;
		this.drawText(this.value(), x, y, width, "right");
	};
	
	Window_PlayTime.prototype.titleText = function() {
		return TitleText;
	};
	
	Window_PlayTime.prototype.value = function() {
		return $gameSystem.playtimeText();
	};
	
})();

