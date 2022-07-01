
let getQuiz = () => {
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    console.log(promise)
}