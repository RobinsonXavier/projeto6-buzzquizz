let quizzList = [];

let totalQuizz;

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

    displayOn.classList.remove("invisible");
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
    
    const dataObject = object.data; 
    const screenQuizz = document.querySelector(".play_quizz");
    const questionsObject = dataObject.questions;
    // console.log(questionsObject[1].answers[0].text)
    console.log(dataObject)
    console.log(questionsObject)

    let answerList = [];

    screenQuizz.innerHTML +=
        `<div class="header_play_quizz">
            <img src="${dataObject.image}" alt="">
            <h3>${dataObject.title}</h3>
        </div>`;

    for(let i = 0; i < questionsObject.length; i++) {
        screenQuizz.innerHTML +=
        `<div class="content_play_quizz">

            <div class="div_title">
                <p class="title">${questionsObject[i].title}</p>
            </div>

            <div class="box_play_quizz answer${i}">

            </div>
        </div>`;

        // Setar cor aos titulos das perguntas dinamicamente
        // let div_title = document.getElementsByClassName('div_title')
        // div_title.style.backgroundColor = questionsObject[i].color

        for(let index = 0; index < questionsObject[i].answers.length; index ++){
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
            if(index === questionsObject[i].answers.length -1) {

                answerList.sort(shuffleAnswers);

                for(let count = 0; count < answerList.length; count++) {
                    let fatherTag = document.querySelector(`.answer${i}`);
                    fatherTag.innerHTML += answerList[count];    
                }

                answerList = [];
            }
        }
    }
    
    showQuizz();

}

let showQuizz = () => {
    let displayOn = document.querySelector(".play_quizz");
    displayOn.classList.remove("invisible");
}

let shuffleAnswers = () => {
    return Math.random() - 0.5;
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

// const $btn_quizz_done = document.querySelector('.btn-quizz-done')
// const $btn_back_home = document.querySelector('.btn-back-home')

$btn_create_quiz_dashed.addEventListener('click', start_create_quizz)
$btn_create_quiz_circle.addEventListener('click', start_create_quizz)

$btn_create_question.addEventListener('click', create_question)


// $btn_quizz_done.addEventListener('click', acess_quizz)
// $btn_back_home.addEventListener('click', back_home)

let newQuizz;
let qt_question;
let qt_level;

function start_create_quizz(){

    $visualize_quizz.classList.add('invisible')
    $create_quizz.classList.remove('invisible')

    newQuizz = {};
    qt_question = 0;
    qt_level = 0;
    clear_allInputs()
    
}

function create_question(){

    let input_title_quizz = document.getElementById('input_title_quizz').value
    let input_url_image = document.getElementById('input_url_image').value

    let input_qt_question = document.getElementById('input_qt_question').value
    let input_qt_level = document.getElementById('input_qt_level').value

    if(validate_MaxAndMinLength_in_title(input_title_quizz)){

        if(validate_url(input_url_image)){

            if(validate_start_create(input_title_quizz, input_url_image, input_qt_question, input_qt_level)){
        
                qt_question = input_qt_question;
                qt_level = input_qt_level
        
                newQuizz = {
                    title: input_title_quizz,
                    image: input_url_image,
                }
        
        
                set_questions_dynamically(qt_question)
        
                $start_create_container.classList.add('invisible')
                $create_question_container.classList.remove('invisible')
            }
            else{
                alert('Preencha todos os campos corretamente!')
            }


        }
        else{
            alert('URL inválida!')
        }
    }
    else{
        alert('O título só pode ter entre 20 e 65 caracteres!')
    }

    
    

}

function decide_level(){

    if(validate_create_question()){

        let questions = validate_create_question()

        newQuizz.questions = questions

        set_levels_dynamically(qt_level)

        $create_question_container.classList.add('invisible')
        $decide_level_container.classList.remove('invisible')
    }
    else{
        alert('Preencha todos os campos corretamente!')
    }
    

    
}

function finalize_quizz(){

    if(validate_finalize_quizz()){
        console.log('entrou no if, validou!')
        let levels = validate_finalize_quizz()

        newQuizz.levels = levels;
        
        post_newQuizz(newQuizz)

        $decide_level_container.classList.add('invisible')
        $quizz_done_container.classList.remove('invisible')
    }
    else{
        alert('Preencha todos os campos corretamente')
    }

   
}


// INCOMPLETA
function acess_quizz(){


    $quizz_done_container.classList.add('invisible')
    $visualize_quizz.classList.remove('invisible')
}

// INCOMPLETA
function back_home(){

    
    $quizz_done_container.classList.add('invisible')
    $visualize_quizz.classList.remove('invisible')
}

// -----------------------------------------------------------------------------------------------------------------


function validate_start_create(title, image, qt_question, qt_level){

    if(title === '' || image === '' || qt_question === '' || qt_level === ''){
        return false;
    }

    if(parseInt(qt_question) < 3 || parseInt(qt_level) < 2){
        return false;
    }

    return true;
}


function set_questions_dynamically(qt_question){

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

    for(let i = 1; i < qt_question; i++){

        $create_question_container.innerHTML += 
        `
            <div>
                <div class="pre_edit">
                    <h4>Pergunta ${i+1}</h4>
                    <img src="./imagens/pen.png" alt="Caneta">
                </div>

                
                <div class="edit mg-top-40 invisible">
                    <div>
                        <h4>Pergunta ${i+1}</h4>
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


function validate_create_question(){

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
    
    if(validate_inputEmpty(title_question_value)){
        return false;
    }

    if(validate_inputEmpty(color_question_value)){
        return false;
    }

    if(validate_color(color_question_value)){
        return false;
    }

    if(validate_inputEmpty(right_answer_value)){
        return false;
    }

    if(validate_inputEmpty(image_right_answer_value)){
        return false;
    }

    if(validate_arrayOfURLS(image_right_answer_value)){
        return false;
    }

    if(validate_inputEmpty(wrong_answer_1_value)){
        return false;
    }

    if(validate_inputEmpty(image_wrong_answer_1_value)){
        return false;
    }
    
    
    let questions = set_inputValues_in_arrayOfObject(title_question_value, color_question_value, right_answer_value, image_right_answer_value, wrong_answer_1_value, image_wrong_answer_1_value, wrong_answer_2_value, image_wrong_answer_2_value, wrong_answer_3_value, image_wrong_answer_3_value)
    
    return questions;
}

function set_levels_dynamically(qt_level){

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


    for(let i = 1; i < qt_level; i++){

        $decide_level_container.innerHTML += 
        `
            <div>
                <div class="pre_edit">
                    <h4>Nível ${i+1}</h4>
                    <img src="/imagens/pen.png" alt="Caneta">
                </div>

                <div class="edit invisible">
                    <h4>Nível ${i+1}</h4>
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


function validate_finalize_quizz(){

    let title_level = document.getElementsByClassName('title_level')
    let title_level_value = get_value_from(title_level)
    
    let hit_percent = document.getElementsByClassName('hit_percent')
    let hit_percent_value = get_value_from(hit_percent)

    let image_level = document.getElementsByClassName('image_level')
    let image_level_value = get_value_from(image_level)

    let level_description = document.getElementsByClassName('level_description')
    let level_description_value = get_value_from(level_description)

    if(validate_inputEmpty(title_level_value)){
        return false;
    }

    if(validate_inputEmpty(hit_percent_value)){
        return false;
    }

    if(validate_inputEmpty(image_level_value)){
        return false;
    }

    if(validate_inputEmpty(level_description_value)){
        return false;
    }


    let levels = set_inputLevel_in_arrayOfObject(title_level_value, hit_percent_value, image_level_value, level_description_value)

    return levels;

}


function set_inputValues_in_arrayOfObject(title_question_value, color_question_value, right_answer_value, image_right_answer_value, wrong_answer_1_value, image_wrong_answer_1_value, wrong_answer_2_value, image_wrong_answer_2_value, wrong_answer_3_value, image_wrong_answer_3_value){

    qt_question = parseInt(qt_question);
    let questions = []

    for(let i = 0; i < qt_question; i++){

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

        if(wrong_answer_2_value[i] !== ''){
            answersTemp.push({
                text: wrong_answer_2_value[i],
                image: image_wrong_answer_2_value[i],
                isCorrectAnswer: false
            })
        }

        if(wrong_answer_3_value[i] !== ''){
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


function set_inputLevel_in_arrayOfObject(title_level_value, hit_percent_value, image_level_value, level_description_value){
    qt_level = parseInt(qt_level)
    let levels = []

    for(let i = 0; i < qt_level; i++){

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


function set_quizzDone_dynamilly(){

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



function add_conversionEvent_in_preEdits(){
    let pre_edit = document.getElementsByClassName('pre_edit')
    let edit = document.getElementsByClassName('edit')
    pre_edit = [...pre_edit]

    pre_edit.map(elem => elem.addEventListener('click', convert_preEdit_in_edit))
}
function get_value_from(html_collection){

    const array_reference = [...html_collection]

    let array_value = []
    for(let i = 0; i < array_reference.length; i++){

        array_value.push(array_reference[i].value)
    }

    return array_value;
}
function validate_inputEmpty(array_value){

    for(let i = 0; i < array_value.length; i++){
        if(array_value[i] === ''){
            return true;
        }
    }

    return false;
}
function convert_preEdit_in_edit(e){

    let preEdit = e.currentTarget;

    let edit = preEdit.nextElementSibling;

    preEdit.classList.add('invisible')
    edit.classList.remove('invisible')
}
function clear_allInputs(){
    let allInputs = document.getElementsByTagName('input')
    allInputs = [...allInputs]
    allInputs.map( input => input.value = '')
}



function post_newQuizz(newQuizz){

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', newQuizz)

    promise.catch(ErrorPost)
    promise.then(successefulPost)
}


function ErrorPost(){
    alert('Não foi possível enviar o novo Quizz ao servidor!')
}

function successefulPost(){
    console.log('Novo Quizz enviado ao servidor com sucesso!')
}


function validate_MaxAndMinLength_in_title(title){

    if(title.length >= 20 && title.length <= 65){
        return true;
    }
    return false;
}


function validate_url(url){

    try{
        let newUrl = new URL(url)
    }
    catch(TypeError){
        return false;
    }

    return true;
}

// INCOMPLETA
function validate_arrayOfURLS(array_url){

    for(let i = 0; i < array_url.length; i++){
        validate_url(array_url[i]);
    }
}

function validate_minLength_in_question(question){

    if(question.length >= 20){
        return true;
    }
    return false;
}


function validate_color(array_color){

    for(let i = 0; i < array_color.length; i++){

        if(array_color[i].match(/#[A-za-z0-9]{6}/g) === null){
            return true;
        }
    }
    return false;

}

