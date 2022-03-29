//objeto game para gestionar la vista del inicio del juego
const game = {
    //se crea la propiedad instance para gestionar la persistencia del juego
    instance: null,
    //se crean metodo init para inicializar el objeto game
    init() {
        game.config();
        game.instance = new GameConfig();
        game.showData();
    },
    //se crea metodo para agregar los eventos a los botones
    config() {
        const botonGuardar = document.querySelector('#guardarJugador');
        botonGuardar.addEventListener('click', game.savePlayer);        
    },
    //metodo para redireccionar a la pagina del juego
    iniciarjuego() {
        document.location.replace('./nivel.html');
    },
    //metodo para guardar el jugador actuak
    savePlayer(){
        const playerName = select_id("playerName").value;
        if(playerName == ""){
            showAlert("Porfavor ingresa tu nombre.")
            return false;
        }
        game.instance.start(playerName);
        game.iniciarjuego();
    },
    //metodo para mostrar el historial del juego en el inicio
    showData(){
        const allUsers = game.instance.getAllUsers();
        if (allUsers == null) {
            return false;
        }
        const tbody = document.getElementById("bodytblUsers");
        
        tbody.innerHTML = '';
        allUsers.forEach(user => {
            tbody.innerHTML+= 
            `<tr> 
                <td>${user.name}</td>
                <td>${user.score}</td>
            </tr>`
        });
    }
};
game.init();