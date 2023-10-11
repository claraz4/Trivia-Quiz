import React from "react";
import "../styles.css";
import { useParams, Link, useNavigate } from 'react-router-dom';
import categoriesData from "../categoriesData";

export default function QuizSettings() {
    // Getting the category for the url
    const { category } = useParams();
    let categoryName;

    for (const obj of categoriesData) {
        if (obj.id === parseInt(category)) {
            categoryName = obj.name;
        }
    }

    // Setting up the states
    const [formData, setFormData] = React.useState({
        "categoryId" : category,
        "categoryName" : categoryName,
        "questions" : 0 ,
        "difficulty" : "",
        "type" : ""
    });

    // Handle the change of any state
    function handleChange(event) {
        setFormData(prevData => {
            return {
                ...prevData,
                [event.target.name]: event.target.value
            }
        });
    };

    // Handle submit button click
    const navigate = useNavigate();
    function handleSubmit(event) {
        event.preventDefault();
        navigate('/quiz', {state:{formData}});
    }
    
    return (
        <div className="page--container">
            <Link 
                to={`/`}
                className="button btn-goback"
            > &lt; Go back</Link>
            <div className="settings--category-title">
                <h2>Category:</h2>
                <p>{categoryName}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="questions">Number of questions: </label>
                <br />
                <input 
                    type="number" 
                    id="questions" 
                    name="questions" 
                    min="1" 
                    step="1" 
                    max="50" 
                    className="button"
                    onChange={handleChange}
                />
                <br />
                <label htmlFor="difficulty">Select the difficulty: </label>
                <br />
                <select
                    id="difficulty"
                    name="difficulty"
                    className="button"
                    onChange={handleChange}
                >
                    <option value="any">Any difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <br />
                <label htmlFor="type">Select the type of questions: </label>
                <br />
                <select
                    id="type"
                    name="type"
                    className="button"
                    onChange={handleChange}
                >
                    <option value="any">Any type</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True and False</option>
                </select>
                <br />
                <button className="button">Start!</button>
            </form>
        </div>
    );
}