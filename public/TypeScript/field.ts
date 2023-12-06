import { fieldMetaData, mapData } from "./config.js";
import {Field, SceneManager} from "./sceneManager";

class keyboard{
    isKeydownUp: boolean;
    isKeydownRight: boolean;
    isKeydownDown: boolean;
    isKeydownLeft: boolean;
    constructor(){
        this.isKeydownUp=false;
        this.isKeydownRight=false;
        this.isKeydownDown=false;
        this.isKeydownLeft=false;
    }
}


//フィールドの操作するプレイヤーのクラス
/*
　・x軸の値
　・y軸の値
*/
export class fieldPlayer{
    //画像
    pos_x: number;
    pos_y: number;
    move_offset: number; //一回の移動の大きさ
    move_x: number; //この値がブロックサイズ分に達するまで移動させる
    move_y: number;
    nowPlace: string; 

    keyboardState: keyboard;
    playerImage: HTMLImageElement;
    playerCanvas: HTMLCanvasElement;
    playerCanvasCtx: CanvasRenderingContext2D;
    parentDiv: HTMLElement;
    constructor(pos_x: number, pos_y: number){
        this.pos_x=pos_x;
        this.pos_y=pos_y;
        this.move_offset=Math.floor(fieldMetaData["blockSize"]/8);
        this.move_x=fieldMetaData["blockSize"]*pos_x;
        this.move_y=fieldMetaData["blockSize"]*pos_y;
        this.nowPlace="field";

        this.keyboardState = new keyboard();
        this.playerImage = document.createElement("img")!;

        this.playerCanvas = document.createElement("canvas");
        this.playerCanvas.setAttribute("id", "player-canvas");
        this.playerCanvasCtx = this.playerCanvas.getContext("2d")!;
        this.parentDiv = document.getElementById("field-display")!;
        this.parentDiv.append(this.playerCanvas);
        this.playerCanvas.width=fieldMetaData["blockSize"] * fieldMetaData["boardCol"];
        this.playerCanvas.height=fieldMetaData["blockSize"] * fieldMetaData["boardRow"];
    }
    //初期処理。画像をロードしてイベントも登録
    drawPlayerInit(){
        return new Promise((resolve, reject)=>{
            this.playerImage.src="/Image/character/player_01.png"

            this.playerImage.onload=()=>{
                console.log("player load");
                resolve(true);
            }
            this.playerImage.onerror=()=>{
                console.log("player load error");
                reject(true);
            }
        })

        // this.playerImage.onload=()=>{
        //     let blockSize = fieldMetaData["blockSize"];
        //     this.playerCanvasCtx.drawImage(this.playerImage, 32, 0, 32, 32, this.pos_x * blockSize, this.pos_y * blockSize, 32, 32);
        //     console.log("onload image ENDDDD");
        // }
    }
    eventInit(){
        document.addEventListener("keydown",(event)=>{
            console.log("keydown: "+event.key);
            switch(event.key){
                case "ArrowUp":
                case "w":
                    this.keyboardState.isKeydownUp=true;
                    break;
                case "ArrowRight":
                case "d":
                    this.keyboardState.isKeydownRight=true;
                    break;
                case "ArrowDown":
                case "s":
                    this.keyboardState.isKeydownDown=true;
                    break;
                case "ArrowLeft":
                case "a":
                    this.keyboardState.isKeydownLeft=true;
                    break;
                default:
                    console.log(event.key); 
            }
        })
        document.addEventListener("keyup",(event)=>{
            console.log("keyup: "+event.key);
            switch(event.key){
                case "ArrowUp":
                case "w":
                    this.keyboardState.isKeydownUp=false;
                    break;
                case "ArrowRight":
                case "d":
                    this.keyboardState.isKeydownRight=false;
                    break;
                case "ArrowDown":
                case "s":
                    this.keyboardState.isKeydownDown=false;
                    break;
                case "ArrowLeft":
                case "a":
                    this.keyboardState.isKeydownLeft=false;
                    break;
                default:
                    console.log(event.key); 
            }
        })
    }
    //今の位置のプレイヤーの画像を消す
    //通れるタイルの時はtrue, 通れないタイルの時はfalseを返す
    canPlayerMove(offset_x: number, offset_y: number):boolean {
        if(this.nowPlace=="field"){
            let pos=mapData.map01[this.pos_y+offset_y][this.pos_x+offset_x];
            if(pos==1 || pos==5 || pos==6 || pos==7) return true; //通れるタイル
            //else if(mapData.map01[this.pos_y+offset_y][this.pos_x+ offset_x]==1) return true;
            return false
        }else if(this.nowPlace=="village"){
            let pos=mapData.village01[this.pos_y+offset_y][this.pos_x+offset_x];
            if(pos==1 || pos==5 || pos==9)
                return true;
            return false;
        }else if(this.nowPlace=="cave"){
            if(mapData.cave01[this.pos_y+offset_y][this.pos_x+offset_x]==1 || mapData.cave01[this.pos_y+offset_y][this.pos_x+offset_x]==4 || mapData.cave01[this.pos_y+offset_y][this.pos_x+offset_x]==9)
                return true;
            return false;
        } 
        return false;

    }
    removePlayer(){
        let blockSize = fieldMetaData["blockData"];
        this.playerCanvasCtx.clearRect(this.move_x, this.move_y, fieldMetaData["blockSize"], fieldMetaData["blockSize"]);
    }

    //今の位置のプレイヤーの画像を表示
    //引数: rowはどの向きの画像を表示させるか、colは歩く様子
    drawPlayer(row: number, col: number){
        let blockSize = fieldMetaData["blockSize"];
        this.playerCanvasCtx.drawImage(this.playerImage, col*blockSize, row*blockSize, blockSize, blockSize, this.move_x, this.move_y, fieldMetaData["blockSize"], fieldMetaData["blockSize"]);
    }


    
    moveUp(){
        this.pos_y--;
    }
    moveDown(){
        this.pos_y++;
    }
    moveRight(){
        this.pos_x++;
    }
    moveLeft(){
        this.pos_x--;
    }
    setPositionRelative(offset_x: number, offset_y: number){
        this.pos_x+=offset_x;
        this.pos_y+=offset_y;
    }
    setPlayerPositionAbsolute(pos_x: number, pos_y: number){
        this.pos_x=pos_x;
        this.pos_y=pos_y;
        this.move_x = pos_x*fieldMetaData["blockSize"];
        this.move_y = pos_y*fieldMetaData["blockSize"];
    }

    getPosX(): number{
        return this.pos_x;
    }
    getPosY(): number{
        return this.pos_y;
    }

}

