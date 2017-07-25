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
        attr: "patk",
        powerfactor: 1.0,
        effectcode: dt.effectcode.PHYSICAL_DAMAGE
    }]
};