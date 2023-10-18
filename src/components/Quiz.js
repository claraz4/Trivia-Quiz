import React from "react";
import "../styles.css";
import htmlSymbols from "../htmlSymbols";
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
    const [displayCorrect, setDisplayCorrect] = React.useState(false);
    const [points, setPoints] = React.useState(0);
    const [buttonClicked, setButtonClicked] = React.useState(-1);

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


    // Questions and answers
    const [question, setQuestion] = React.useState();
    const [answers, setAnswers] = React.useState([]);
    const [options, setOptions] = React.useState([]); 

    // Set the question we're at once there is no error, no loading and every time the current question was updated
    React.useEffect(() => {
        if (!isLoading && !error) {
            setQuestion(questionsData.results[currentQuestion - 1]);
        }
    }, [currentQuestion, isLoading, error]);

    // Create the answers array
    React.useEffect(() => {
        if (question !== undefined) {
            if (question.type === "boolean") {
                setAnswers(["True", "False"]); 
            } else {
                const corrected = question.incorrect_answers.map((q) => fixSymbols(q));
                setAnswers([...corrected, fixSymbols(question.correct_answer)].sort(() => 0.5 - Math.random()));
            }
        }
    }, [question]);

    // Create the options rendering array and shuffle the options
    React.useEffect(() => {
        let style;
        setOptions(answers.map((a, idx) => {
                if (question !== undefined && displayCorrect && a === question.correct_answer) {
                    style = " btn-correct";
                } else if (idx === buttonClicked) {
                    style = " btn-incorrect";
                } else {
                    style = "";
                }
               
                return (
                    <button 
                        key={idx} 
                        className={`button${style}`}
                        id="btn-answer" 
                        type="button"
                        value={question !== undefined && a === question.correct_answer ? "correct": "incorrect"}
                        onClick={(e) => handleClickOptions(e, idx)}
                    >
                    {a}
                    </button>
                );
            }
        ));
      }, [answers, displayCorrect, buttonClicked]);
    

    // Handle the Next button click
    function handleClickNext(event) {
        event.preventDefault();
        if (currentQuestion !== parseInt(totalQuestions)) {
            // Increment the question number
            reset();
            setTimeLeft(maxTime);
        } else {
            // Go to the finishing page
        }
    }

    // Handle the options click
    function handleClickOptions(event, key) {
        if (!displayCorrect) {
            setDisplayCorrect(true);
            setButtonClicked(key);

            if (event.target.value === "correct") {
                setPoints(prevPoints => prevPoints + 1);
            }
        }
    }

    // Update the progress bar and restart the timer
    React.useEffect(() => {
        setProgress((currentQuestion * 100 / totalQuestions )+ "%");
    }, [currentQuestion]);

    // Create a ref to hold the interval ID
    const interval = React.useRef(null);

    React.useEffect(() => {
        clearInterval(interval.current);
        if (!isLoading) {
            // Start the timer
            interval.current = setInterval(() => {
                // Decrement the time left by 1
                setTimeLeft((prevTime) => {
                    if (buttonClicked !== -1) {
                        clearInterval(interval.current);
                        return prevTime; 
                    } else if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        // Go to the next question and reset the timer and the displayCorrect
                        reset();
                        clearInterval(interval.current);
                        return maxTime;
                    }
                });
            }, 1000);
        }
    }, [currentQuestion, isLoading, buttonClicked]);


    // Reset when going to a new question
    function reset() {
        setCurrentQuestion(prevCurr => prevCurr + 1);
        setDisplayCorrect(false);
        setButtonClicked(-1);
    }

    // Replace the HTML symbols by their values
    function fixSymbols(s) {
        const keys = Object.keys(htmlSymbols);
        for (let i = 0; i < keys.length; i++) {
            s = s.replaceAll(keys[i], htmlSymbols[keys[i]]);
        }
        return s;
    }

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
                        <Link to={`/quiz-settings/${formData.categoryId}`} id="btn-close">✕</Link>
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
                        <h4>{question && fixSymbols(question.question || "No Question Available")}</h4>
                    </div>

                    <div className="quiz--answers-container">
                        {options}
                    </div>
                    <button className="button" id="btn-submit" onClick={handleClickNext}>{currentQuestion === parseInt(totalQuestions) ? "Finish" : "Next"}</button>
                </div>
            }
        </div>
    );
}