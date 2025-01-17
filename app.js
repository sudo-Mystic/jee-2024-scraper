const form = document.getElementById("main-form");
form.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const shift = formData.get("shift");
    const fetchedResponse = await fetch("./keys/" + shift + ".json");
    const ntaAnswers = await fetchedResponse.json();
    console.log(1);
    console.log(ntaAnswers);
    try {
        const responses = JSON.parse(formData.get("responses"));
        console.log(responses);
        compareAnswers(ntaAnswers, responses, shift);
    } catch (err) {
        console.error("JSONError:", err);
        alert("Error while parsing JSON. See console for more details.");
    }
});

function compareAnswers(nta, user, shift) {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    let errorInKeys = [];
    for (const key in nta) {
        const ntaAns = Number(`${nta[key]}`.trim());
        if (user.hasOwnProperty(key)) {
            if (user[key]['hasAnswered']) {
                const ownAns = Number(`${user[key].ownAnswer}`.trim());
                if (ntaAns === ownAns) {
                    correct += 1;
                } else {
                    incorrect += 1;
                    // console.log(nta[key], user[key].ownAnswer);
                }
            } else {
                skipped += 1;
            }
        } else errorInKeys.push(key);
    }
    if (errorInKeys.length > 0) {
        alert("Error in keys:\n" + errorInKeys.toString());
        errorInKeys = [];
    }
    generateScorecard(correct, incorrect, shift);
}

function generateScorecard(correct, incorrect, shift) {
    console.log(1);
    const resultDiv = document.getElementById("result");
    const shiftEl = resultDiv.querySelector(".shift span");
    const scoreEl = resultDiv.querySelector(".score span");
    const attemptedEl = resultDiv.querySelector("table .attempted");
    const correctEl = resultDiv.querySelector("table .correct");
    const incorrectEl = resultDiv.querySelector("table .incorrect");

    // Calculate the correct, incorrect, and unattempted ratios
    const totalQuestions = 75; // Set the total number of questions
    const totalAttempted = correct + incorrect;
    const correctRatio = (correct / totalQuestions) * 100;
    const incorrectRatio = (incorrect / totalQuestions) * 100;
    const unattemptedRatio = 100 - (correctRatio + incorrectRatio);

    // Set the width and left position of the green, red, and grey sections of the progress bar
    const progressBar = resultDiv.querySelector(".progress-bar");
    progressBar.innerHTML = `
        <div class="correct" style="width:${correctRatio}%; left: 0;"></div>
        <div class="incorrect" style="width:${incorrectRatio}%; left:${correctRatio}%;"></div>
        <div class="unattempted" style="width:${unattemptedRatio}%; left:${correctRatio + incorrectRatio}%;"></div>
    `;

    shiftEl.innerText = shift;
    scoreEl.innerText = calculateScore(correct, incorrect);
    attemptedEl.innerText = totalAttempted;
    correctEl.innerText = correct;
    incorrectEl.innerText = incorrect;
}



function calculateScore(correct, incorrect) {
    return correct * 4 - incorrect;
}

function copyScript() {
    const scriptArea = document.getElementById("scriptarea");
    navigator.clipboard.writeText(scriptArea.value);
    alert("Copied!");
}
