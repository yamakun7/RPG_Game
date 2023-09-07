
export class BattlePanelManager{
    battleDisplay: HTMLElement;

    playerStatusDiv: HTMLElement; //ステータスの親

    enemyPanelDiv: HTMLElement; //敵の画像の親

    commandPanel: HTMLElement;

    battleCommandDiv: HTMLElement; //バトルコマンドの親
    battleLogDiv: HTMLElement; //バトルログの親

    spareCommandDiv: HTMLElement; //呪文パネル
    spareCommandButtons: HTMLButtonElement[]; //呪文ボタン

    selectEnemyBox: HTMLElement; //敵ボタンの背景
    commandList: NodeListOf<HTMLButtonElement>; //行動のリスト
    //targetList: NodeListOf<HTMLButtonElement>;
    targetList: HTMLButtonElement[]; //敵ボタンを格納する配列
    logText: HTMLElement; //ログに出現するテキストの要素
    constructor(){
        this.battleDisplay = document.getElementById("battle-display")!;
        this.playerStatusDiv = document.getElementById("players-status")!;
        this.enemyPanelDiv = document.getElementById("enemy-panel")!;
        this.commandPanel = document.getElementById("command-panel")!;
        this.battleCommandDiv = document.getElementById("battle-command")!;
        this.battleLogDiv = document.getElementById("battle-log")!;

        this.spareCommandDiv = document.createElement("div");
        this.spareCommandButtons = [];

        this.selectEnemyBox  = document.getElementById("select-enemy-box")!;
        this.commandList = this.battleCommandDiv.querySelectorAll(".command")!;
      //  this.targetList = this.battleCommandDiv.querySelectorAll(".target-enemy")!;
        this.targetList=[];
        this.logText= document.getElementById("log-text")!;
    }

    //バトル時の背景を選択
    SelectBackGround(place: string){
        this.battleDisplay.classList.remove("battle-back-ground1", "battle-back-ground2");
        switch(place){
            case "field":
                this.battleDisplay.classList.add("battle-back-ground1");
                break;
            case "cave":
                this.battleDisplay.classList.add("battle-back-ground2");
                break;
        }
    }

    //プレイヤーのステータスを表示
    writePlayerStatus(name: string, jpName: string, maxHp: number, hp: number, maxMp: number, mp: number){
        let div: HTMLDivElement = document.createElement("div");
        let playerName: HTMLHeadingElement = document.createElement("h2");
        let playerHp: HTMLHeadingElement = document.createElement("h3");
        let playerMp: HTMLHeadingElement = document.createElement("h3");
        div.setAttribute("id", name);
        div.classList.add("col-3", "status-box-white");
        playerName.innerText=jpName;
        playerHp.innerText = "HP: "+hp.toString()+"/"+maxHp.toString();
        playerHp.setAttribute("id", "hp-"+name);
        playerMp.innerText = "MP: "+mp.toString()+"/"+maxMp.toString();
        playerMp.setAttribute("id", "mp-"+name);
        div.append(playerName);
        div.append(playerHp);
        div.append(playerMp);
        this.playerStatusDiv.append(div);
    }

    //プレイヤーステータス削除
    deletePlayerStatus(){
        while(this.playerStatusDiv.firstChild){
            this.playerStatusDiv.removeChild(this.playerStatusDiv.firstChild);
        }
    }

    //プレイヤーのHPのステータスを更新
    updatePlayerStatusHp(name: string, max_hp: number, hp: number){
        let playerHp :HTMLElement = document.getElementById("hp-"+name)!;
        playerHp.innerText="HP: "+hp.toString()+"/"+max_hp.toString();
    }

    //プレイヤーのMPのステータスを更新
    updatePlayerStatusMP(name: string, max_mp: number, mp: number){
        let playerMp :HTMLElement = document.getElementById("mp-"+name)!;
        playerMp.innerText="MP: "+mp.toString()+"/"+max_mp.toString();
    }

    //変更したいキャラの名前、色はwhiteかyellowかred
    changeStatusColor(name: string, color: string){
        let div: HTMLElement = document.getElementById(name)!;
        div.classList.remove("status-box-white", "status-color-yellow", "status-box-red", "status-box-darkred");
        div.classList.add("status-box-"+color);
    }

    //敵の画像を作成して配置する。
    createEnemyImage(imgName: string){
        let div: HTMLDivElement = document.createElement("div");
        let img: HTMLImageElement = document.createElement("img");
        div.setAttribute("id", "img-"+imgName.substring(0,imgName.indexOf(".")));
        div.classList.add("col-3", "enemy-img");
        img.src = "Image/character/"+imgName;
        img.alt=imgName;
        img.width=250;
        img.height=250;
        div.append(img);
        this.enemyPanelDiv.append(div);
    }
    //指定した敵の画像を削除する
    removeEnemyImage(imgName: string){
        let div: HTMLElement = document.getElementById("img-"+imgName.substring(0, imgName.indexOf(".")))!;
        this.enemyPanelDiv.removeChild(div);
    }

    //敵の画像をすべて破棄
    removeEnemyImageAll(){
        while(this.enemyPanelDiv.firstChild){
            this.enemyPanelDiv.removeChild(this.enemyPanelDiv.firstChild);
        }
    }

    getCommandList(): NodeListOf<HTMLButtonElement>{
        return this.commandList;
    }
    
    getTargetList(): HTMLButtonElement[]{
        return this.targetList;
    }

    panelAble(div: HTMLElement){
        div.style.display="block";
    };
    panelDisable(div: HTMLElement){
        div.style.display="none";
    };
    
    //すべてのボタンを表示
    buttonAbleAll(list: NodeListOf<HTMLButtonElement>|HTMLButtonElement[]){
        list.forEach((btn)=>{
            btn.removeAttribute("disabled");
        });
    };
    //すべてのボタンを選択不可能
    buttonDisableAll(list: NodeListOf<HTMLButtonElement> | HTMLButtonElement[]){
        list.forEach((btn)=>{
            btn.setAttribute("disabled", "true");
        });
    };
    
    //指定した敵ボタンを削除
    removeButton(enemyName: string){
        console.log("enemyName: "+enemyName);
        let div: HTMLElement = document.getElementById(enemyName)!;
        this.selectEnemyBox.removeChild(div);
    }
    //すべての敵ボタンを削除
    removeButtonAll(){
        while(this.selectEnemyBox.firstChild){
            this.selectEnemyBox.removeChild(this.selectEnemyBox.firstChild);
        }
    }


    //たたかう選択肢を表示して敵のボタンを非選択にする
    toCommand(){
        this.buttonAbleAll(this.commandList);
        this.buttonDisableAll(this.targetList);
    }
    //敵のボタンの選択肢を有効にしてたたかう選択肢を非選択にする
    toTarget(){
        this.buttonAbleAll(this.targetList);
        this.buttonDisableAll(this.commandList);
    }

    //コマンドの未選択不可能にする
    disableCommand(){
        this.buttonDisableAll(this.commandList);
    }
    //たたかうパネルと敵のパネルを非表示にしてログパネルを表示する。
    changeToLog=()=>{
        this.panelDisable(this.battleCommandDiv);
        this.panelAble(this.battleLogDiv);
    }
    changeToCommand=()=>{
        this.panelDisable(this.battleLogDiv);
        this.panelAble(this.battleCommandDiv);
    }
    

    createLogText(text: string){
        this.logText.innerText=text;
    }

    //呪文のパネルを作成
    createSparePanel(){
        this.spareCommandDiv = document.createElement("div");
        this.spareCommandDiv.classList.add("col-4", "box", "d-flex", "justify-content-around", "flex-column", "align-items-end");
        this.commandPanel.insertBefore(this.spareCommandDiv, this.selectEnemyBox);
    }
    
    //呪文のボタン作成
    createMagicButton(name: string ,jpName: string, isAble: boolean){
        let btn: HTMLButtonElement = document.createElement("button");
        btn.setAttribute("id", name);
        btn.classList.add("spare-command");
        btn.innerText=jpName;
        if(isAble) btn.disabled=true;
        this.spareCommandDiv.append(btn);
        this.spareCommandButtons.push(btn);
    }

    disableMagicButton(){
    }
    disableSparePanelAll(){
        this.buttonDisableAll(this.spareCommandButtons);
    }

    //呪文のパネルとボタンを全部削除
    deleteSparePanalAll(){
        while(this.spareCommandDiv.firstChild){
            this.spareCommandDiv.removeChild(this.spareCommandDiv.firstChild);
            this.spareCommandButtons.pop();
        }
        this.spareCommandDiv.remove();
    }

    //敵のボタンを作成できる。
    createSelectEnemyButton(enemyName: string, enemyJpName: string){
        let div: HTMLElement = document.createElement("div");
        let btn: HTMLButtonElement = document.createElement("button");
        div.setAttribute("id", enemyName); //同じ名前のモンスターが来ない前提
        btn.classList.add("target-enemy");
        btn.setAttribute("name", enemyName);
        btn.innerHTML=enemyJpName;
        div.append(btn);
        this.selectEnemyBox.append(div);
        console.log("div: "+div);
        this.targetList.push(btn);
    }
}


//バトル時のキャラクターの行動のクラス
export class BattleMove{
    moveName: string;
    actionPlayer: string;
    target: string;
    point: number;
    priority: number;
    spendMp: number;
    isPlayer: boolean;
    constructor(moveName: string, actionPlayer:string, target: string, point: number, priority: number, spendMp: number, isPlayer: boolean){
        this.moveName=moveName;
        this.actionPlayer=actionPlayer;
        this.target=target;
        this.point=point;
        this.priority=priority;
        this.spendMp=spendMp;
        this.isPlayer=isPlayer;
    }

    getMoveName(): string{ 
        return this.moveName;
    }
    getActionPlayer(): string{
        return this.actionPlayer;
    }
    getTarget(): string{
        return this.target;
    }
    getPoint(): number{
        return this.point;
    }
    getPriority(): number{
        return this.priority;
    }
}

//バトルを管理する
export class BattleManager{
    battleMoveStack: BattleMove[];
    constructor(){
        this.battleMoveStack=[];
    }

    //テスト
    printStack(){
        this.battleMoveStack.forEach((obj)=>{
            console.log("moveName: "+obj.moveName+", actionPlayer: "+obj.actionPlayer+", target: "+obj.target+", power: "+obj.point+ ", priority: "+obj.priority+", spendMp: "+obj.spendMp+", isPlayer: "+obj.isPlayer);
        })
    }

    //行動をスタックに積む
    pushBattleMove(battleMove: BattleMove){
        this.battleMoveStack.push(battleMove);
    }
    //遅い順に並べて
    sortBattleMove(){
        this.battleMoveStack.sort((a,b)=>a.getPriority()-b.getPriority()); //昇順
    }
    //popしていく
    popBattleMove(): BattleMove{
        return this.battleMoveStack.pop()!;
    }

    //行動を作る
    createBattleMove(moveName: string, actionPlayer: string, target: string, point: number, priority: number, spendMp: number, isPlayer: boolean){
        let battleMove: BattleMove = new BattleMove(moveName, actionPlayer, target, point, priority, spendMp, isPlayer);
        this.pushBattleMove(battleMove);
        return battleMove;
    }
    //中に入れる値は、キャラクターの名前と行動の種類とポイント。
    //キーはスピード



}

