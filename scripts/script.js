let quizzList = [];
let valueAnswersList = [];
let valueCount = 0;
let questionsCount = 1;
let levelObject;
let totalQuizz;
let restartObject;
let myQuizzTemp;

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

    if (errorTreat === "sim") {
        window.location.reload();
    }

    alert("Volte novamente mis tarde");

}

//incompleto ainda
let listOfQuizz = () => {
    const displayOn = document.querySelector(".visualize_quizz");
    const listOfQuizz = document.querySelector(".allQuizz_content");
    let myQuizzes = document.querySelector(".myQuizz_content");

    displayOn.classList.remove("invisible");
    displayOn.classList.add("spot");


    for (let i = 0; i < quizzList.length; i++) {

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
    let identify = quizz.querySelector("input");
    let value = identify.value;

    const displayOff = document.querySelector(".spot");
    displayOff.classList.add("invisible");
    displayOff.classList.remove("spot");

    getObject(value);

}

let getObject = (id) => {

    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);

    promise.catch(errorGetObject);

    promise.then(renderQuizz);
}

let errorGetObject = () => {

    alert("Quizz não encontrado")

    window.location.reload();
}

let renderQuizz = (object) => {
    restartObject = object;
    const startUp = document.querySelector(".myQuizz");
    const dataObject = object.data;
    const screenQuizz = document.querySelector(".play_quizz");
    const questionsObject = dataObject.questions;
    levelObject = dataObject.levels;
    console.log(dataObject)
    console.log(questionsObject)

    let answerList = [];

    screenQuizz.innerHTML +=
        `<div class="header_play_quizz">
            <img src="${dataObject.image}" alt="">
            <h3>${dataObject.title}</h3>
        </div>`;

    for (let i = 0; i < questionsObject.length; i++) {
        let div_title = document.getElementsByClassName("div_title");

        screenQuizz.innerHTML +=
            `<div class="content_play_quizz">

            <div class="div_title">
                <p class="title">${questionsObject[i].title}</p>
            </div>

            <div class="box_play_quizz answer${i}">

            </div>
        </div>`;

        div_title[i].style.backgroundColor = questionsObject[i].color;

        for (let index = 0; index < questionsObject[i].answers.length; index++) {
            let scriptCode =
                `<div class="card_play_quizz">
                <div>
                    <img src="${questionsObject[i].answers[index].image}" alt="">
                </div>
                <div>
                    <p>${questionsObject[i].answers[index].text}</p>
                </div>
                <input type="hidden" value="${questionsObject[i].answers[index].isCorrectAnswer}">
            </div>`;

            answerList[index] = scriptCode;
            // answerList.push(scriptCode)

            // Troquei igualdade não restrita == para igualdade restrita ===
            if (index === questionsObject[i].answers.length - 1) {


                answerList.sort(shuffleAnswers);

                for (let count = 0; count < answerList.length; count++) {
                    let fatherTag = document.querySelector(`.answer${i}`);
                    fatherTag.innerHTML += answerList[count];
                }

                answerList = [];
            }
        }
    }

    showQuizz();
    getAnswerInformationInArray();
    startUp.scrollIntoView(false);
}


let showQuizz = () => {
    let displayOn = document.querySelector(".play_quizz");
    displayOn.classList.remove("invisible");
}

let shuffleAnswers = () => {
    return Math.random() - 0.5;
}

let getAnswerInformationInArray = () => {
    let totalAnswers = document.querySelectorAll(".card_play_quizz");
    totalAnswers = [...totalAnswers];
    totalAnswers.map(answer => answer.addEventListener("click", clickAnswer));

}

let clickAnswer = (element) => {
    const answer = element.currentTarget;
    const question = answer.parentElement;
    const valueAnswer = answer.querySelector("input");
    const allAnswer = question.querySelectorAll(".card_play_quizz");

    if (!answer.classList.contains(`check`)) {

        if (valueAnswer.value === "true") {
            answer.querySelector("div p").classList.add("green");
            valueAnswersList[valueCount] = valueAnswer.value;
            valueCount++;
            for (let i = 0; i < allAnswer.length; i++) {

                if (answer !== allAnswer[i]) {

                    allAnswer[i].querySelector("div img").classList.add("wrongAnswer");
                    allAnswer[i].querySelector("div p").classList.add("wrongAnswer");
                    allAnswer[i].querySelector("div p").classList.add("orange");

                }
            }

        } else {
            answer.querySelector("div p").classList.add("orange");
            valueAnswersList[valueCount] = valueAnswer.value;
            valueCount++;
            for (let j = 0; j < allAnswer.length; j++) {

                if (answer !== allAnswer[j]) {

                    if (allAnswer[j].querySelector("input").value === "true") {
                        allAnswer[j].querySelector("div img").classList.add("wrongAnswer");
                        allAnswer[j].querySelector("div p").classList.add("wrongAnswer");
                        allAnswer[j].querySelector("div p").classList.add("green");
                    } else {

                        allAnswer[j].querySelector("div img").classList.add("wrongAnswer");
                        allAnswer[j].querySelector("div p").classList.add("wrongAnswer");
                        allAnswer[j].querySelector("div p").classList.add("orange");

                    }

                }
            }
        }
        for (let check = 0; check < allAnswer.length; check++) {
            allAnswer[check].classList.add(`check`);
        }
    }

    setTimeout(nextQuestion, 2000);
}


let nextQuestion = () => {
    const questionFocus = document.querySelector(`.answer${questionsCount}`);
    questionsCount++;

    if (questionFocus != null) {
        questionFocus.scrollIntoView(false);
    } else {
        quizzLevel();
    }
}

let quizzLevel = () => {
    const screenQuizz = document.querySelector(".play_quizz");
    let yourLevel;
    let maxValue = 0;
    let valueLevels = [];
    let add = 0;


    for (let i = 0; i < valueAnswersList.length; i++) {

        if (valueAnswersList[i] === "true") {
            valueLevels.push(1);
        } else {
            valueLevels.push(0);
        }
        add += valueLevels[i];
    }

    let valueHit = 100 * (add / valueLevels.length);

    for (let i = 0; i < levelObject.length; i++) {
        let minValue = levelObject[i].minValue;

        if (valueHit !== 0) {
            if (maxValue === 0) {
                if (valueHit > minValue) {
                    yourLevel = levelObject[i];
                    maxValue = minValue;
                }

            } else if (maxValue < minValue) {
                yourLevel = levelObject[i];
                maxValue = minValue;
            } else if (valueHit > minValue) {
                yourLevel = levelObject[i];
                maxValue = minValue;
            }
        } else {
            if (minValue === 0 || minValue === "0") {
                yourLevel = levelObject[i];
            }
        }


    }

    if (yourLevel === undefined) {
        screenQuizz.innerHTML +=
            `<div class="content_play_quizz">

            <div class="div_title backOrange">
                <p class="title">${valueHit.toFixed(0)}% de acerto : é cara... não foi dessa vez</p>
            </div>

            <div class="box_play_quizz final">
                <div class="card_play_quizz">
                    <div class="level_box">
                        <img class="final_img" src="../imagens/piratinhaQueEstica.jpeg" alt="">
                    </div>
                </div>
                <div class="card_play_quizz">
                    <div class="level_box">
                        <p>Esquenta não, na proxima você consegue!</p>
                    </div>
                </div>
            </div>
            <button class="btn_restart">Reiniciar Quizz</button>
            <button class="btn_backhome">Voltar pra home</button>

        </div>`
    } else {

        screenQuizz.innerHTML +=
            `<div class="content_play_quizz">
    
            <div class="div_title backOrange">
                <p class="title">${valueHit.toFixed(0)}% de acerto : ${yourLevel.title}</p>
            </div>
    
            <div class="box_play_quizz final">
                <div class="card_play_quizz">
                    <div class="level_box">
                        <img class="final_img" src="${yourLevel.image}" alt="">
                    </div>
                </div>
                <div class="card_play_quizz">
                    <div class="level_box">
                        <p>${yourLevel.text}</p>
                    </div>
                </div>
            </div>
            <button class="btn_restart">Reiniciar Quizz</button>
            <button class="btn_backhome">Voltar pra home</button>
        
        </div>`
    }

    const finalFocus = document.querySelector(".final");
    finalFocus.scrollIntoView(false);

    getBtnInformationFinalQuizz();

}

let getBtnInformationFinalQuizz = () => {
    let getBtnRestart = document.querySelector(".btn_restart");
    let getBtnBackHome = document.querySelector(".btn_backhome");

    getBtnRestart.addEventListener("click", restartQuizz);
    getBtnBackHome.addEventListener("click", comeBackHome);
}

let restartQuizz = () => {
    const screenQuizz = document.querySelector(".play_quizz");
    const scrollUp = document.querySelector(".play_quizz");

    valueAnswersList = [];
    valueCount = 0;
    questionsCount = 1;
    levelObject;
    totalQuizz;
    screenQuizz.innerHTML = "";

    renderQuizz(restartObject);
    scrollUp.scrollIntoView(true);

}

let comeBackHome = () => {
    window.location.reload();
}

getQuiz();




// --------------------------------------------------------------------------------------------------------------------

const $visualize_quizz = document.querySelector('.visualize_quizz')
const $create_quizz = document.querySelector('.create_quizz')

const $start_create_container = document.querySelector('.start_create_container')
const $create_question_container = document.querySelector('.create_question_container')
const $decide_level_container = document.querySelector('.decide_level_container')
const $quizz_done_container = document.querySelector('.quizz_done_container')

const $btn_create_quiz_dashed = document.querySelector('.btn-dashed')
const $btn_create_quiz_circle = document.querySelector('.btn_circle')
const $btn_create_question = document.querySelector('.btn-create-question')



$btn_create_quiz_dashed.addEventListener('click', start_create_quizz)
$btn_create_quiz_circle.addEventListener('click', start_create_quizz)
$btn_create_question.addEventListener('click', create_question)




let newQuizz;
let titleG;
let imageG;
let questionsG;
let levelsG;
let qt_question;
let qt_level;

function start_create_quizz() {

    $visualize_quizz.classList.add('invisible')
    $create_quizz.classList.remove('invisible')

    newQuizz = {};
    questions = [];
    levels = [];
    qt_question = 0;
    qt_level = 0;
    clear_allInputs()

}

function create_question() {

    let input_title_quizz = document.getElementById('input_title_quizz').value
    let input_url_image = document.getElementById('input_url_image').value

    let input_qt_question = document.getElementById('input_qt_question').value
    let input_qt_level = document.getElementById('input_qt_level').value

    if (validate_MaxAndMinLength_in_title(input_title_quizz)) {

        if (validate_url(input_url_image)) {

            if (validate_start_create(input_title_quizz, input_url_image, input_qt_question, input_qt_level)) {

                qt_question = input_qt_question;
                qt_level = input_qt_level

                // newQuizz = {
                //     title: input_title_quizz,
                //     image: input_url_image,
                // }

                titleG = input_title_quizz
                imageG = input_url_image

                set_questions_dynamically(qt_question)

                $start_create_container.classList.add('invisible')
                $create_question_container.classList.remove('invisible')
            }
            else {
                alert('Preencha todos os campos corretamente!')
            }


        }
        else {
            alert('URL inválida!')
        }
    }
    else {
        alert('O título só pode ter entre 20 e 65 caracteres!')
    }




}

function decide_level() {

    if (validate_create_question()) {

        let questions = validate_create_question()
        console.log(questions)
        // newQuizz.questions = questions
        questionsG = questions

        set_levels_dynamically(qt_level)

        $create_question_container.classList.add('invisible')
        $decide_level_container.classList.remove('invisible')
    }
    else {
        alert('Preencha todos os campos corretamente!')
    }



}


function finalize_quizz() {

    if (validate_finalize_quizz()) {
        let levels = validate_finalize_quizz()
        console.log(levels)
        // newQuizz.levels = levels;
        levelsG = levels;

        newQuizz = {
            title: titleG,
            image: imageG,
            questions: questionsG,
            levels: levelsG
        }
        console.log(newQuizz)
        post_newQuizz()

        set_quizzDone_dynamilly()

        const $btn_quizz_done = document.querySelector('.btn-quizz-done')
        const $btn_back_home = document.querySelector('.btn-back-home')

        $btn_quizz_done.addEventListener('click', acess_quizz)
        $btn_back_home.addEventListener('click', back_home)

        $decide_level_container.classList.add('invisible')
        $quizz_done_container.classList.remove('invisible')
    }
    else {
        alert('Preencha todos os campos corretamente')
    }


}

// INCOMPLETA
function acess_quizz() {





    $quizz_done_container.classList.add('invisible')
    // renderMyQuizz(newQuizz)
}


function back_home() {
    window.location.reload();
}

// -----------------------------------------------------------------------------------------------------------------


function validate_start_create(title, image, qt_question, qt_level) {

    if (title === '' || image === '' || qt_question === '' || qt_level === '') {
        return false;
    }

    // if(parseInt(qt_question) < 3 || parseInt(qt_level) < 2){
    //     return false;
    // }

    if (parseInt(qt_question) < 1 || parseInt(qt_level) < 1) {
        return false;
    }

    return true;
}


function set_questions_dynamically(qt_question) {

    qt_question = parseInt(qt_question);

    $create_question_container.innerHTML =
        `
        <div>
            <h2>Crie suas perguntas</h2>
            <div>

                <div class="edit mg-top-40">
                    <div>
                        <h4>Pergunta 1</h4>
                        <input class="title_question" type="text" placeholder="Texto da pergunta">
                        <input class="color_question" type="input" placeholder="Cor de fundo da pergunta">
                
                    </div>

                    <div>
                        <h4>Resposta correta</h4>
                        <input class="right_answer" type="text" placeholder="Resposta correta">
                        <input class="image_right_answer" type="url" pattern="https://.*"  placeholder="URL da imagem correta">
                    </div>

                    <div>
                        <h4>Respostas incorretas</h4>
                        <input class="wrong_answer_1" type="text" placeholder="1º Resposta incorreta">
                        <input class="image_wrong_answer_1" type="text" placeholder="URL da imagem incorreta">
                        <br>
                        <input class="wrong_answer_2" type="text" placeholder="2º Resposta incorreta">
                        <input class="image_wrong_answer_2" type="text" placeholder="URL da imagem incorreta">
                        <br>
                        <input class="wrong_answer_3" type="text" placeholder="3º Resposta incorreta">
                        <input class="image_wrong_answer_3" type="text" placeholder="URL da imagem incorreta">
                    </div>

                </div>
            
            </div>
        </div>
    
    `

    for (let i = 1; i < qt_question; i++) {

        $create_question_container.innerHTML +=
            `
            <div>
                <div class="pre_edit">
                    <h4>Pergunta ${i + 1}</h4>
                    <img src="./imagens/pen.png" alt="Caneta">
                </div>

                
                <div class="edit mg-top-40 invisible">
                    <div>
                        <h4>Pergunta ${i + 1}</h4>
                        <input class="title_question" type="text" placeholder="Texto da pergunta">
                        <input class="color_question" type="text" placeholder="Cor de fundo da pergunta">
                    </div>

                    <div>
                        <h4>Resposta correta</h4>
                        <input class="right_answer" type="text" placeholder="Resposta correta">
                        <input class="image_right_answer" type="text" placeholder="URL da imagem correta">
                    </div>

                    <div>
                        <h4>Respostas incorretas</h4>
                        <input class="wrong_answer_1" type="text" placeholder="1º Resposta incorreta">
                        <input class="image_wrong_answer_1" type="text" placeholder="URL da imagem incorreta">
                        <br>
                        <input class="wrong_answer_2" type="text" placeholder="2º Resposta incorreta">
                        <input class="image_wrong_answer_2" type="text" placeholder="URL da imagem incorreta">
                        <br>
                        <input class="wrong_answer_3" type="text" placeholder="3º Resposta incorreta">
                        <input class="image_wrong_answer_3" type="text" placeholder="URL da imagem incorreta">
                    </div>

                </div>
            
            </div>
        
        `

    }

    $create_question_container.innerHTML +=
        `
    <button class="btn-create btn-decide-level">Prosseguir para criar níveis</button>

    `

    const $btn_decide_level = document.querySelector('.btn-decide-level')
    $btn_decide_level.addEventListener('click', decide_level)

    add_conversionEvent_in_preEdits()
}


function validate_create_question() {

    let title_question = document.getElementsByClassName('title_question')
    let title_question_value = get_value_from(title_question)

    let color_question = document.getElementsByClassName('color_question')
    let color_question_value = get_value_from(color_question)

    let right_answer = document.getElementsByClassName('right_answer')
    let right_answer_value = get_value_from(right_answer)

    let image_right_answer = document.getElementsByClassName('image_right_answer')
    let image_right_answer_value = get_value_from(image_right_answer)

    let wrong_answer_1 = document.getElementsByClassName('wrong_answer_1')
    let wrong_answer_1_value = get_value_from(wrong_answer_1)

    let image_wrong_answer_1 = document.getElementsByClassName('image_wrong_answer_1')
    let image_wrong_answer_1_value = get_value_from(image_wrong_answer_1)

    let wrong_answer_2 = document.getElementsByClassName('wrong_answer_2')
    let wrong_answer_2_value = get_value_from(wrong_answer_2)

    let image_wrong_answer_2 = document.getElementsByClassName('image_wrong_answer_2')
    let image_wrong_answer_2_value = get_value_from(image_wrong_answer_2)

    let wrong_answer_3 = document.getElementsByClassName('wrong_answer_3')
    let wrong_answer_3_value = get_value_from(wrong_answer_3)

    let image_wrong_answer_3 = document.getElementsByClassName('image_wrong_answer_3')
    let image_wrong_answer_3_value = get_value_from(image_wrong_answer_3)

    if (validate_inputEmpty(title_question_value)) {
        return false;
    }
    if (validate_inputEmpty(color_question_value)) {
        return false;
    }
    if (validate_color(color_question_value)) {
        return false;
    }
    if (validate_inputEmpty(right_answer_value)) {
        return false;
    }
    if (validate_inputEmpty(image_right_answer_value)) {
        return false;
    }
    if (validate_inputEmpty(wrong_answer_1_value)) {
        return false;
    }
    if (validate_inputEmpty(image_wrong_answer_1_value)) {
        return false;
    }

    if (validate_arrayOfURLS(image_right_answer_value)) {
        return false;
    }
    if (validate_arrayOfURLS(image_wrong_answer_1_value)) {
        return false;
    }
    if (validate_arrayOfURLS(image_wrong_answer_2_value)) {
        return false;
    }
    if (validate_arrayOfURLS(image_wrong_answer_3_value)) {
        return false;
    }




    let questions = set_inputValues_in_arrayOfObject(title_question_value, color_question_value, right_answer_value, image_right_answer_value, wrong_answer_1_value, image_wrong_answer_1_value, wrong_answer_2_value, image_wrong_answer_2_value, wrong_answer_3_value, image_wrong_answer_3_value)

    return questions;
}

function set_levels_dynamically(qt_level) {

    qt_level = parseInt(qt_level)

    $decide_level_container.innerHTML =
        `
        <h2>Agora, decida os níveis</h2>

        <div>
            <div class="edit">
                <h4>Nível 1</h4>
                <input class="title_level" type="text" placeholder="Título do nível">
                <input class="hit_percent" type="text" placeholder="% de acerto mínimo">
                <input class="image_level" type="text" placeholder="URL da imagem do nível">
                <input class="level_description" type="text" placeholder="Descrição do nível">
            </div>
        </div>
    `;


    for (let i = 1; i < qt_level; i++) {

        $decide_level_container.innerHTML +=
            `
            <div>
                <div class="pre_edit">
                    <h4>Nível ${i + 1}</h4>
                    <img src="/imagens/pen.png" alt="Caneta">
                </div>

                <div class="edit invisible">
                    <h4>Nível ${i + 1}</h4>
                    <input class="title_level" type="text" placeholder="Título do nível">
                    <input class="hit_percent" type="text" placeholder="% de acerto mínimo">
                    <input class="image_level" type="text" placeholder="URL da imagem do nível">
                    <input class="level_description" type="text" placeholder="Descrição do nível">
                </div>

            </div>
        `;
    }

    $decide_level_container.innerHTML += `<button class="btn-create btn-finalize-quizz">Finalizar Quizz</button>`;

    const $btn_finalize_quizz = document.querySelector('.btn-finalize-quizz')
    $btn_finalize_quizz.addEventListener('click', finalize_quizz)

    add_conversionEvent_in_preEdits()
}


function validate_finalize_quizz() {

    let title_level = document.getElementsByClassName('title_level')
    let title_level_value = get_value_from(title_level)

    let hit_percent = document.getElementsByClassName('hit_percent')
    let hit_percent_value = get_value_from(hit_percent)

    let image_level = document.getElementsByClassName('image_level')
    let image_level_value = get_value_from(image_level)

    let level_description = document.getElementsByClassName('level_description')
    let level_description_value = get_value_from(level_description)

    if (validate_inputEmpty(title_level_value)) {
        return false;
    }
    if (validate_inputEmpty(hit_percent_value)) {
        return false;
    }
    if (validate_inputEmpty(image_level_value)) {
        return false;
    }
    if (validate_inputEmpty(level_description_value)) {
        return false;
    }


    if (validate_titleLevel(title_level_value)) {
        return false;
    }
    if (validate_levelDescription(level_description_value)) {
        return false;
    }
    if (validate_arrayOfURLS(image_level_value)) {
        return false;
    }
    if (validate_hitPercent(hit_percent_value)) {
        return false;
    }


    let levels = set_inputLevel_in_arrayOfObject(title_level_value, hit_percent_value, image_level_value, level_description_value)

    return levels;

}


function set_inputValues_in_arrayOfObject(title_question_value, color_question_value, right_answer_value, image_right_answer_value, wrong_answer_1_value, image_wrong_answer_1_value, wrong_answer_2_value, image_wrong_answer_2_value, wrong_answer_3_value, image_wrong_answer_3_value) {

    qt_question = parseInt(qt_question);
    let questions = []

    for (let i = 0; i < qt_question; i++) {

        let answersTemp = [
            {
                text: right_answer_value[i],
                image: image_right_answer_value[i],
                isCorrectAnswer: true
            },
            {
                text: wrong_answer_1_value[i],
                image: image_wrong_answer_1_value[i],
                isCorrectAnswer: false
            }
        ]

        if (wrong_answer_2_value[i] !== '') {
            answersTemp.push({
                text: wrong_answer_2_value[i],
                image: image_wrong_answer_2_value[i],
                isCorrectAnswer: false
            })
        }

        if (wrong_answer_3_value[i] !== '') {
            answersTemp.push({
                text: wrong_answer_3_value[i],
                image: image_wrong_answer_3_value[i],
                isCorrectAnswer: false
            })
        }

        let objectTemp = {
            title: title_question_value[i],
            color: color_question_value[i],
            answers: answersTemp
        }

        questions.push(objectTemp)
    }

    return questions;
}


function set_inputLevel_in_arrayOfObject(title_level_value, hit_percent_value, image_level_value, level_description_value) {
    qt_level = parseInt(qt_level)
    let levels = []

    for (let i = 0; i < qt_level; i++) {

        let levelTemp = {
            title: title_level_value[i],
            image: image_level_value[i],
            text: level_description_value[i],
            minValue: hit_percent_value[i]
        }

        levels.push(levelTemp)
    }

    return levels;
}


function set_quizzDone_dynamilly() {

    $quizz_done_container.innerHTML =
        `
        <h2>Seu quizz está pronto!</h2>

        <div class="quizz quizz_done">
            <div class="div_img">
                <img src="${newQuizz.image}" alt="">
            </div>
            <h3>${newQuizz.title}</h3>
        </div>

        <div class="fx-col gap-10">
            <button class="btn-create btn-quizz-done">Acessar Quizz</button>
            <button class="btn-back-home">Voltar para casa</button>
        </div>

    `;
}



function add_conversionEvent_in_preEdits() {
    let pre_edit = document.getElementsByClassName('pre_edit')
    let edit = document.getElementsByClassName('edit')
    pre_edit = [...pre_edit]

    pre_edit.map(elem => elem.addEventListener('click', convert_preEdit_in_edit))
}
function get_value_from(html_collection) {

    const array_reference = [...html_collection]

    let array_value = []
    for (let i = 0; i < array_reference.length; i++) {

        array_value.push(array_reference[i].value)
    }

    return array_value;
}
function validate_inputEmpty(array_value) {

    for (let i = 0; i < array_value.length; i++) {
        if (array_value[i] === '') {
            return true;
        }
    }

    return false;
}
function convert_preEdit_in_edit(e) {

    let preEdit = e.currentTarget;

    let edit = preEdit.nextElementSibling;

    preEdit.classList.add('invisible')
    edit.classList.remove('invisible')
}
function clear_allInputs() {
    let allInputs = document.getElementsByTagName('input')
    allInputs = [...allInputs]
    allInputs.map(input => input.value = '')
}


function post_newQuizz(){

    let newQuizzLocal = newQuizz;
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', newQuizzLocal)

    promise.then(successefulPost)
    promise.catch(ErrorPost)
}

function ErrorPost(e) {
    alert('Não foi possível enviar o novo Quizz ao servidor!')
    console.log(e.response)
}

function successefulPost(request) {
    console.log('Novo Quizz enviado ao servidor com sucesso!');
}


function validate_MaxAndMinLength_in_title(title) {

    if (title.length >= 20 && title.length <= 65) {
        return true;
    }
    return false;
}
function validate_url(url) {

    try {
        let newUrl = new URL(url)
    }
    catch (TypeError) {
        return false;
    }

    return true;
}
function validate_arrayOfURLS(array_url) {

    let contUrl = 0;
    let contEmpty = 0;
    for (let i = 0; i < array_url.length; i++) {
        if (array_url[i] !== '') {
            if (validate_url(array_url[i])) {
                contUrl++;
            }
        }
        else {
            contEmpty++;
        }
    }

    if ((contUrl + contEmpty) === array_url.length) {
        return false;
    }

    console.log('URL INVÁLIDA')
    return true;
}
function validate_minLength_in_question(question) {

    if (question.length >= 20) {
        return true;
    }
    return false;
}
function validate_color(array_color) {

    for (let i = 0; i < array_color.length; i++) {

        if (array_color[i].match(/#[A-za-z0-9]{6}/g) === null) {
            return true;
        }
    }
    return false;

}
function validate_titleLevel(titleLevel) {

    let cont = 0;
    for (let i = 0; i < titleLevel.length; i++) {

        if (titleLevel[i].length >= 10) {
            cont++;
        }
    }

    if (cont === titleLevel.length) {
        return false;
    }

    console.log('TÍTULO INVÁLIDO')
    return true;
}
function validate_levelDescription(levelDescription) {

    let cont = 0;
    for (let i = 0; i < levelDescription.length; i++) {

        if (levelDescription[i].length >= 30) {
            cont++;
        }

    }
    if (cont === levelDescription.length) {
        return false;
    }

    console.log('DESCRIÇÃO DO NÍVEL INVÁLIDO')
    return true;
}
function validate_hitPercent(hitPercent) {

    let cont = 0;
    let percentZero = 0;

    for (let i = 0; i < hitPercent.length; i++) {

        if (hitPercent[i] >= 0 && hitPercent[i] <= 100) {
            cont++;

            if (hitPercent[i] === '0' || hitPercent[i] === 0) {
                percentZero++;
            }
        }
    }

    if (cont === hitPercent.length && percentZero === 1) {
        return false;
    }

    console.log('PORCENTAGEM INVÁLIDA')
    return true;
}


window.addEventListener('resize', responsive_layout);
window.addEventListener('load', responsive_layout);
function responsive_layout(){
    let width = window.screen.width;
    let percent80_of = width * 0.8;
    $visualize_quizz.style.width = `${percent80_of}px`
} 