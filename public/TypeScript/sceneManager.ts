import { fieldMetaData, mapData } from "./config.js";

export class Field{
    //floor: number[];
    //floor: Array<number>[] = new Array(); //フィールドの２次元配列
    blockSize: number; //1マスの大きさ
    boardRow: number; //行数
    boardCol: number; //列数
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    parentDiv: HTMLElement; //canvasの親要素
    fieldImages: {[key: string]: HTMLImageElement};
    isFirst: boolean;

    frameCount: number;
    stopAnimationId: number;
    constructor(){
        this.blockSize = fieldMetaData["blockSize"];
        this.boardRow = fieldMetaData["boardRow"];
        this.boardCol = fieldMetaData["boardCol"];
 
        this.canvas = document.createElement("canvas")!;
        this.canvas.setAttribute("id", "field-canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.parentDiv=document.getElementById("field-display")!;

        this.fieldImages={};
        this.isFirst=true;

        this.frameCount=0;
        this.stopAnimationId=0;
    }

    loadImage(str: string){

        return new Promise((resolve, reject)=>{
            this.fieldImages[str] = document.createElement("img");
            this.fieldImages[str].src="/Image/field/"+str+".png";
            console.log("loadImageStart");
            this.fieldImages[str].onload=()=>{
                console.log("load");
                resolve(true);
            }
            this.fieldImages[str].onerror=()=>{
                console.log("load error");
                reject(false);
            }
        })
    }

    drawInit(){
            this.parentDiv.style.display="block";
            //Canvasの大きさを指定
            const canvasW = this.blockSize * this.boardCol; 
            const canvasH = this.blockSize * this.boardRow;
    
            //canvasのwidthとheightを設定
            this.canvas.width = canvasW;
            this.canvas.height = canvasH;
    
            this.parentDiv.append(this.canvas);       
    }

    //フィールドを描画
    drawField(){
        this.parentDiv.style.display="block";
        for(let i=0;i<this.boardRow;i++){
            for(let j=0;j<this.boardCol;j++){
                if(mapData.map01[i][j]==0){ //山を表示
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                    this.ctx.drawImage(this.fieldImages["mount01"], 0, 0, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.map01[i][j]==1){ //草を表示
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.map01[i][j]==2){ //木を表示
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                    this.ctx.drawImage(this.fieldImages["map01"], 64, 32, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.map01[i][j]==5){ //町の左部分
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                    this.ctx.drawImage(this.fieldImages["map01"], 32, 192, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.map01[i][j]==6){ //町の右部分
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                    this.ctx.drawImage(this.fieldImages["map01"], 64, 192, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.map01[i][j]==7){ //洞窟
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                    this.ctx.drawImage(this.fieldImages["map01"], 192, 64, 32, 32, 32*j, 32*i, 32, 32);
                }           
            }
        }
    }

    //村の処理
    drawVillage(){
        this.parentDiv.style.display="block";
        for(let i=0;i<this.boardRow;i++){
            for(let j=0;j<this.boardCol;j++){
                if(mapData.village01[i][j]==0){
                    this.ctx.drawImage(this.fieldImages["map01"], 0, 0, 32, 32, 32*j, 32*i, 32, 32);
                    this.ctx.drawImage(this.fieldImages["map01"], 64, 32, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.village01[i][j]==1){
                    this.ctx.drawImage(this.fieldImages["map01"], 0, 0, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.village01[i][j]==5){
                    this.ctx.drawImage(this.fieldImages["map01"], 0, 0, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.village01[i][j]==8){
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.village01[i][j]==9){
                    this.ctx.drawImage(this.fieldImages["field01"], 0, 128, 32, 32, 32*j, 32*i, 32, 32);
                }
            }
        }
        
    }
    healAnimation(){
        console.log("healAnimation"+(120*this.frameCount)%600 +", "+ Math.floor((120*this.frameCount)/600));
        this.ctx.drawImage(this.fieldImages["heal"], (120*this.frameCount)%600, Math.floor((120*this.frameCount)/600)*120, 120, 120, 32*12, 32*5, 192, 192);
        this.frameCount++;
        if(this.frameCount>=15) this.frameCount=0;
    }

    //洞窟を表示
    drawCave(){
        this.parentDiv.style.display="block";
        for(let i=0;i<this.boardRow;i++){
            for(let j=0;j<this.boardCol;j++){
                if(mapData.cave01[i][j]==0){
                    this.ctx.drawImage(this.fieldImages["cave01"], 192, 32, 32, 32, 32*j, 32*i, 32, 32);
                    this.ctx.drawImage(this.fieldImages["mount01"], 0, 0, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.cave01[i][j]==1){
                    this.ctx.drawImage(this.fieldImages["cave01"], 192, 32, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.cave01[i][j]==4){
                    this.ctx.drawImage(this.fieldImages["cave01"], 192, 32, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.cave01[i][j]==5){
                    this.ctx.drawImage(this.fieldImages["cave01"], 192, 32, 32, 32, 32*j, 32*i, 32, 32);
                    //this.ctx.drawImage(this.fieldImages["boss"], 0, 0, 1024, 1024, 32*j, 32*i,32, 32);
                }else if(mapData.cave01[i][j]==8){
                    this.ctx.drawImage(this.fieldImages["cave01"], 192, 32, 32, 32, 32*j, 32*i, 32, 32);
                }else if(mapData.cave01[i][j]==9){
                    this.ctx.drawImage(this.fieldImages["cave01"], 192, 32, 32, 32, 32*j, 32*i, 32, 32);
                }
            }
        }
        this.ctx.drawImage(this.fieldImages["boss"], 0, 0, 688, 663, 32*4, 32*2, 42, 42);
    }

    //canvasの内容をフィールドから村に変更
    changetoVillage(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawVillage();
    }
    changeToField(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawField();
    }
    changeToCave(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawCave();
    }
    removeFeild(){
        console.log("removeFeild");
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.parentDiv.style.display="none";
    }
}

//バトルクラス
class Battle{
    battleDiv: HTMLElement;
    constructor(){
        this.battleDiv = document.getElementById("battle-display")!;
    }

    drawBattleDisplay(){
        /*
            <div></div>　味方のステータス
            <div><canvas></div> 敵の画像
            <div></div>　味方の行動　個々のみ操作可能

        */
        this.battleDiv.style.display="block";
    }
    removeBattleDisplay(){
        this.battleDiv.style.display="none";
    }
}


export class SceneManager{
    field: Field;
    battle: Battle;
    isFirstFieldDraw: boolean;
    constructor(){
        this.field = new Field();
        this.battle = new Battle();
        this.isFirstFieldDraw=true;
    }



    //バトル画面の表示
    changeToBattle(){
        this.battle.drawBattleDisplay();
    }

    //フィールドの削除
    removeField(){
        this.field.removeFeild();
    }

    //バトル画面の削除
    removeBattle(){
        this.battle.removeBattleDisplay();
    }

    //初期化（ロード）
    async drawInit(){
        await this.field.loadImage("mount01");
        await this.field.loadImage("map01");
        await this.field.loadImage("cave01");
        await this.field.loadImage("field01");
        await this.field.loadImage("boss");
        await this.field.loadImage("heal");
        console.log("IMAGE LOAD END");
    }

    //シーンの変更 バトルからフィールド（フィールド、洞窟）に移動、またはその逆。
    changeScene(new_scene_name: string){
        switch(new_scene_name){
            case "field":
                if(this.isFirstFieldDraw){ //画像ロードがあるため初回のみ
                    this.field.drawInit();
                    this.removeBattle();
                    this.field.drawField();
                    this.isFirstFieldDraw=false;
                }else{
                    this.field.drawField();
                    this.removeBattle();
                }
                break;
            case "village": //全滅時にここに来る
                this.field.drawVillage();
                this.removeBattle();
                break;
            case "cave":
                this.field.drawCave();
                this.removeBattle();
                break;
            case "battle":
                this.removeField();
                this.changeToBattle();
                break;
        }
       console.log("changeScene");
    }


    //フィールド上の遷移
    //フィールドの表示
    changeToField(){
        this.field.changeToField();
     }
    //村へ行く
    changeToVillage(){
        this.field.changetoVillage();
    }
    //洞窟へ行く
    changeToCave(){
        this.field.changeToCave();
    }
}


