export const enemyDataObject: {[key: string]:Object} = {
    "slime":{
        "name": "slime",
        "Lv": 3,
        "experience_point": 50,
        "max_hp": 5,
        "hp": 5,
        "max_mp": 3,
        "mp": 3,
        "attack_power": 4,
        "magic_power": 2,
        "speed": 50,
        "jpName": "スライム",
        "isLive": true,
        "imgName": "DQ_Slime.png",
        "magicTable":[]
    },
    "golem":{
        "name": "golem",
        "Lv": 10,
        "experience_point": 150,
        "max_hp": 100,
        "hp": 30,
        "max_mp": 3,
        "mp": 30,
        "attack_power": 13,
        "magic_power": 10,
        "speed": 30,
        "jpName": "トン",
        "isLive": true,
        "imgName": "DQ_Golem.png",
        "magicTable":[]
    },
    "gigantes":{
        "name": "gigantes",
        "Lv": 10,
        "experience_point": 80,
        "max_hp": 1,
        "hp": 1,
        "max_mp": 3,
        "mp": 30,
        "attack_power": 5,
        "magic_power": 10,
        "speed": 150,
        "jpName": "ギガンテス",
        "isLive": true,
        "imgName": "DQ_Slime.jpg",
        "magicTable":[]
    },

    "dark-king":{
        "name": "dark-king",
        "Lv": 30,
        "experience_point": 500,
        "max_hp": 60,
        "hp": 60,
        "max_mp": 3,
        "mp": 400,
        "attack_power": 30,
        "magic_power": 70,
        "speed": 100,
        "jpName": "化ツリー",
        "isLive": true,
        "imgName": "DQ_Mao.png",
        "magicTable":["melami"]
    },

    //ぽけもん
    "pikachu":{
        "name": "pikachu",
        "Lv": 10,
        "experience_point": 200,
        "max_hp": 140,
        "hp": 140,
        "max_mp": 100,
        "mp": 100,
        "attack_power": 20,
        "magic_power": 20,
        "speed": 40,
        "jpName": "ボーン",
        "isLive": true,
        "imgName": "bone.png",
        "magicTable":["melami"]
    },
    "genger":{
        "name": "genger",
        "Lv": 14,
        "experience_point": 300,
        "max_hp": 100,
        "hp": 100,
        "max_mp": 160,
        "mp": 160,
        "attack_power": 20,
        "magic_power": 30,
        "speed": 50,
        "jpName": "ロボット",
        "isLive": true,
        "imgName": "robot.png",
        "magicTable":["melami"]
    },
    "sheimi":{
        "name": "sheimi",
        "Lv": 10,
        "experience_point": 200,
        "max_hp": 80,
        "hp": 80,
        "max_mp": 100,
        "mp": 100,
        "attack_power": 16,
        "magic_power": 20,
        "speed": 40,
        "jpName": "デビル",
        "isLive": true,
        "imgName": "debiru.png",
        "magicTable":["melami"]
    },
    "rizerdon":{
        "name": "rizerdon",
        "Lv": 25,
        "experience_point": 800,
        "max_hp": 150,
        "hp": 150,
        "max_mp": 300,
        "mp": 300,
        "attack_power": 22,
        "magic_power": 70,
        "speed": 60,
        "jpName": "ドラゴン",
        "isLive": true,
        "imgName": "Rizerdman.png",
        "magicTable":["melami"]
    },
    "myutwo":{
        "name": "myutwo",
        "Lv": 35,
        "experience_point": 2000,
        "max_hp": 1000,
        "hp": 1000,
        "max_mp": 1000,
        "mp": 1000,
        "attack_power": 89,
        "magic_power": 70,
        "speed": 100,
        "jpName": "魔王",
        "isLive": true,
        "imgName": "boss.png",
        "magicTable":["melami"]
    },
}

//敵の組み合わせ
export const enemyPatter: {[key: string]: string[][]}={
    "field":[
        ["slime"],
        ['golem'],
        ["slime", "golem"],
        ["slime", "golem", "dark-king"],
    ],
    "cave":[
        ["pikachu"],
        ["pikachu", "sheimi"],
        ["sheimi", "genger"],
        ["rizerdon"]
    ],
    "boss":[
        ["myutwo"]
    ]
}