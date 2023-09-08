var Imported = Imported || {};
Imported.Coolie_BattleTurnCount = true;

var Coolie = Coolie || {};
Coolie.BTW = Coolie.BTW || {};
Coolie.BTW.version = 1.00;

/*:
 * @plugindesc v1.0 Displays a turn count window in battle
 * @author William Couillard
 *
 * @help
 * About This Plugin
 * -----------------------------------------------------------------------------
 * Adds a window to Scene_Battle that shows the turn count.
 * Compatibility should be very high.
 *
 * Terms and Conditions
 * -----------------------------------------------------------------------------
 * It is OK to use this plugin in both non-commercial and commercial projects,
 * as long as proper credit is given to William Couillard in your game.
 *
 * Helpful Tips
 * -----------------------------------------------------------------------------
 * - With the use of Yanfly's YEP_MessageCore and biud436's RS_MessageAlign
 *   plugins, it becomes possible to use escape codes with the text in this
 *   plugin, like so:
 *
 *   \\c[2]Turn\\c[0]
 *
 *   If you are using those two plugins, place this plugin BELOW them.
 *
 * - With escape codes enabled, you could even set the Window Text to something
 *   else in-game using a variable, and changing the Window Text setting in the
 *   plugin to call that variable, like so: \\v[x] where X is the variable ID.
 * 
 *   Using a variable in the escape code will allow you to change the text
 *   displayed in battle on the fly. You can also use other codes like \\i[x] to
 *   display an icon before the text.
 *
 * - If you are using AB_EnemyBook plugin, place this plugin ABOVE it to avoid
 *   a visual bug.
 *
 * - If you are using "Nasty Replace Window With Picture" plugin, the name of the
 *   window to use is Window_TurnCount.
 *
 * Version & Update History
 * -----------------------------------------------------------------------------
 * - v1.0 : Initial Release
 *          Sept. 16th, 2021
 *
 * @param Window Settings
 *
 * @param Window Width
 * @parent Window Settings
 * @type number
 * @min 0
 * @desc The width, in pixels, of the Turn Count Window
 * Default: 160
 * @default 160
 
 * @param Window X Position
 * @parent Window Settings
 * @type number
 * @min 0
 * @desc The X position, in pixels, of the Turn Count Window
 * Default: 0
 * @default 0
 
 * @param Window Y Position
 * @parent Window Settings
 * @type number
 * @min 0
 * @desc The Y position, in pixels, of the Turn Count Window
 * Default: 372
 * @default 372
 
 * @param Window Text
 * @parent Window Settings
 * @type text
 * @desc The width, in pixels, of the Turn Count Window
 * Default: Turn
 * @default Turn
 */

Coolie.Parameters = PluginManager.parameters('Coolie_BattleTurnCount');
Coolie.Param = Coolie.Param || {};

Coolie.Param.BTWWindowWidth = Number(Coolie.Parameters['Window Width']);
Coolie.Param.BTWWindowX = Number(Coolie.Parameters['Window X Position']);
Coolie.Param.BTWWindowY = Number(Coolie.Parameters['Window Y Position']);
Coolie.Param.BTWWindowText = String(Coolie.Parameters['Window Text']);

//-----------------------------------------------------------------------------
// Window_TurnCount
//
// The window for displaying the battle's turn count

function Window_TurnCount() {
    this.initialize.apply(this, arguments);
}

Window_TurnCount.prototype = Object.create(Window_Selectable.prototype);
Window_TurnCount.prototype.constructor = Window_TurnCount;

Window_TurnCount.prototype.initialize = function() {
    var width = Coolie.Param.BTWWindowWidth;
    var height = this.fittingHeight(1);
	var x = Coolie.Param.BTWWindowX;
	var y = Coolie.Param.BTWWindowY;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
	this.openness = 0;
};

Window_TurnCount.prototype.refresh = function() {
	var x = 0;
	var y = 0;
	text = Coolie.Param.BTWWindowText;
	text2 = Math.floor($gameTroop.turnCount() + 1).toString();
	this.contents.clear();
	if (Imported.RS_MessageAlign) {
		this.drawTextEx(text + '\\i[0]' + text2, x, y)
	} else {
		this.drawTextEx(text + ' ' + text2, x, y)
	}
};

Window_TurnCount.prototype.open = function() {
    this.refresh();
    Window_Selectable.prototype.open.call(this);
};

//-----------------------------------------------------------------------------
// Scene_Battle
//
// The scene class of the battle screen.

var alias_Coolie_BattleTurnCount_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
	alias_Coolie_BattleTurnCount_createAllWindows.call(this);
	this.createTurnsWindow();
};

Scene_Battle.prototype.createTurnsWindow = function() {
    this._turnsWindow = new Window_TurnCount();
	this.addWindow(this._turnsWindow);
	this._turnsWindow.open();
};

Scene_Battle.prototype.refreshTurnCount = function() {
    this._turnsWindow.refresh();
};

var alias_Coolie_BattleTurnCount_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
	alias_Coolie_BattleTurnCount_startPartyCommandSelection.call(this);
	this.refreshTurnCount();
};

//-----------------------------------------------------------------------------