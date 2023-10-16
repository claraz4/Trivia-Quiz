import React from "react";
import "../styles.css";
import { useLocation, Link } from "react-router-dom";

export default function Quiz(props) {
    const maxTime = 20;

    const location = useLocation();
    const formData = location.state.formData;
    const [questionsData, setQuestionsData] = React.useState({});
    const [error, setError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentQuestion, setCurrentQuestion] = React.useState(1);
    const totalQuestions = formData.questions;
    const [progress, setProgress] = React.useState("");
    const [timeLeft, setTimeLeft] = React.useState(maxTime);

    // Form the link to submit to the Trivia API
    const questions = `amount=${formData.questions}`;
    const category = `&category=${formData.categoryId}`;
    const difficulty = (formData.difficulty === "any" || formData.difficulty === "") ? "" : `&difficulty=${formData.difficulty}`;
    const type = (formData.type === "any" || formData.type ==="") ? "" : `&type=${formData.type}`;
    const url = "https://opentdb.com/api.php?" + questions + category + difficulty + type;

    // Get the questions from the API request
    React.useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => setQuestionsData(data))
    }, [url]);

    // Handle the case where there is a reponse code problem
    React.useEffect(() => {
        setError(questionsData.response_code !== 0 ? true : false);
        
        if (Object.keys(questionsData).length !== 0) {
            setIsLoading(false);
        }
    }, [questionsData]);

    // Handle the rendering of the questions
    // Handle the &quot; for "
    let question;
    let answers;
    let options;
    if (!isLoading && !error) {
        question = questionsData.results[currentQuestion - 1];

        // Create the answers rendering array
        if (question.type === "boolean") {
            answers = ["True", "False"]; 
        } else {
            answers = [...question.incorrect_answers];
            answers.push(question.correct_answer);
        }

        options = answers.map(((a, idx) => {
            return (
                <p key={idx} className="answer-container">{a}</p>
            );
        }));
    }

    // Handle the button click
    function handleClick(event) {
        event.preventDefault();

        if (currentQuestion !== totalQuestions) {
            // Increment the question number
            setCurrentQuestion(prevCurr => prevCurr + 1);
            setTimeLeft(maxTime);
        } else {
            // Go to the finishing page
        }
    }

    // Update the progress bar and restart the timer
    React.useEffect(() => {
        console.log(progress);
        setProgress((currentQuestion * 100 / totalQuestions )+ "%");
    }, [currentQuestion]);

    // Create a ref to hold the interval ID
    const interval = React.useRef(null);

    // Start the timer
    React.useEffect(() => {
        clearInterval(interval.current);
        if (!isLoading) {
            interval.current = setInterval(() => {
                // Decrement the time left by 1
                setTimeLeft((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        // Go to the next question and reset the timer
                        setCurrentQuestion(prevCurr => prevCurr + 1);
                        clearInterval(interval.current);
                        return maxTime;
                    }
                });
            }, 1000);
        }
    }, [currentQuestion, isLoading]);


    return (
        <div className="page--container">
            {isLoading &&
                <div className="spinner"></div>
            }

            {!isLoading && error && 
                <div>
                    <h2>There was an error while making your request.</h2>
                    <Link to={`/quiz-settings/${formData.categoryId}`} >Go back to quiz settings</Link>
                </div>
            }
                
            {!isLoading && !error &&
                <div>
                    <div className="quiz--header">
                        <div id="btn-close">✕</div>
                        <div className="quiz--status-bar-container">
                            <div id="quiz--status-bar-full">
                                <div 
                                    id="quiz--status-bar"
                                    style={{
                                        width : progress,
                                        transition : "width ease-out 0.6s"
                                    }} 
                                ></div>
                            </div>
                            <p className="quiz--remaining">{currentQuestion}/{totalQuestions}</p>
                        </div>
                    </div>

                    <div className="quiz--question-container">
                        <div id="timer-container">
                            <div id="timer">{timeLeft}</div>
                            <div id="timer-bar-progress"></div>
                        </div>
                        <h4>{question.question}</h4>
                    </div>

                    <div className="quiz--answers-container">
                        {options}
                    </div>
                    <button className="button" onClick={handleClick}>{currentQuestion === parseInt(totalQuestions) ? "Finish" : "Next"}</button>
                </div>
            }
        </div>
    );
}