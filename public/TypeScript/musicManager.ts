export class musicManager{
    musicDiv: HTMLElement;
    bgm: HTMLAudioElement
    //bgm: {[key: string]: string};
    se: {[key: string]: string};
    
    /*
        Audio() コンストラクターを使用して作成されたオーディオ要素へのすべての参照が削除された場合に、再生が現在進行中の場合、要素自体は JavaScript ランタイムのガベージ コレクション メカニズムによってメモリから削除されません。
        代わりに、オーディオは再生を続け、オブジェクトは再生が終了するか pause() の呼び出しなどで一時停止されるまでメモリに残ります（再生が終了するか一時停止すると、オブジェクトはガベージコレクションの対象となります）。
    */
    audio: HTMLAudioElement;
    constructor(){
        this.musicDiv = document.getElementById("music-div")!;
        this.bgm=document.createElement("audio");
        //this.bgm.loop=true;
        this.musicDiv.append(this.bgm);
        this.se={};
        this.audio=new Audio();
    }

    createMusicBgm(str: string){
        //let audio: HTMLAudioElement = document.createElement("audio");
        //this.bgm.src="/Music/BGM/"+str;
        if(this.audio) this.audio.pause();
        if(str=="stop") return;
        this.audio = new Audio("/Music/BGM/"+str);
        this.audio.loop=true;
        this.audio.volume=0.04;
        this.audio.play();
    }

    playOneShot(str: string){
        let se: HTMLAudioElement = new Audio("/Music/SE/"+str);
        se.volume=0.1;
        if(str=="victory.mp3") se.volume=0.04;
        se.play();
    }

    deleteMusic(str: string){
        this.musicDiv.removeChild(this.musicDiv.getElementsByClassName(str).item(0)!);
    }
}