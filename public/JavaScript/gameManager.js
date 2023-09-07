var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SceneManager } from "./sceneManager.js";
import { fieldPlayer } from "./field.js";
import { Enemy, Player } from "./character.js";
import { enemyDataObject, enemyPatter } from "./Data/enemyData.js";
import { playerDataObject } from "./Data/playerData.js";
import { BattlePanelManager, BattleManager } from "./battleManager.js";
import { fieldMetaData, mapData } from "./config.js";
import { magicKind } from "./Data/specialAttackData.js";
import { musicManager } from "./musicManager.js";
const ereaA_Enemy = ["slime"];
const ereaB_Enemy = ["slime", "golem", "dark-king"];
const Boss_Enemy = ["dark-king"];
let sceneMng;
let panelMng;
let musicMng;
let ancientPlayersNameArr = []; //初期状態
let ancientEnemysNameArr = [];
let playersNameArr = []; //バトル中の生きてるプレイヤー
let enemysNameArr = []; //バトル中の生きてる敵
let players = {}; //バトル中のプレイヤー情報
let enemys = {}; //バトル中の敵情報
let isBattleFirst = true; //ゲーム開始後1回目のバトルかどうか
const swap = (array, idx1, idx2) => {
    let str = "";
    str = array[idx1];
    array[idx1] = array[idx2];
    array[idx2] = str;
};
//名前配列のname要素をliveNum番目に持ってくる。
const replaceArr = (array, name, liveNum) => {
    let flag = false;
    for (let i = 0; i < liveNum - 1; i++) {
        if (array[i] == name) {
            flag = true;
        }
        if (flag) {
            swap(array, i, i + 1);
        }
    }
    console.log(array);
};
function initProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        sceneMng = new SceneManager();
        yield sceneMng.drawInit();
        yield player.drawPlayerInit();
        fieldProcessInit();
    });
}
const gameInit = () => {
    //シーン遷移
    console.log("gameInit");
    console.log(playerDataObject);
    console.log(enemyDataObject);
    panelMng = new BattlePanelManager();
    musicMng = new musicManager();
    initProcess();
};
let player = new fieldPlayer(6, 5);
/*
------------------------------------------------------- ここからマップ上でのプログラム -----------------------------------------------
*/
//フィールドの処理を行う
const fieldProcessInit = () => {
    sceneMng.changeScene("field");
    //player.drawPlayerInit();
    player.drawPlayer(0, 1);
    player.eventInit();
    musicMng.createMusicBgm("fieldBgm.mp3");
    requestAnimationFrame(fieldProcess);
};
let intervalId = 0; //ヒールアニメーションのid
const moveToVillage = () => {
    player.nowPlace = "village"; //プレイヤーがいるシーンを村に変更
    player.removePlayer(); //今のプレイヤーの画像を削除
    player.setPlayerPositionAbsolute(14, 28); //プレイヤーのポジションを村の入り口に設定
    player.drawPlayer(3, 1); //村の入り口に上向きのプレイヤーの画像を表示
    sceneMng.changeToVillage(); //村を描画
    musicMng.createMusicBgm("villageBgm.mp3");
    intervalId = setInterval(healAnimation, 144);
};
//村に接触、または洞窟に接触した場合の処理
const gimmickPosition = () => {
    if (player.nowPlace == "field") { //今のいる場所がfieldの場合
        switch (mapData.map01[player.getPosY()][player.getPosX()]) {
            case 5: //Villageのタイルを踏んだ時　villageに遷移
            case 6:
                moveToVillage();
                break;
            case 7: //Caveタイルを踏んだ時　caveに遷移
                player.nowPlace = "cave";
                player.removePlayer();
                player.setPlayerPositionAbsolute(26, 28); //プレイヤーのポジションを洞窟の入り口に設定
                player.drawPlayer(3, 1);
                sceneMng.changeToCave();
                musicMng.createMusicBgm("caveBgm.mp3");
                break;
        }
        return true;
    }
    else if (player.nowPlace == "village") { //今いる場所がvillageの場合
        if (mapData.village01[player.getPosY()][player.getPosX()] == 9) { //9を踏んだらフィールドに遷移
            player.nowPlace = "field";
            player.removePlayer();
            player.setPlayerPositionAbsolute(6, 5);
            player.drawPlayer(0, 1);
            sceneMng.changeToField();
            musicMng.createMusicBgm("fieldBgm.mp3");
            walkCount = 0; //歩数カウントを０に戻す
            clearInterval(intervalId);
        }
        else if (mapData.village01[player.getPosY()][player.getPosX()] == 5) { //回復させる
            for (let i = 0; i < playersNameArr.length; i++) {
                players[playersNameArr[i]].hp = players[playersNameArr[i]].getMaxHp();
                players[playersNameArr[i]].mp = players[playersNameArr[i]].getMaxMp();
                players[playersNameArr[i]].isLive = true;
                localStorage.setItem(playersNameArr[i], JSON.stringify(players[playersNameArr[i]])); //セーブする
            }
        }
        return true;
    }
    else if (player.nowPlace == "cave") { //今いる場所がcaveの場合
        if (mapData.cave01[player.getPosY()][player.getPosX()] == 9) { //9を踏んだらフィールドに遷移
            player.nowPlace = "field";
            player.removePlayer();
            player.setPlayerPositionAbsolute(26, 24);
            player.drawPlayer(0, 1);
            sceneMng.changeToField();
            musicMng.createMusicBgm("fieldBgm.mp3");
            walkCount = 0; //歩数カウントを０に戻す
        }
        else if (mapData.cave01[player.getPosY()][player.getPosX()] == 4) { //ボス戦
            walkCount = 0;
            isBoss = true;
            cancel();
            BattleProcessInit();
        }
    }
    return false;
};
const healAnimation = () => {
    sceneMng.field.healAnimation();
    //requestAnimationFrame(healAnimation);
};
let press_key = "";
let move = -1;
let walkCount = 0;
const requestAnimationFrame = window.requestAnimationFrame;
const cancelAnimationFrame = window.cancelAnimationFrame;
let reqFieldProcessID;
const fieldProcess = () => {
    reqFieldProcessID = requestAnimationFrame(fieldProcess);
    console.log("field process");
    if (move == -1) {
        let offset_x = 0;
        let offset_y = 0;
        if (player.keyboardState.isKeydownUp) {
            offset_y -= 1;
            press_key = "up";
        }
        else if (player.keyboardState.isKeydownRight) {
            offset_x += 1;
            press_key = "right";
        }
        else if (player.keyboardState.isKeydownDown) {
            offset_y += 1;
            press_key = "down";
        }
        else if (player.keyboardState.isKeydownLeft) {
            offset_x -= 1;
            press_key = "left";
        }
        if (offset_x != 0 || offset_y != 0) {
            if (player.canPlayerMove(offset_x, offset_y)) { //移動できる場合
                move = 0;
                walkCount++;
                player.setPositionRelative(offset_x, offset_y);
            }
            else {
                console.log("cannot move the position");
            }
        }
    }
    else {
        move += 4;
        player.removePlayer();
        let direction = 0;
        switch (press_key) {
            case "up":
                player.move_y -= 4;
                direction = 3;
                break;
            case "right":
                player.move_x += 4;
                direction = 2;
                break;
            case "down":
                player.move_y += 4;
                direction = 0;
                break;
            case "left":
                player.move_x -= 4;
                direction = 1;
                break;
        }
        let col = move;
        if (col <= 8)
            col = 0;
        else if (col <= 16)
            col = 1;
        else if (col <= 24)
            col = 2;
        else
            col = 1;
        player.drawPlayer(direction, col);
        //移動ムーブの演出が終わった場合
        if (move == fieldMetaData["blockSize"]) {
            move = -1;
            gimmickPosition();
            if (walkCount >= 27 + Math.random() * 10 && player.nowPlace != "village") { //敵に遭遇
                walkCount = 0;
                BattleProcessInit(); //バトルに遷移
                //return;
                cancel();
            }
        }
    }
};
const cancel = () => {
    cancelAnimationFrame(reqFieldProcessID);
};
/*
---------------------------------------------------------- ここからバトルプログラム -------------------------------------------------
*/
//プレイヤーのステータスの色を変える。
const changeStatusColorPlayer = (player) => {
    if (player.getHp() == 0) {
        panelMng.changeStatusColor(player.getName(), "darkred");
    }
    else if (player.getHp() <= Math.floor(player.max_hp / 4)) {
        panelMng.changeStatusColor(player.getName(), "red");
    }
    else if (player.getHp() <= Math.floor(player.max_hp / 2)) {
        panelMng.changeStatusColor(player.getName(), "yellow");
    }
    else {
        panelMng.changeStatusColor(player.getName(), "white");
    }
};
//プレーヤーを作成する。
const createPlayerInit = (pObj, i) => {
    console.log("pObj.isLive: " + pObj.isLive);
    players[playersNameArr[i]] = new Player(pObj.name, pObj.Lv, pObj.experience_point, pObj.max_hp, pObj.hp, pObj.max_mp, pObj.mp, pObj.attack_power, pObj.magic_power, pObj.speed, pObj.jpName, pObj["isLive"], pObj.magicTable);
    panelMng.writePlayerStatus(pObj.name, pObj.jpName, pObj.max_hp, pObj.hp, pObj.max_mp, pObj.mp); //ステータスを作成
    changeStatusColorPlayer(players[playersNameArr[i]]); //ステータスの色を変更
};
//バトル全体の処理
const BattleProcessInit = () => {
    sceneMng.changeScene("battle");
    switch (player.nowPlace) {
        case "field":
            console.log("FIELD BATTLE");
            panelMng.SelectBackGround("field");
            musicMng.createMusicBgm("battleBgm01.mp3");
            break;
        case "cave":
            console.log("CAVE BATTLE");
            panelMng.SelectBackGround("cave");
            if (isBoss) {
                musicMng.createMusicBgm("battleBoss.mp3");
            }
            else {
                musicMng.createMusicBgm("battleBgm02.mp3");
            }
            break;
    }
    BattleProcess();
};
//引数はコマンドを収納する配列とコマンドの名前。
const attackCommandProcess = () => {
    commandInput.push("attack");
    panelMng.toTarget();
};
//魔法コマンドを作成する
const magicCommandProcess = () => {
    //魔法を覚えてなければ終了
    if (players[playersNameArr[commandCount]].magicTable.length == 0) {
        console.log("NOTHING");
        return;
    }
    panelMng.disableCommand(); //たたかう、まほう、逃げるのボタンを非有向化します。
    panelMng.createSparePanel(); //スペアパネルを作成する。
    for (let i = 0; i < players[playersNameArr[commandCount]].magicTable.length; i++) {
        let isAble = (players[playersNameArr[commandCount]].getMp() < magicKind[players[playersNameArr[commandCount]].magicTable[i]].spendMp);
        panelMng.createMagicButton(players[playersNameArr[commandCount]].magicTable[i], magicKind[players[playersNameArr[commandCount]].magicTable[i]].jpName, isAble);
    }
    panelMng.createReturnButton();
    for (let i = 0; i < panelMng.spareCommandButtons.length; i++) {
        panelMng.spareCommandButtons[i].addEventListener(("click"), () => {
            magicInput = panelMng.spareCommandButtons[i].getAttribute("id");
            panelMng.disableSparePanelAll();
            panelMng.toTarget();
        });
    }
    if (commandCount != commandInput.length) {
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        commandInput.push("magic");
    }
    panelMng.spareReturnButton.addEventListener("click", backToCommand);
};
//逃げるときの処理
const runAwayCommandProcess = () => {
    console.log("run-away");
    let runawayProbability = Math.floor(Math.random() * 100);
    if (runawayProbability > 50) { //成功
        removeEventListener("click", attackCommandProcess);
        removeEventListener("click", magicCommandProcess);
        panelMng.deletePlayerStatus(); //プレイヤーのステータスノードを削除
        panelMng.removeEnemyImageAll();
        panelMng.removeButtonAll();
        sceneMng.removeBattle();
        //プレイヤー情報をセーブ
        for (let i = 0; i < 4; i++) {
            localStorage.setItem(playersNameArr[i], JSON.stringify(players[playersNameArr[i]]));
        }
        sceneMng.changeScene(player.nowPlace);
        reqFieldProcessID = requestAnimationFrame(fieldProcess);
        musicMng.createMusicBgm("fieldBgm.mp3");
    }
    else { //失敗
        commandCount = livePlayers;
        while (battleMng.popBattleMove()) {
            console.log("pop");
        }
        for (let i = 0; i < liveEnemys; i++) {
            console.log("Random(): " + Math.floor(Math.random() * livePlayers));
            battleMng.createBattleMove("attack", enemysNameArr[i], playersNameArr[(Math.floor(Math.random() * livePlayers))], enemys[enemysNameArr[i]].attack_power, enemys[enemysNameArr[i]].speed, 0, false);
        }
        battleMng.sortBattleMove();
        battleMng.printStack();
        maxCommandCount = liveEnemys * 2;
        panelMng.changeToLog(); //ログ画面に切り替え
        //ここで～～の攻撃。の表示を出す。
        let e = new Event("click");
        panelMng.battleLogDiv.dispatchEvent(e);
    }
};
const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
const backToCommand = () => {
    console.log("backToCommand!!!!!!!!!!!!!!!!!!!!!");
    panelMng.deleteSparePanalAll();
    panelMng.buttonAbleAll(panelMng.commandList);
};
let commandInput = new Array(); //コマンドの押下履歴
let magicInput = "";
let commandCount = 0; //今のコマンドの数
let isBoss = false;
let battleMng = new BattleManager();
let livePlayers; //生きているプレイヤー数
let liveEnemys; //生きている敵の数
let isRunAway = false;
let maxCommandCount = 0;
let logCount = 0; //ログの回数
let endCommandCount = 0; //終了時のコマンド数。このコマンド数で表示を変える。
let nowMove; //今の行動
let isEnemyAppearLog = true;
const BattleProcess = () => {
    console.log("BattleProcess");
    let isFighting = true;
    //let panelMng: BattlePanelManager = new BattlePanelManager();
    logCount = 0;
    commandCount = 0;
    endCommandCount = 0;
    isEnemyAppearLog = true;
    isRunAway = false;
    console.log("log Count: : " + logCount);
    let pattern;
    //let pattern: string[] = enemyPatter.map01[Math.floor(Math.random()*4)]; //敵のパターンを作成
    if (isBoss) {
        pattern = enemyPatter["boss"][0];
    }
    else {
        pattern = enemyPatter[player.nowPlace][Math.floor(Math.random() * 4)]; //敵のパターンを作成
    }
    console.log(pattern);
    commandInput = new Array();
    ancientPlayersNameArr = Object.keys(playerDataObject); //もともとの順序の全員の仲間の名前。
    ancientEnemysNameArr = Object.keys(enemyDataObject);
    playersNameArr = ancientPlayersNameArr.concat(); //元のプレイヤー名の配列をコピー
    ancientEnemysNameArr = pattern.concat(); //エリアBの敵の名前の配列をコピー
    enemysNameArr = pattern.concat(); //エリアBの敵の名前の配列をコピー
    livePlayers = playersNameArr.length;
    liveEnemys = enemysNameArr.length;
    console.log("livePlayers: " + livePlayers + ", liveEnemys: " + liveEnemys);
    //キャラ製作
    if (isBattleFirst) {
        for (let i = 0; i < playersNameArr.length; i++) {
            createPlayerInit(playerDataObject[playersNameArr[i]], i);
        }
        isBattleFirst = false;
    }
    else {
        for (let i = 0; i < playersNameArr.length; i++) {
            createPlayerInit(JSON.parse(localStorage.getItem(playersNameArr[i])), i);
        }
    }
    //livesplayerを減らす
    let idx = 0;
    for (let i = 0; i < playersNameArr.length; i++) {
        if (players[playersNameArr[idx]].getHp() == 0) {
            replaceArr(playersNameArr, playersNameArr[idx], livePlayers); //playersNameArrのi番目が死んでいるならlivesPlayers番目に移動。
            livePlayers--;
        }
        else {
            idx++;
        }
    }
    //敵作成
    for (let i = 0; i < enemysNameArr.length; i++) {
        let pObj = enemyDataObject[enemysNameArr[i]];
        enemys[enemysNameArr[i]] = new Enemy(pObj.name, pObj.Lv, pObj.experience_point, pObj.max_hp, pObj.hp, pObj.max_mp, pObj.mp, pObj.attack_power, pObj.magic_power, pObj.speed, pObj.jpName, true, pObj.imgName, pObj.magicTable);
        panelMng.createEnemyImage(pObj.imgName);
        panelMng.createSelectEnemyButton(enemysNameArr[i], enemys[enemysNameArr[i]].jpName);
    }
    //最初のログ画面の作成
    if (enemysNameArr.length == 1) {
        panelMng.createLogText(enemys[enemysNameArr[0]].getJpName() + "があらわれた。");
    }
    else {
        panelMng.createLogText("まもののむれがあらわれた。");
    }
    //ログ画面に遷移
    panelMng.changeToLog();
    //コマンド入力
    //たたかう、まほう、逃げるボタンのそれぞれにイベントを設定する 
    panelMng.getCommandList().forEach((commandNode) => {
        console.log("consoleName: " + commandNode.name);
        switch (commandNode.name) {
            case "attack": //たたかう
                commandNode.addEventListener("click", attackCommandProcess);
                break;
            case "magic": //まほう
                commandNode.addEventListener("click", magicCommandProcess);
                break;
            case "run-away": //にげる
                commandNode.addEventListener("click", runAwayCommandProcess);
                break;
        }
    });
    //敵の選択
    //敵のボタンの数だけイベントリスナーを設定
    panelMng.getTargetList().forEach((targetNode) => {
        targetNode.addEventListener("click", () => {
            console.log("click target button");
            //console.log("target-enemy click: "+targetNode.getAttribute("name"));
            let commandName = commandInput.pop();
            switch (commandName) {
                case "attack":
                    console.log("commandCount: " + commandCount);
                    battleMng.createBattleMove(commandName, playersNameArr[commandCount], targetNode.getAttribute("name"), players[playersNameArr[commandCount]].attack_power, players[playersNameArr[commandCount]].speed, 0, true);
                    panelMng.toCommand(); //コマンド入力に移動
                    commandCount++;
                    break;
                case "magic":
                    console.log("MAGIC AREA");
                    console.log("magicInput: " + magicInput + ", magic: " + magicKind[magicInput]);
                    battleMng.createBattleMove(commandName, playersNameArr[commandCount], targetNode.getAttribute("name"), Math.floor(players[playersNameArr[commandCount]].getMagicPower() * magicKind[magicInput].power), players[playersNameArr[commandCount]].speed, magicKind[magicInput].spendMp, true);
                    panelMng.deleteSparePanalAll(); //呪文パネルを破棄
                    panelMng.toCommand(); //コマンド入力に移動
                    commandCount++;
                    break;
            }
            //全員の指示を出したら
            if (commandCount == livePlayers) {
                //たまったスタックを処理していく。
                //panelMng.createLogText("勇者のこうげき");
                //敵の行動を作成
                for (let i = 0; i < liveEnemys; i++) {
                    console.log("Random(): " + Math.floor(Math.random() * livePlayers));
                    battleMng.createBattleMove("attack", enemysNameArr[i], playersNameArr[(Math.floor(Math.random() * livePlayers))], enemys[enemysNameArr[i]].attack_power, enemys[enemysNameArr[i]].speed, 0, false);
                }
                battleMng.sortBattleMove();
                battleMng.printStack();
                maxCommandCount = (livePlayers + liveEnemys) * 2; //行動回数
                console.log("maxCommandCount: " + maxCommandCount);
                panelMng.changeToLog(); //ログ画面に切り替え
                //ここで～～の攻撃。の表示を出す。
                let e = new Event("click");
                panelMng.battleLogDiv.dispatchEvent(e);
            }
        });
    });
    //ログ画面をクリックしたら処理を進める。(現在はダメージ処理)
    panelMng.battleLogDiv.addEventListener("click", logClickProcess);
};
let isAbleClick = true;
//ログ画面クリックを処理する関数
function logClickProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isAbleClick)
            return;
        isAbleClick = false;
        console.log("click log panel");
        console.log("click log: " + logCount);
        if (isEnemyAppearLog) { //～～があらわれたのログをクリック
            console.log("enemy appear log click");
            isEnemyAppearLog = false;
            panelMng.changeToCommand();
            panelMng.toCommand();
        }
        else if (livePlayers == 0) { //生きているプレイヤーがいなくなったら
            //全滅時の処理
            if (endCommandCount == 0) {
                panelMng.createLogText(players[ancientPlayersNameArr[0]].getJpName() + "たちは死んでしまった。");
                panelMng.changeToLog();
                console.log("全滅");
            }
            else if (endCommandCount == 1) {
                removeEventListener("click", attackCommandProcess);
                removeEventListener("click", magicCommandProcess);
                panelMng.battleLogDiv.removeEventListener("click", logClickProcess);
                while (battleMng.popBattleMove()) {
                    console.log("pop");
                }
                //回復して復活場所を指定する
                for (let i = 0; i < ancientPlayersNameArr.length; i++) {
                    players[ancientPlayersNameArr[i]].hp = players[ancientPlayersNameArr[i]].getMaxHp();
                    players[ancientPlayersNameArr[i]].mp = players[ancientPlayersNameArr[i]].getMaxMp();
                    players[ancientPlayersNameArr[i]].isLive = true;
                    localStorage.setItem(ancientPlayersNameArr[i], JSON.stringify(players[ancientPlayersNameArr[i]]));
                }
                panelMng.deletePlayerStatus(); //プレイヤーのステータスノードを削除
                panelMng.removeEnemyImageAll();
                panelMng.removeButtonAll();
                sceneMng.removeBattle();
                moveToVillage();
                reqFieldProcessID = requestAnimationFrame(fieldProcess); //フィールドに遷移
                isBoss = false;
            }
            endCommandCount++;
        }
        else if (liveEnemys == 0) {
            //勝利
            if (endCommandCount == 0) {
                musicMng.createMusicBgm("stop");
                musicMng.playOneShot("victory.mp3");
                yield sleep(700);
                if (enemysNameArr.length == 1) { //敵が１体の場合
                    panelMng.createLogText(enemys[ancientEnemysNameArr[0]].getJpName() + "をたおした。");
                }
                else { //敵が複数体の場合
                    panelMng.createLogText("まもののむれをたおした。");
                }
                panelMng.changeToLog();
                console.log("勝利");
            }
            else if (endCommandCount == 1) {
                let totalEx = 0;
                for (let i = 0; i < enemysNameArr.length; i++) {
                    totalEx += enemys[enemysNameArr[i]].getExperiencePoint();
                }
                for (let i = 0; i < playersNameArr.length; i++) {
                    if (players[playersNameArr[i]].isLive)
                        players[playersNameArr[i]].addExPoint(totalEx);
                }
                panelMng.createLogText(players[playersNameArr[0]].getJpName() + "たちは" + totalEx + "pxの経験値をもらった。");
            }
            else if (endCommandCount == 2) {
                if (players[ancientPlayersNameArr[0]].isLevelUp()) {
                    players[ancientPlayersNameArr[0]].LevelUp();
                    panelMng.createLogText(players[ancientPlayersNameArr[0]].getJpName() + "は Lv." + players[ancientPlayersNameArr[0]].getLv() + " になった。");
                    endCommandCount--;
                }
                else if (players[ancientPlayersNameArr[1]].isLevelUp()) {
                    players[ancientPlayersNameArr[1]].LevelUp();
                    panelMng.createLogText(players[ancientPlayersNameArr[1]].getJpName() + "は Lv." + players[ancientPlayersNameArr[1]].getLv() + " になった。");
                    endCommandCount--;
                }
                else if (players[ancientPlayersNameArr[2]].isLevelUp()) {
                    players[ancientPlayersNameArr[2]].LevelUp();
                    panelMng.createLogText(players[ancientPlayersNameArr[2]].getJpName() + "は Lv." + players[ancientPlayersNameArr[2]].getLv() + " になった。");
                    endCommandCount--;
                }
                else if (players[ancientPlayersNameArr[3]].isLevelUp()) {
                    players[ancientPlayersNameArr[3]].LevelUp();
                    panelMng.createLogText(players[ancientPlayersNameArr[3]].getJpName() + "は Lv." + players[ancientPlayersNameArr[3]].getLv() + " になった。");
                    endCommandCount--;
                }
                else {
                    removeEventListener("click", attackCommandProcess);
                    removeEventListener("click", magicCommandProcess);
                    //プレイヤー情報をセーブ
                    for (let i = 0; i < 4; i++) {
                        localStorage.setItem(playersNameArr[i], JSON.stringify(players[playersNameArr[i]]));
                    }
                    console.log("nowplace: " + player.nowPlace);
                    if (isBoss) { //ボス戦で勝った時
                        console.log("BOSS CLEAR");
                        isBoss = false;
                        //sceneMng.changeScene(player.nowPlace);
                        sceneMng.removeBattle();
                        panelMng.deletePlayerStatus(); //プレイヤーのステータスノードを削除
                        reqFieldProcessID = requestAnimationFrame(fieldProcess); //フィールドに遷移
                        moveToVillage();
                    }
                    else { //通常の敵
                        console.log("ENEMY CLEAR");
                        sceneMng.changeScene(player.nowPlace);
                        panelMng.deletePlayerStatus(); //プレイヤーのステータスノードを削除
                        reqFieldProcessID = requestAnimationFrame(fieldProcess); //フィールドに遷移
                        switch (player.nowPlace) {
                            case "field":
                                musicMng.createMusicBgm("fieldBgm.mp3");
                                break;
                            case "cave":
                                musicMng.createMusicBgm("caveBgm.mp3");
                                break;
                        }
                    }
                    panelMng.battleLogDiv.removeEventListener("click", logClickProcess);
                    while (battleMng.popBattleMove()) {
                        console.log("pop");
                    }
                }
            }
            endCommandCount++;
        }
        else if (logCount >= maxCommandCount) { //全員の行動が終了したとき
            console.log("行動終了");
            battleMng.printStack();
            panelMng.changeToCommand();
            panelMng.toCommand();
            commandCount = 0;
            logCount = 0;
        }
        else if (logCount % 2 == 0) {
            console.log("battle move pop move");
            for (let i = 0; i < maxCommandCount; i++) {
                nowMove = battleMng.popBattleMove(); //ポップ
                if (nowMove === undefined)
                    break;
                let attackerName = nowMove.getActionPlayer();
                if (nowMove.isPlayer) { //行動者がプレイヤーの場合
                    if (!players[attackerName].getIsLive()) { //行動者が死んでいる場合
                        logCount += 2; //2を加算することで１人分飛ばせる
                        continue;
                    }
                    else { //行動者が生きている場合
                        panelMng.createLogText(players[nowMove.actionPlayer].getJpName() + " のこうげき！");
                        break;
                    }
                }
                else { //行動者が敵の場合
                    if (!enemys[attackerName].getIsLive()) {
                        logCount += 2;
                        continue;
                    }
                    else {
                        panelMng.createLogText(enemys[nowMove.actionPlayer].getJpName() + " のこうげき！");
                        break;
                    }
                }
            }
            logCount++;
        }
        else {
            console.log("attack Move");
            if (nowMove.isPlayer) { //プレイヤーの攻撃
                let targetName = nowMove.getTarget();
                let target = enemys[targetName];
                if (!target.getIsLive()) {
                    panelMng.createLogText(target.getJpName() + "は死んでいる。");
                }
                else {
                    switch (nowMove.getMoveName()) {
                        case "attack":
                            musicMng.playOneShot("attackSe01.mp3");
                            yield sleep(300);
                            break;
                        case "magic":
                            let playerName = nowMove.getActionPlayer();
                            musicMng.playOneShot("magicSe01.mp3");
                            yield sleep(300);
                            players[playerName].mp -= nowMove.spendMp; //MPを引く
                            panelMng.updatePlayerStatusMP(playerName, players[playerName].getMaxMp(), players[playerName].getMp());
                            break;
                    }
                    target.receiveDamage(nowMove.getPoint());
                    if (target.isDeath()) { //ターゲットを倒した
                        console.log(target.getJpName() + "は" + nowMove.getPoint() + "のダメージ。残りHP: " + target.getHp());
                        panelMng.createLogText(target.getJpName() + "は" + nowMove.getPoint() + "のダメージ。" + target.getJpName() + "はたおれた。");
                        panelMng.removeEnemyImage(target.getImgName());
                        panelMng.removeButton(target.getName());
                        replaceArr(enemysNameArr, targetName, liveEnemys);
                        liveEnemys--;
                        //logCount--;
                    }
                    else {
                        console.log(targetName + "は" + nowMove.getPoint() + "のダメージ。残りHP: " + target.getHp());
                        panelMng.createLogText(target.jpName + "は" + nowMove.getPoint() + "のダメージ。");
                    }
                }
            }
            else { //敵の攻撃
                let target = players[nowMove.getTarget()];
                if (!target.getIsLive()) { //攻撃対象が死んでいる場合
                    panelMng.createLogText(target.getJpName() + "は死んでいる。");
                }
                else { //攻撃対象が生きているとき
                    musicMng.playOneShot("attackSe02.mp3");
                    yield sleep(500);
                    target.receiveDamage(nowMove.getPoint()); //ダメージを受ける
                    changeStatusColorPlayer(target); //ステータスの枠の色を変更する関数
                    if (target.isDeath()) { //攻撃を受けた味方が死んだ場合
                        console.log(nowMove.getTarget() + "は" + nowMove.getPoint() + "のダメージ。残りHP: " + target.getHp());
                        panelMng.createLogText(players[nowMove.getTarget()].jpName + "は" + nowMove.getPoint() + "のダメージ。" + players[nowMove.getTarget()].jpName + "は死んでしまった。");
                        replaceArr(playersNameArr, nowMove.getTarget(), livePlayers);
                        livePlayers--;
                        // logCount--; //もう一回クリックできるように
                    }
                    else {
                        console.log(nowMove.getTarget() + "は" + nowMove.getPoint() + "のダメージ。残りHP: " + target.getHp());
                        panelMng.createLogText(players[nowMove.getTarget()].jpName + "は" + nowMove.getPoint() + "のダメージ。");
                    }
                    panelMng.updatePlayerStatusHp(nowMove.getTarget(), target.getMaxHp(), target.getHp());
                }
            }
            logCount++;
        }
        isAbleClick = true;
    });
}
;
gameInit();
