import React from "react";
import "../styles.css";
import { useLocation, Link } from "react-router-dom";

export default function Quiz(props) {
    const location = useLocation();
    const formData = location.state.formData;
    const [questionsData, setQuestionsData] = React.useState({});
    const [error, setError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

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
                    No error
                </div>
            }
        </div>
    );
}