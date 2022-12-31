//=============================================================================
// Bobstah Plugins
// BOB_CriticalEvents.js
// Version: 1.0
//=============================================================================
var Imported = Imported || {};
Imported.BOB_CriticalEvents = true;

var Bobstah = Bobstah || {};
Bobstah.CriticalEvents = Bobstah.CriticalEvents || {};

//=============================================================================
 /*:
 * @plugindesc Allows a common event to be called upon critical hit.
 * @author Bobstah
 *
 * ============================================================================
 * Params
 * ============================================================================
 * @param Common Event ID
 * @desc Set to the common event ID to call upon critical hit.
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin runs a common event during the critical damage popup.
 * You can use any available common event command.
*/
 
Bobstah.Parameters = PluginManager.parameters('BOB_CriticalEvents');
Bobstah.Param = Bobstah.Param || {};

Bobstah.Param.CriticalEvents_CommonEventID = Number(Bobstah.Parameters['Common Event ID']);
//=============================================================================
// Game_Action
//=============================================================================
Bobstah.CriticalEvents.GameAction_applyCritical = Game_Action.prototype.applyCritical;
Game_Action.prototype.applyCritical = function(damage) {
	if (Bobstah.Param.CriticalEvents_CommonEventID !== 0) {
		$gameTemp.reserveCommonEvent(Bobstah.Param.CriticalEvents_CommonEventID);
	}
	return Bobstah.CriticalEvents.GameAction_applyCritical.call(this, damage);
};