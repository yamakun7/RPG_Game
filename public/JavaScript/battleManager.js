export class BattlePanelManager {
    constructor() {
        //たたかうパネルと敵のパネルを非表示にしてログパネルを表示する。
        this.changeToLog = () => {
            this.panelDisable(this.battleCommandDiv);
            this.panelAble(this.battleLogDiv);
        };
        this.changeToCommand = () => {
            this.panelDisable(this.battleLogDiv);
            this.panelAble(this.battleCommandDiv);
        };
        this.battleDisplay = document.getElementById("battle-display");
        this.playerStatusDiv = document.getElementById("players-status");
        this.enemyPanelDiv = document.getElementById("enemy-panel");
        this.commandPanel = document.getElementById("command-panel");
        this.battleCommandDiv = document.getElementById("battle-command");
        this.battleLogDiv = document.getElementById("battle-log");
        this.spareCommandDiv = document.createElement("div");
        this.spareCommandButtons = [];
        this.selectEnemyBox = document.getElementById("select-enemy-box");
        this.commandList = this.battleCommandDiv.querySelectorAll(".command");
        //  this.targetList = this.battleCommandDiv.querySelectorAll(".target-enemy")!;
        this.targetList = [];
        this.logText = document.getElementById("log-text");
    }
    //バトル時の背景を選択
    SelectBackGround(place) {
        this.battleDisplay.classList.remove("battle-back-ground1", "battle-back-ground2");
        switch (place) {
            case "field":
                this.battleDisplay.classList.add("battle-back-ground1");
                break;
            case "cave":
                this.battleDisplay.classList.add("battle-back-ground2");
                break;
        }
    }
    //プレイヤーのステータスを表示
    writePlayerStatus(name, jpName, maxHp, hp, maxMp, mp) {
        let div = document.createElement("div");
        let playerName = document.createElement("h2");
        let playerHp = document.createElement("h3");
        let playerMp = document.createElement("h3");
        div.setAttribute("id", name);
        div.classList.add("col-3", "status-box-white");
        playerName.innerText = jpName;
        playerHp.innerText = "HP: " + hp.toString() + "/" + maxHp.toString();
        playerHp.setAttribute("id", "hp-" + name);
        playerMp.innerText = "MP: " + mp.toString() + "/" + maxMp.toString();
        playerMp.setAttribute("id", "mp-" + name);
        div.append(playerName);
        div.append(playerHp);
        div.append(playerMp);
        this.playerStatusDiv.append(div);
    }
    //プレイヤーステータス削除
    deletePlayerStatus() {
        while (this.playerStatusDiv.firstChild) {
            this.playerStatusDiv.removeChild(this.playerStatusDiv.firstChild);
        }
    }
    //プレイヤーのHPのステータスを更新
    updatePlayerStatusHp(name, max_hp, hp) {
        let playerHp = document.getElementById("hp-" + name);
        playerHp.innerText = "HP: " + hp.toString() + "/" + max_hp.toString();
    }
    //プレイヤーのMPのステータスを更新
    updatePlayerStatusMP(name, max_mp, mp) {
        let playerMp = document.getElementById("mp-" + name);
        playerMp.innerText = "MP: " + mp.toString() + "/" + max_mp.toString();
    }
    //変更したいキャラの名前、色はwhiteかyellowかred
    changeStatusColor(name, color) {
        let div = document.getElementById(name);
        div.classList.remove("status-box-white", "status-color-yellow", "status-box-red", "status-box-darkred");
        div.classList.add("status-box-" + color);
    }
    //敵の画像を作成して配置する。
    createEnemyImage(imgName) {
        let div = document.createElement("div");
        let img = document.createElement("img");
        div.setAttribute("id", "img-" + imgName.substring(0, imgName.indexOf(".")));
        div.classList.add("col-3", "enemy-img");
        img.src = "Image/character/" + imgName;
        img.alt = imgName;
        img.width = 250;
        img.height = 250;
        div.append(img);
        this.enemyPanelDiv.append(div);
    }
    //指定した敵の画像を削除する
    removeEnemyImage(imgName) {
        let div = document.getElementById("img-" + imgName.substring(0, imgName.indexOf(".")));
        this.enemyPanelDiv.removeChild(div);
    }
    //敵の画像をすべて破棄
    removeEnemyImageAll() {
        while (this.enemyPanelDiv.firstChild) {
            this.enemyPanelDiv.removeChild(this.enemyPanelDiv.firstChild);
        }
    }
    getCommandList() {
        return this.commandList;
    }
    getTargetList() {
        return this.targetList;
    }
    panelAble(div) {
        div.style.display = "block";
    }
    ;
    panelDisable(div) {
        div.style.display = "none";
    }
    ;
    //すべてのボタンを表示
    buttonAbleAll(list) {
        list.forEach((btn) => {
            btn.removeAttribute("disabled");
        });
    }
    ;
    //すべてのボタンを選択不可能
    buttonDisableAll(list) {
        list.forEach((btn) => {
            btn.setAttribute("disabled", "true");
        });
    }
    ;
    //指定した敵ボタンを削除
    removeButton(enemyName) {
        console.log("enemyName: " + enemyName);
        let div = document.getElementById(enemyName);
        this.selectEnemyBox.removeChild(div);
    }
    //すべての敵ボタンを削除
    removeButtonAll() {
        while (this.selectEnemyBox.firstChild) {
            this.selectEnemyBox.removeChild(this.selectEnemyBox.firstChild);
        }
    }
    //たたかう選択肢を表示して敵のボタンを非選択にする
    toCommand() {
        this.buttonAbleAll(this.commandList);
        this.buttonDisableAll(this.targetList);
    }
    //敵のボタンの選択肢を有効にしてたたかう選択肢を非選択にする
    toTarget() {
        this.buttonAbleAll(this.targetList);
        this.buttonDisableAll(this.commandList);
    }
    //コマンドの未選択不可能にする
    disableCommand() {
        this.buttonDisableAll(this.commandList);
    }
    createLogText(text) {
        this.logText.innerText = text;
    }
    //呪文のパネルを作成
    createSparePanel() {
        this.spareCommandDiv = document.createElement("div");
        this.spareCommandDiv.classList.add("col-4", "box", "d-flex", "justify-content-around", "flex-column", "align-items-end");
        this.commandPanel.insertBefore(this.spareCommandDiv, this.selectEnemyBox);
    }
    //呪文のボタン作成
    createMagicButton(name, jpName, isAble) {
        let btn = document.createElement("button");
        btn.setAttribute("id", name);
        btn.classList.add("spare-command");
        btn.innerText = jpName;
        if (isAble)
            btn.disabled = true;
        this.spareCommandDiv.append(btn);
        this.spareCommandButtons.push(btn);
    }
    disableMagicButton() {
    }
    disableSparePanelAll() {
        this.buttonDisableAll(this.spareCommandButtons);
    }
    //呪文のパネルとボタンを全部削除
    deleteSparePanalAll() {
        while (this.spareCommandDiv.firstChild) {
            this.spareCommandDiv.removeChild(this.spareCommandDiv.firstChild);
            this.spareCommandButtons.pop();
        }
        this.spareCommandDiv.remove();
    }
    //敵のボタンを作成できる。
    createSelectEnemyButton(enemyName, enemyJpName) {
        let div = document.createElement("div");
        let btn = document.createElement("button");
        div.setAttribute("id", enemyName); //同じ名前のモンスターが来ない前提
        btn.classList.add("target-enemy");
        btn.setAttribute("name", enemyName);
        btn.innerHTML = enemyJpName;
        div.append(btn);
        this.selectEnemyBox.append(div);
        console.log("div: " + div);
        this.targetList.push(btn);
    }
}
//バトル時のキャラクターの行動のクラス
export class BattleMove {
    constructor(moveName, actionPlayer, target, point, priority, spendMp, isPlayer) {
        this.moveName = moveName;
        this.actionPlayer = actionPlayer;
        this.target = target;
        this.point = point;
        this.priority = priority;
        this.spendMp = spendMp;
        this.isPlayer = isPlayer;
    }
    getMoveName() {
        return this.moveName;
    }
    getActionPlayer() {
        return this.actionPlayer;
    }
    getTarget() {
        return this.target;
    }
    getPoint() {
        return this.point;
    }
    getPriority() {
        return this.priority;
    }
}
//バトルを管理する
export class BattleManager {
    constructor() {
        this.battleMoveStack = [];
    }
    //テスト
    printStack() {
        this.battleMoveStack.forEach((obj) => {
            console.log("moveName: " + obj.moveName + ", actionPlayer: " + obj.actionPlayer + ", target: " + obj.target + ", power: " + obj.point + ", priority: " + obj.priority + ", spendMp: " + obj.spendMp + ", isPlayer: " + obj.isPlayer);
        });
    }
    //行動をスタックに積む
    pushBattleMove(battleMove) {
        this.battleMoveStack.push(battleMove);
    }
    //遅い順に並べて
    sortBattleMove() {
        this.battleMoveStack.sort((a, b) => a.getPriority() - b.getPriority()); //昇順
    }
    //popしていく
    popBattleMove() {
        return this.battleMoveStack.pop();
    }
    //行動を作る
    createBattleMove(moveName, actionPlayer, target, point, priority, spendMp, isPlayer) {
        let battleMove = new BattleMove(moveName, actionPlayer, target, point, priority, spendMp, isPlayer);
        this.pushBattleMove(battleMove);
        return battleMove;
    }
}
