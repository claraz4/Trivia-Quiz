import React from "react";
import "../styles.css";
import { useNavigate } from "react-router-dom";

export default function QuizEnd(props) {
    const [ points ] = React.useState(props.points);
    const ratioCorrect = points / props.totalQuestions;
    let message;

    if (ratioCorrect > 0.8) {
        message = "Great job!";
    } else if (ratioCorrect > 0.5) {
        message = "You're close! Keep it up!";
    } else {
        message = "Keep on practicing, you got this!";
    }

    const navigate = useNavigate();
    function handleClick() {
        navigate('/', {state : {points}});
    }

    return (
        <div id="end-results">
            <h1>You scored</h1>
            <h4>{points}/{props.totalQuestions}</h4>
            <h5>{message}</h5>

            <button className="button" onClick={handleClick}>Go back to Main Page</button>
        </div>
    );
}