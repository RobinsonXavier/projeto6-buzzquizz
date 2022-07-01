let quizzList = [];

let totalQuizz;

let getQuiz = () => {
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    
    promise.catch(errorGet);

    promise.then(getData);
}

let getData = (request) => {

    quizzList = request.data;
    // console.log(quizzList)

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
                                    `<div class="quizz">
                                        <div class="div_img">
                                            <img src="${quizzList[i].image}" alt="">
                                        </div>
                                        <h3>${quizzList[i].title}</h3>
                                        <input type="hidden" value="${quizzList[i].id}">
                                    </div>`;
    }

    getQuizzInformationInArray();
}

let getQuizzInformationInArray = () => {
    totalQuizz = document.querySelectorAll(".quizz");
    totalQuizz = [...totalQuizz];
    totalQuizz.map(element => element.addEventListener('click', clickQuizz));
}



let clickQuizz = (element) => {
    let quizz = element.currentTarget;
    const displayOff = document.querySelector(".spot");
    displayOff.classList.add("visualize_quizz");
    displayOff.classList.remove("spot");

    console.log(element.currentTarget);

}


getQuiz();






// --------------------------------------------------------------------------------------

let $btn_create_quiz_1 = document.querySelector('.btn-dashed')
let $btn_create_quiz_2 = document.querySelector('.btn_circle') 
let $visualize_quizz = document.querySelector('.visualize_quizz')
let $create_quizz = document.querySelector('.create_quizz')

$btn_create_quiz_1.addEventListener('click', create_quizz)
$btn_create_quiz_2.addEventListener('click', create_quizz)

function create_quizz(){

    $visualize_quizz.classList.add('invisible')
    $create_quizz.classList.remove('invisible')
}
