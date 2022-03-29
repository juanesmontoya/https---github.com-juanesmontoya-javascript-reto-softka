
//se declara un objeto question para gestionar la vista de las preguntas
const question = {
    instance: null,
    correctAnswer: null,
    allAnswers: null,
    btnAnswers: null,
    //se crea un metodo para inicializar la gestion de las preguntas
    init() {
        question.config();
        question.instance = new GameConfig();
        question.showquestion();
        //condicional para salir del juego una vez alcanzado el nivel 6
        if(question.instance.Level == 6){
            const user = question.instance.User;
            showAlert(`Has ganado ${user.name}, con un puntaje de ${user.score}.\nFelicitaciones.`);
            question.instance.endGame(() => location.replace("../views/index.html"))
        }
    },
    //metodo para configurar los eventos de los botones de respuesta
    config() {
        const botonGuardar = document.querySelector('#exit');
        botonGuardar.addEventListener('click', () => question.instance.endGame(() => location.replace("../views/index.html")));
        question.btnAnswers = [
            select_id("btn1"),
            select_id("btn2"),
            select_id("btn3"),
            select_id("btn4")
        ];
    },
    //metodo para mostrar las preguntas en el html
    async showquestion() {
        const questionLevel = await question.instance.getQuestionByLevel();
        question.correctAnswer = questionLevel.respuesta;
        question.allAnswers = [
            questionLevel.respuesta,
            questionLevel.incorrecta1,
            questionLevel.incorrecta2,
            questionLevel.incorrecta3
        ];
        question.allAnswers.sort(() => Math.random() - 0.5);
        select_id("nivel").innerHTML = questionLevel.nivel;
        select_id("pregunta").innerHTML = questionLevel.pregunta;
        select_id("btn1").innerHTML = question.allAnswers[0];
        select_id("btn2").innerHTML = question.allAnswers[1];
        select_id("btn3").innerHTML = question.allAnswers[2];
        select_id("btn4").innerHTML = question.allAnswers[3];
    },
    //metodo para validar la respuesta seleccionada
    answerChoice(n) {
        if (question.allAnswers[n] === question.correctAnswer) {
            question.btnAnswers[n].style.background = "darkolivegreen";
            question.instance.levelUp(() => location.replace("../views/nivel.html"));            
        } else {
            showAlert("Te has equivocado, pierdes tu puntaje. Vuelve a intentar.");
            question.btnAnswers[n].style.background = "salmon";
            question.instance.lostGame(() => location.replace("../views/index.html"));           
        }
    }
};
question.init();