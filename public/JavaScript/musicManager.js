export class musicManager {
    constructor() {
        this.musicDiv = document.getElementById("music-div");
        this.bgm = document.createElement("audio");
        //this.bgm.loop=true;
        this.musicDiv.append(this.bgm);
        this.se = {};
        this.audio = new Audio();
    }
    createMusicBgm(str) {
        //let audio: HTMLAudioElement = document.createElement("audio");
        //this.bgm.src="/Music/BGM/"+str;
        if (this.audio)
            this.audio.pause();
        if (str == "stop")
            return;
        this.audio = new Audio("/Music/BGM/" + str);
        this.audio.loop = true;
        this.audio.volume = 0.04;
        this.audio.play();
    }
    playOneShot(str) {
        let se = new Audio("/Music/SE/" + str);
        se.volume = 0.1;
        if (str == "victory.mp3")
            se.volume = 0.04;
        se.play();
    }
    deleteMusic(str) {
        this.musicDiv.removeChild(this.musicDiv.getElementsByClassName(str).item(0));
    }
}
