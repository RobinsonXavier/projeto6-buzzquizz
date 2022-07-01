let quizzList = [];

let getQuiz = () => {
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    
    promise.catch(errorGet);

    promise.then(getData);
}

let getData = (request) => {

    quizzList = request.data;
    console.log(quizzList)

    listOfQuizz();
}

let errorGet = () => {

    let errorTreat = promp("Falha ao conectar com os dados do servidor, gostaria de tentar mais uma vez ?");

    if(errorTreat === "sim") {
        window.location.reload();
    }

    alert("Volte novamente mis tarde");

}

//incompleto ainda
let listOfQuizz = () => {
    const displayOn = document.querySelector(".visualize_quizz");
    const listOfQuizz = document.querySelector(".allQuizz_content");

    displayOn.classList.remove("visualize_quizz");
    displayOn.classList.add("spot");

    for(let i = 0; i < quizzList.length; i++) {

        listOfQuizz.innerHTML += 
        `<div class="quizz" onclick="">
            <h3>${quizzList[i].title}</h3>
        </div>`;

    }
}

let clickQuizz = (element) => {

    const displayOff = document.querySelector(".spot");
    displayOff.classList.add("visualize_quizz");
    displayOff.classList.remove("spot");

}


getQuiz();