var bpAlias = Game_Battler.prototype.barrierPoints;
Game_Battler.prototype.barrierPoints = function(turn) {
    var shield = bpAlias.call(this, turn);
    shield = Math.min(this.mhp, shield);
    return shield;
};

var bpTotalAlias = Game_Battler.prototype.barrierPointsTotal;
Game_Battler.prototype.barrierPointsTotal = function(turn) {
    var value = bpTotalAlias.call(this, turn);
    value = Math.min(this.mhp, value);
    return value;
};