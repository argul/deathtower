/**
 * Created by argulworm on 7/20/17.
 */

dt.skilldata = dt.skilldata || {};

dt.skilldata.basicAttack = {
    cooldown: {
        hasCooldown: false,
        cooldownRounds: 0,
        initialCooldown: 0
    },
    effects: [{
        effectcode: dt.effectcode.PHYSICAL_DAMAGE,
        powerfactor: 1.0
    }]
};