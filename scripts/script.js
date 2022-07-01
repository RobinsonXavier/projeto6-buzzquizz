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






// --------------------------------------------------------------------------------------------------------------------

const $visualize_quizz = document.querySelector('.visualize_quizz')
const $create_quizz = document.querySelector('.create_quizz')

const $start_create_container = document.querySelector('.start_create_container')
const $create_question_container = document.querySelector('.create_question_container')
const $decide_level_container = document.querySelector('.decide_level_container')
const $quizz_done_container = document.querySelector('.quizz_done_container')

const $btn_create_quiz_1 = document.querySelector('.btn-dashed')
const $btn_create_quiz_2 = document.querySelector('.btn_circle') 
const $btn_create_question = document.querySelector('.btn-create-question')
const $btn_decide_level = document.querySelector('.btn-decide-level') 
const $btn_finalize_quizz = document.querySelector('.btn-finalize-quizz') 
const $btn_quizz_done = document.querySelector('.btn-quizz-done')
const $btn_back_home = document.querySelector('.btn-back-home')

$btn_create_quiz_1.addEventListener('click', start_create_quizz)
$btn_create_quiz_2.addEventListener('click', start_create_quizz)

$btn_create_question.addEventListener('click', create_question)
$btn_decide_level.addEventListener('click', decide_level)
$btn_finalize_quizz.addEventListener('click', finalize_quizz)

$btn_quizz_done.addEventListener('click', acess_quizz)
$btn_back_home.addEventListener('click', back_home)

function start_create_quizz(){

    $visualize_quizz.classList.add('invisible')
    $create_quizz.classList.remove('invisible')
}

function create_question(){

    $start_create_container.classList.add('invisible')
    $create_question_container.classList.remove('invisible')
}

function decide_level(){

    $create_question_container.classList.add('invisible')
    $decide_level_container.classList.remove('invisible')
}

function finalize_quizz(){
    $decide_level_container.classList.add('invisible')
    $quizz_done_container.classList.remove('invisible')
}

function acess_quizz(){
    $quizz_done_container.classList.add('invisible')
    $visualize_quizz.classList.remove('invisible')
}

function back_home(){
    $quizz_done_container.classList.add('invisible')
    $visualize_quizz.classList.remove('invisible')
}

// -----------------------------------------------------------------------------------------------------------------