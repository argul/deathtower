/**
 * Created by argulworm on 6/28/17.
 */

dt.attr = {

};

dt.attr.BaseAttr = function () {
    this.hp = 0;//血量
    this.mp = 0;//蓝量
    this.sp = 0;//策略点(回合数,命中,被击)
    this.patk = 0;//物攻
    this.matk = 0;//魔攻
    this.pdef = 0;//物防
    this.mdef = 0;//魔防
    this.dodge_pct = 0;//闪避
    this.parry_pct = 0;//格挡几率
    this.pcrit_pct = 0;//物理暴击率
    this.mcrit_pct = 0;//魔法暴击率
};

dt.attr.AdvancedAttr = function () {
    this.critfactor_pct = 0;//暴击伤害
    this.anticrit_pct = 0;//降低被暴击几率
    this.antidebuff_pct = 0;//异常状态抗性
    this.presist_pct = 0;//物理抗性
    this.mresist_pct = 0;//魔法抗性
    this.pabsorb_pct = 0;//物理吸收
    this.mabsorb_pct = 0;//魔法吸收
    this.finaldmg_pct = 0;//最终伤害加成
    this.finalresist_pct = 0;//最终伤害减免
};
