//ここでデータをimportしてそれぞれのクラスは名前だけ受け取って値を設定してもよい。

//キャラクタークラス
class Character{
    name: string;
    Lv: number;
    experience_point: number;
    max_hp: number;
    hp: number;
    max_mp: number;
    mp: number;
    attack_power: number;
    magic_power: number;
    speed: number;
    jpName: string;
    isLive: boolean;
    magicTable: string[];
    constructor(name: string, Lv: number, experience_point: number, max_hp: number, hp: number, max_mp: number,mp: number, atack_power: number, magic_power: number, speed: number, jpName: string, isLive: boolean, magicTable: string[]){
        this.name=name;
        this.Lv=Lv;
        this.experience_point=experience_point;
        this.max_hp = max_hp;
        this.hp=hp;
        this.max_mp=max_mp;
        this.mp=mp;
        this.attack_power=atack_power;
        this.magic_power=magic_power;
        this.speed=speed;
        this.jpName=jpName;
        this.isLive=isLive;
        this.magicTable=magicTable.concat();
    }

    getName(): string{
        return this.name;
    }
    getLv(): number{
        return this.Lv;
    }
    getExperiencePoint(): number{
        return this.experience_point;
    }
    getMaxHp(): number{
        return this.max_hp;
    }
    getHp(): number{
        return this.hp;
    }
    getMaxMp(): number{
        return this.max_mp;
    }
    getMp(): number{
        return this.mp;
    }
    getAttackPower(): number{
        return this.attack_power;
    }
    getMagicPower(): number{
        return this.magic_power;
    }
    getSpeed(): number{
        return this.speed;
    }
    getJpName(): string{
        return this.jpName;
    }
    getIsLive(): boolean{
        return this.isLive;
    }

    //hpが0以下になっていたらtrueを返す。
    isDeath(): boolean{
        if(this.hp<=0){
            this.isLive=false;
            return true;
        }
        return false;
    }
    minusHp(point: number){
        this.hp-=point;
    }
    receiveDamage(point: number){ //これ使えばいい
        this.minusHp(point);
        if(this.hp<=0) this.hp=0;
        //return this.isDeath();
    }

    addExPoint(exPoint: number){
        this.experience_point+=exPoint;
    }
    
}

//操作キャラとクラス分ける
export class Player extends Character{
    constructor(name: string, Lv: number, experience_point: number,max_hp: number, hp: number, max_mp: number,mp: number, attack_power: number, magic_power: number, speed: number, jpName: string, isLive: boolean, magicTable: string[]){
        super(name, Lv, experience_point, max_hp, hp, max_mp, mp, attack_power, magic_power, speed, jpName, isLive, magicTable);
    }


    //レベルアップ処理
    isLevelUp(): boolean{
        if(this.experience_point>=Math.pow(this.Lv, 3)) return true; 
        return false;
    }

    LevelUp(){
        while(this.experience_point>= (Math.pow(this.Lv, 3))){
            this.Lv++;
            this.addLvUpReword();
        }
    }

    addLvUpReword(){
        switch(this.name){
            case "yusha":
                this.max_hp+=3;
                this.hp+=3;
                this.max_mp+=2;
                this.mp+=2;
                this.attack_power+=2;
                this.magic_power+=2;
                this.speed+=2;
                if(this.Lv==5)
                    this.magicTable.push("lidein");
                if(this.Lv==10)
                    this.magicTable.push("gigadein");
                break;
            case "mashi":
                this.max_hp+=3;
                this.hp+=3;
                this.max_mp+=2;
                this.mp+=2;
                this.attack_power+=2;
                this.magic_power+=2;
                this.speed+=2;
                if(this.Lv==5)
                    this.magicTable.push("merami");
                if(this.Lv==10)
                    this.magicTable.push("merazoma");
                break;
            case "butouka":
                this.max_hp+=3;
                this.hp+=3;
                this.max_mp+=0;
                this.mp+=0;
                this.attack_power+=3;
                this.magic_power+=0;
                this.speed+=3;
                break;
            case "souryo":
                this.max_hp+=3;
                this.hp+=3;
                this.max_mp+=2;
                this.mp+=2;
                this.attack_power+=2;
                this.magic_power+=2;
                this.speed+=2;
                if(this.Lv==5)
                    this.magicTable.push("behoimi");
                if(this.Lv==10)
                    this.magicTable.push("behoma");
                break;
        }

    }

}

export class Enemy extends Character{
    imgName: string;
    constructor(name: string, Lv: number, experience_point: number,max_hp: number, hp: number, max_mp: number,mp: number, attack_power: number, magic_power: number, speed: number, jpName: string, isLive: boolean, imgName: string, magicTable: string[]){
        super(name, Lv, experience_point, max_hp, hp, max_mp, mp, attack_power, magic_power, speed, jpName, isLive, magicTable);
        this.imgName=imgName;
    }

    getImgName(){
        return this.imgName;
    }

}
