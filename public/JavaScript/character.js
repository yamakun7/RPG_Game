//ここでデータをimportしてそれぞれのクラスは名前だけ受け取って値を設定してもよい。
//キャラクタークラス
class Character {
    constructor(name, Lv, experience_point, max_hp, hp, max_mp, mp, atack_power, magic_power, speed, jpName, isLive, magicTable) {
        this.name = name;
        this.Lv = Lv;
        this.experience_point = experience_point;
        this.max_hp = max_hp;
        this.hp = hp;
        this.max_mp = max_mp;
        this.mp = mp;
        this.attack_power = atack_power;
        this.magic_power = magic_power;
        this.speed = speed;
        this.jpName = jpName;
        this.isLive = isLive;
        this.magicTable = magicTable.concat();
    }
    getName() {
        return this.name;
    }
    getLv() {
        return this.Lv;
    }
    getExperiencePoint() {
        return this.experience_point;
    }
    getMaxHp() {
        return this.max_hp;
    }
    getHp() {
        return this.hp;
    }
    getMaxMp() {
        return this.max_mp;
    }
    getMp() {
        return this.mp;
    }
    getAttackPower() {
        return this.attack_power;
    }
    getMagicPower() {
        return this.magic_power;
    }
    getSpeed() {
        return this.speed;
    }
    getJpName() {
        return this.jpName;
    }
    getIsLive() {
        return this.isLive;
    }
    //hpが0以下になっていたらtrueを返す。
    isDeath() {
        if (this.hp <= 0) {
            this.isLive = false;
            return true;
        }
        return false;
    }
    minusHp(point) {
        this.hp -= point;
    }
    receiveDamage(point) {
        this.minusHp(point);
        if (this.hp <= 0)
            this.hp = 0;
        //return this.isDeath();
    }
    addExPoint(exPoint) {
        this.experience_point += exPoint;
    }
}
//操作キャラとクラス分ける
export class Player extends Character {
    constructor(name, Lv, experience_point, max_hp, hp, max_mp, mp, attack_power, magic_power, speed, jpName, isLive, magicTable) {
        super(name, Lv, experience_point, max_hp, hp, max_mp, mp, attack_power, magic_power, speed, jpName, isLive, magicTable);
    }
    //レベルアップ処理
    isLevelUp() {
        if (this.experience_point >= Math.pow(this.Lv, 3))
            return true;
        return false;
    }
    LevelUp() {
        while (this.experience_point >= (Math.pow(this.Lv, 3))) {
            this.Lv++;
            this.addLvUpReword();
        }
    }
    addLvUpReword() {
        switch (this.name) {
            case "yusha":
                this.max_hp += 3;
                this.hp += 3;
                this.max_mp += 2;
                this.mp += 2;
                this.attack_power += 2;
                this.magic_power += 2;
                this.speed += 2;
                if (this.Lv == 5)
                    this.magicTable.push("lidein");
                if (this.Lv == 10)
                    this.magicTable.push("gigadein");
                break;
            case "mashi":
                this.max_hp += 3;
                this.hp += 3;
                this.max_mp += 2;
                this.mp += 2;
                this.attack_power += 2;
                this.magic_power += 2;
                this.speed += 2;
                if (this.Lv == 5)
                    this.magicTable.push("merami");
                if (this.Lv == 10)
                    this.magicTable.push("merazoma");
                break;
            case "butouka":
                this.max_hp += 3;
                this.hp += 3;
                this.max_mp += 0;
                this.mp += 0;
                this.attack_power += 3;
                this.magic_power += 0;
                this.speed += 3;
                break;
            case "souryo":
                this.max_hp += 3;
                this.hp += 3;
                this.max_mp += 2;
                this.mp += 2;
                this.attack_power += 2;
                this.magic_power += 2;
                this.speed += 2;
                if (this.Lv == 5)
                    this.magicTable.push("behoimi");
                if (this.Lv == 10)
                    this.magicTable.push("behoma");
                break;
        }
    }
}
export class Enemy extends Character {
    constructor(name, Lv, experience_point, max_hp, hp, max_mp, mp, attack_power, magic_power, speed, jpName, isLive, imgName, magicTable) {
        super(name, Lv, experience_point, max_hp, hp, max_mp, mp, attack_power, magic_power, speed, jpName, isLive, magicTable);
        this.imgName = imgName;
    }
    getImgName() {
        return this.imgName;
    }
}
