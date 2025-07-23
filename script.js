//PARAMETROS//
const querystring = window.location.search;
const urlParameters = new URLSearchParams(querystring);
const StreamerbotPort = urlParameters.get('port') || '8080';
const StreamerbotAddress = urlParameters.get('address') || '127.0.0.1';

//HTML ELEMENTS//
const infoDiv = document.getElementById("info");
const progressBar = document.getElementById("progress-bar");
const anuncioIndice = document.getElementById("anuncio-indice");
const anuncioTotal = document.getElementById("anuncio-total");
const timerText = document.getElementById("timer-text");

const client = new StreamerbotClient({
    host: StreamerbotAddress,
    port: StreamerbotPort,
    onConnect: (data) =>{
        console.log(data);
        setConnectionStatus(true);
    },
    onDisconnect: () =>{
        setConnectionStatus(false);
    }
});

//STREAMERBOT EVENTS//

client.on('Twitch.AdRun', (response) => {
    adRun(response.data);
});

// client.on('Twitch.AdMidRoll', (response) => {
    
// });

//FUNCIONES DE STREAMERBOT//

function adRun(data){
    console.log('AdRun: ', data);
    const totalDuration = data.length_seconds;
    startCountdown(10, totalDuration);
}

//STREAMERBOT STATUS FUNCTION//

function setConnectionStatus(connected){
    let statusContainer = document.getElementById('status-container');
    if(connected){
        statusContainer.style.background = "#2FB774";
        statusContainer.innerText = "CONECTADO!";
        statusContainer.style.opacity = 1;
        setTimeout(() => {
            statusContainer.style.transition = "all 2s ease";
            statusContainer.style.opacity = 0;
        }, 10);
    }else{
        statusContainer.style.background = "FF0000";
        statusContainer.innerText = "CONECTANDO...";
        statusContainer.style.transition = "";
        statusContainer.style.opacity = 1;
    }
}

//HELPER FUNCTIONS//

function startProgress(totalDuration) {
    gsap.killTweensOf(progressBar);
    
    progressBar.style.display = "block";
    gsap.set(progressBar, {scaleX: 1});
    gsap.to(progressBar, {
        duration: totalDuration,
        scaleX: 0,
        ease: "linear"
    });
}

function startCountdown(segundos, totalDuracion){
    gsap.killTweensOf(progressBar);
    progressBar.style.display = "block";
    gsap.set(progressBar, { scaleX: 1 });

    let contador = segundos;
    timerText.textContent = `Anuncios en ${contador}`;
    infoDiv.style.display = "block";

    gsap.fromTo(infoDiv,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
    );

    const intervalo = setInterval(() => {
        timerText.textContent = `Anuncios en ${contador}`;
        contador--;

        if (contador < 0) {
        clearInterval(intervalo);
        startProgress(totalDuracion);
        adDuration(totalDuracion);
        }
    }, 1000);
}

function adDuration(totalDuracion) {
    let duracion = totalDuracion;
    infoDiv.style.display = "block";

    const intervalo = setInterval(() => {
        let minutos = Math.floor((duracion%3600)/60);
        let segundos = duracion % 60;

        minutos = minutos < 10 ? "0" + minutos : minutos;
        segundos = segundos < 10 ? "0" + segundos : segundos;

        timerText.textContent = `Anuncios • ${minutos}:${segundos}`;
        duracion--;

        if(duracion < 1){
        clearInterval(intervalo);
        gsap.fromTo(infoDiv,
            { opacity: 1 },
            { opacity: 0, duration: 1 }
        );
        setTimeout(() =>{
            console.log("Reseteando...");
        }, 60*1000);
        }
    }, 1000);
}

