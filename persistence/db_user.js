const currentUserKey = 'currentUser',
    currentLevelKey = 'currentLevel',
    allUserKey = 'users';

function showAlert(string) {
    alert(string);
}

function select_id(id) {
    return document.getElementById(id)
}

function randomInt(min,max) {
    return Math.floor(Math.random()* (max-min))+min;
}

//se crea una clase para gestionar y almacenar  el usuario
class Db_user {

    id;
    name;
    score;


    constructor(userString) {
        const user = this.stringToObject(userString);
        this.id = user.id;
        this.name = user.name;
        this.score = user.score;
    }

    getId = () => this.id;
    getName = () => this.name;
    getScore = () => this.score;

    setId = (value) => this.id = value;
    setName = (value) => this.name = value;
    setScore = (value) => this.score = value;

    toJson = () => JSON.stringify({
        id: this.id,
        name: this.name,
        score: this.score
    });

    stringToObject = (value) => JSON.parse(value);
    toObject = () => ({
        id: this.id,
        name: this.name,
        score: this.score
    });

    save = () => {

        localStorage.setItem(currentUserKey, this.toJson());
    }

    addScore = (level) => {
        this.score += level * 10;
        const user = this.stringToObject(localStorage.getItem(currentUserKey));
    }

    removeCurrentUser = () => localStorage.removeItem(currentUserKey);

}

//se crea una clase para gestionar y almacenar juego
class GameConfig {
    User = null;
    Level = 0;

    constructor() {
        const user = localStorage.getItem(currentUserKey);
        const level = parseInt(localStorage.getItem(currentLevelKey));
        this.Level = level || 0;
        if (user) {
            this.User = new Db_user(user);
        }
    }

    saveAll = () => {
        const allUsers = JSON.parse(localStorage.getItem(allUserKey)) || [];
        const userObject = this.User.toObject();
        const usersArray = [
            ...allUsers, userObject
        ];
        localStorage.setItem(allUserKey, JSON.stringify(usersArray));
    }

    getAllUsers = () => {
        const allUsers = JSON.parse(localStorage.getItem(allUserKey));
        return allUsers;
    }

    start = (username) => {
        const newUser = {
            id: new Date().valueOf(),
            name: username,
            score: 0
        }
        this.setLevel(1);
        this.User = new Db_user(JSON.stringify(newUser));
        this.User.save();
    }

    setLevel = (level) => {
        this.level = level;
        localStorage.setItem(currentLevelKey, level);
    }

    getQuestionByLevel = async () => {
        const level = this.Level;
        const questions = await this.getQuestions();
        const questionsByLevel = questions.filter(question => question.nivel == level);
        const randomQ = randomInt(0, 5);
        return questionsByLevel[randomQ];
    }

    getQuestions = async () => {

        const response = await fetch('../bd_preguntas.json');
        const questions = await response.json();
        return questions;

    }

    levelUp = (callback) => {
        this.setLevel(this.Level+1);
        this.User.setScore(this.Level * 10);
        this.User.save();
        callback();
    }

    endGame = (callback) => {
        this.saveAll();
        this.User.removeCurrentUser();
        this.setLevel(0);
        callback();
    }

    lostGame = (callback) => {
        this.User.setScore(0);
        this.User.save();
        this.saveAll();
        this.User.removeCurrentUser();
        this.setLevel(0);
        callback();
    }
}