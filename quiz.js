let form = document.querySelector(".quiz");
list_correct_responses = [];


let nb_question = document.querySelector("#nb_question");
let category = document.querySelector("#category");
let difficulty = document.querySelector("#difficulty");
let type = document.querySelector("#Type");
let form_to_generate = document.querySelector(".api_helper form");

let next_button = document.querySelector(".next div");
let list_questions = document.querySelectorAll(".question");
let current_question = 0;
let check_box = document.querySelectorAll("input");

let my_timer = document.getElementById("clock");
let count = document.querySelector(".time");
let countdown;


form_to_generate.addEventListener("submit", async function (e) {
    e.preventDefault();

    const url = `https://opentdb.com/api.php?amount=${nb_question.value}&category=${category.value}&difficulty=${difficulty.value}&type=${type.value}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results);
    for (let i = 0; i < data.results.length; i++) {
        let correct_answer = data.results[i].correct_answer;
        let answers = [correct_answer, ...data.results[i].incorrect_answers].sort(() => Math.random() - 0.5);
        let correct_index = answers.indexOf(correct_answer);
        let question = data.results[i].question;
        list_correct_responses.push(correct_index + i * answers.length);

        if (answers.length == 4) {
            form.innerHTML +=
                `<div class="question ${(i === 0) ? '' : 'hidden'}">
            <label for="qt${i + 1}"><span><b>${i + 1}°/ ${question}</b></span></label>
            <p><input type="radio" name="qt${i + 1}"><span>${answers[0]}</span></p>
            <p><input type="radio" name="qt${i + 1}"><span>${answers[1]}</span></p>
            <p><input type="radio" name="qt${i + 1}"><span>${answers[2]}</span></p>
            <p><input type="radio" name="qt${i + 1}"><span>${answers[3]}</span></p>
        </div>`
        }
        else {
            form.innerHTML +=
                `<div class="question ${(i === 0) ? '' : 'hidden'}">
            <label for="qt${i + 1}"><span><b>${i + 1}°/ ${question}</b></span></label>
            <p><input type="radio" name="qt${i + 1}"><span>${answers[0]}</span></p>
            <p><input type="radio" name="qt${i + 1}"><span>${answers[1]}</span></p>
        </div>`
        }
    }
    document.querySelector(".api_helper").style.display = "none";
    form.classList.remove("hidden");
    count.classList.remove("hidden");
    document.querySelector(".next").classList.remove("hidden");

    startCountDown();
    list_questions = Array.from(document.querySelectorAll(".question"));
    check_box = Array.from(document.querySelectorAll("input"));
})





function startCountDown() {
    let timeLeft = 21;

    clearInterval(countdown);

    countdown = setInterval(() => {
        timeLeft -= 1;
        my_timer.textContent = timeLeft;

        if (timeLeft <= 0 && current_question < Number(nb_question.value) - 1) {
            next_button.click();
        }

        else if (timeLeft <= 0 && next_button.textContent === "Result") {
            next_button.click();

        }
    }, 1000);
}



next_button.addEventListener("click", (e) => {
    if (current_question < (Number(nb_question.value)) - 2) {
        list_questions[current_question].classList.add("hidden");
        current_question += 1;
        list_questions[current_question].classList.remove("hidden");
        startCountDown();
    }

    else if (e.target.textContent === "Result") {
        let list_response = document.querySelectorAll("input");
        console.log(list_response);
        let responses = [];
        for (let i = 0; i < list_response.length; i++) {

            if (list_response[i].checked) {
                responses.push(i);
            }

            else if ((i > 0) && ((i + 1) % 4 === 0) && !(list_response[i].checked || list_response[i - 1].checked || list_response[i - 2].checked || list_response[i - 3].checked) && type.value == 'multiple') {
                responses.push(-1);
            }

            else if ((i > 0) && ((i + 1) % 2 === 0) && !(list_response[i].checked || list_response[i - 1].checked) && type.value == 'boolean') {
                responses.push(-1);
            }

        }

        score = 0;
        for (let i = 0; i < responses.length; i++) {
            if (responses[i] === list_correct_responses[i]) {
                score += 1;
            }
        }

        let result = document.querySelector(".score");
        console.log(result);
        result.textContent = `Score : ${score}/${Number(nb_question.value)}`;
        result.classList.remove("hidden");
        count.remove();
        form.style.display = "none";
        next_button.style.display = "none";


        if (0 <= score && score <= 0.4 * Number(nb_question.value)) result.style.color = "red";
        else if (0.5 * Number(nb_question.value) <= score && score <= 0.7 * Number(nb_question.value)) result.style.color = "#ddc214";
    }

    else if (current_question == Number(nb_question.value) - 2) {
        list_questions[current_question].classList.add("hidden");
        current_question += 1;
        list_questions[current_question].classList.remove("hidden");
        next_button.textContent = "Result";
        next_button.style.color = "black";
        next_button.style.right = "45%";
        startCountDown()
    }
})
