/*:
 *
 * @plugindesc This script gets the DOM of the canvas that renders the game and shakes the screen with css translate.
 * @author Creta Park (Park Jong-Hyeok) (creta5164@gmail.com, https://creft.me/cretapark)
 * 
 * @param Shake_strength.light
 * @desc Set the default value for 'Shake_strength.light'.
 * @default 2.5,45,0
 *
 * @param Shake_strength.normal
 * @desc Set the default value for 'Shake_strength.normal'.
 * @default 7.5,30,0
 *
 * @param Shake_strength.impact
 * @desc Set the default value for 'Shake_strength.impact'.
 * @default 10,15,0
 * 
 * @param Shake_style
 * @desc Determines whether the shake style is common shake style or rotates left or right style. (shake/radialShake)
 * @default shake
 * 
 * @help
 * Shaker plugin
 * ----------------------------------------------------------------------------
 * This plugin is a plugin that changes the screen shaking event of RPG Maker.
 * The source code uses an almost free MIT license in any case.
 * License : MIT
 * 
 * Usage
 * ----------------------------------------------------------------------------
 * Since it's using RPG Maker's default screen shake event, you don't need to use any code, but if you want to adjust the details to cause the shake, use the code below.
 * Create a script event and put them : 
 * 
 * Shaker.shake(intensity (px unit, multiplied by 10), frame update frequency, duration (60 = 1 second))
 *   Shake the screen.
 *   Usage : Shaker.shake(10, 0, 60);  // => 100, 0, 60
 * 
 * Shaker.shake(Shake_strength -> light, normal, impact)
 *   Shake the screen. (Plugin setting based)
 *   Usage : Shaker.shake(Shake_strength.impact);
 * 
 * 
 * Shaker.shake(intensity (degree unit), frame update frequency, duration (60 = 1 second))
 *   Tilt the screen left and right to shake it.
 *   Usage : Shaker.radialShake(10, 0, 60);
 * 
 * Shaker.radialShake(Shake_strength -> light, normal, impact)
 *   Shake the screen. (Plugin setting based)
 *   Usage : Shaker.radialShake(Shake_strength.impact);
 * 
 * Shaker.stop()
 *   Stop shaking screen.
 *   Usage case 1 - If you want constant shaking :
 *   //Note : It's an earthquake!
 *   Shaker.shake(10, 0, 9999999);
 *   [dialog] No, it's collapsing now...!
 *   :      : Go ahead and get out of here!
 *   //...
 * 
 *   Shake.stop();
 *   
 *   [dialog] Phew... that was so close.
 * 
 *   Usage case 2 - If you want a temporary, steady shake rather than a diminished shake :
 *   //Note : The monster roars out loud.
 *   Shaker.shake(20, 0, 60);
 *   SFX ] * roar sound *
 *   wait] 60
 *   Shaker.stop();
 */

var Shaker;

(function() {
    
    const Shake_strength = {
        light:"low",
        normal:  "normal",
        impact:"high"
    };

    var Shaker_template = {
        "low": {
            "amount":   parseFloat(PluginManager.parameters('Shaker')["Shake_strength.light"].split(',')[0]),
            "duration": parseFloat(PluginManager.parameters('Shaker')["Shake_strength.light"].split(',')[1]),
            "speed":    parseFloat(PluginManager.parameters('Shaker')["Shake_strength.light"].split(',')[2])
        },
        "normal": {
            "amount":   parseFloat(PluginManager.parameters('Shaker')["Shake_strength.normal"].split(',')[0]),
            "duration": parseFloat(PluginManager.parameters('Shaker')["Shake_strength.normal"].split(',')[1]),
            "speed":    parseFloat(PluginManager.parameters('Shaker')["Shake_strength.normal"].split(',')[2])
        },
        "high": {
            "amount":   parseFloat(PluginManager.parameters('Shaker')["Shake_strength.impact"].split(',')[0]),
            "duration": parseFloat(PluginManager.parameters('Shaker')["Shake_strength.impact"].split(',')[1]),
            "speed":    parseFloat(PluginManager.parameters('Shaker')["Shake_strength.impact"].split(',')[2])
        }
    };

    var Shaker_style = PluginManager.parameters('Shaker')["Shake_style"];

    var Shaker_totalDuration;
    var Shaker_current;
    var Shaker_context;

    Shaker = {
        "stop": function() {
            if (Shaker_context != null)
                Shaker_context.style.transform = "none";

            document.body.style.overflow = "";

            if (Shaker_current != null)
                clearInterval(Shaker_current);
            
            Shaker_current = null;
            Shaker_context = null;
        },

        "shake": function(amount, speed, duration, target)
        {
            if (amount === null   || amount === undefined)
                amount = Shake_strength.normal;
            if (speed === null    || speed === undefined)
                speed = 0;
            if (duration === null || duration === undefined)
                duration = 45;

            var temp = amount;
            if (typeof temp === "string" && temp in Shaker_template) {
                amount   = Shaker_template[temp].amount;
                duration = Shaker_template[temp].duration;
                speed    = Shaker_template[temp].speed;
            }
        
            if (target == null) {
                //초기화
                if (Shaker_current != null)
                    clearInterval(Shaker_current);
        
                Shaker_totalDuration = duration;
        
                Shaker.shake(amount * 10, speed, duration, document.getElementById("GameCanvas"));
        
                document.body.style.overflow = "hidden";
            } else {
                Shaker_context = target;

                if (duration <= 0) {
                    Shaker_current = null;
                    Shaker_context = null;
                    target.style.transform = "none";
                    document.body.style.overflow = "";
                    return;
                }
                
                var range = lerp(0, amount, duration / Shaker_totalDuration);
                var min = -range / 2;
        
                var axisX = min + Math.random() * range;
                var axisY = min + Math.random() * range;
                
                if (speed == 0 || duration % speed == 0)
                    target.style.transform = "translate(" + axisX + "px, " + axisY + "px)";
        
                Shaker_current = setTimeout(Shaker.shake, 1000 / 60, amount, speed, --duration, target);
            }
        },

        "radialShake": function(amount, speed, duration, target)
        {
            if (amount === null   || amount === undefined)
                amount = Shake_strength.normal;
            if (speed === null    || speed === undefined)
                speed = 0;
            if (duration === null || duration === undefined)
                duration = 45;
            
            var temp = amount;
            if (typeof temp === "string" && temp in Shaker_template) {
                amount   = Shaker_template[temp].amount;
                duration = Shaker_template[temp].duration;
                speed    = Shaker_template[temp].speed;
            }
        
            if (target == null) {
                //초기화
                if (Shaker_current != null)
                    clearInterval(Shaker_current);
        
                Shaker_totalDuration = duration;
        
                radialShake(amount, speed, duration, document.getElementById("GameCanvas"));
        
                document.body.style.overflow = "hidden";
            } else {
                Shaker_context = target;
                
                if (duration <= 0) {
                    Shaker_current = null;
                    Shaker_context = null;
                    target.style.transform = "none";
                    document.body.style.overflow = "";
                    return;
                }
                
                var range = lerp(0, amount, duration / Shaker_totalDuration);
        
                var axisX = range * (duration % 2 == 0 ? -1 : 1);
                
                if (speed == 0 || duration % speed == 0)
                    target.style.transform = "rotate(" + axisX + "deg)";
        
                Shaker_current = setTimeout(radialShake, 1000 / 60, amount, speed, --duration, target);
            }
        }
    }

    function lerp(a, b, c) { return a + c * (b - a); }

    Game_Screen.prototype.startShake = function(power, speed, duration) {
        if (Shaker_style in Shaker)
            Shaker[Shaker_style](power, 0, duration);
        else
            Shaker.shake(power, 0, duration);
    };

    Game_Screen.prototype.updateShake = function() {};

})();