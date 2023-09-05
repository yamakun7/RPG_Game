class Field {
    constructor() {
        //floor: number[];
        this.floor = new Array();
        this.blockSize = 64;
        this.boardRow = 30;
        this.boardCol = 30;
        for (let i = 0; i < this.boardRow; i++) {
            this.floor[i] = new Array();
            for (let j = 0; j < this.boardCol; j++) {
                this.floor[i][j] = 0;
            }
        }
    }
    drawFeild() {
        //Canvasの大きさを指定
        const canvasW = this.blockSize * this.boardCol;
        const canvasH = this.blockSize * this.boardRow;
        //canvasの登録
        const canvas = document.createElement("canvas");
        const parentCvs = document.getElementById("main-display");
        const ctx = canvas.getContext("2d");
        //canvasのwidthとheightを設定
        canvas.width = canvasW;
        canvas.height = canvasH;
        for (let i = 0; i < this.boardRow; i++) {
            this.floor[i] = [];
            for (let j = 0; j < this.boardCol; j++) {
                this.floor[i][j] = 0;
                ctx.fillStyle = "green";
                ctx.fillRect(i * this.blockSize, j * this.blockSize, this.blockSize, this.blockSize);
                ctx.strokeStyle = "blue";
                ctx.strokeRect(i * this.blockSize, j * this.blockSize, this.blockSize, this.blockSize);
            }
        }
        parentCvs.append(canvas);
    }
}
class Battle {
    constructor() {
    }
    drawBattleDisplay(battleDisplay) {
        /*
            <div></div>　味方のステータス
            <div><canvas></div> 敵の画像
            <div></div>　味方の行動　個々のみ操作可能

        */
        battleDisplay.style.display = "block";
    }
}
export class Scene {
    static changeToField() {
        let field = new Field();
        field.drawFeild();
    }
    static changeToBattle(battleDisplay) {
        let battle = new Battle();
        battle.drawBattleDisplay(battleDisplay);
    }
    static changeScene(new_scene_name) {
        const mainDisplay = document.getElementById("main-display");
        const battleDisplay = document.getElementById("battle-display");
        battleDisplay.style.display = "none";
        while (mainDisplay.firstChild) {
            mainDisplay.removeChild(mainDisplay.firstChild);
        }
        switch (new_scene_name) {
            case "field":
                Scene.changeToField();
                break;
            case "battle":
                Scene.changeToBattle(battleDisplay);
                break;
        }
        console.log("changeScene");
    }
}
