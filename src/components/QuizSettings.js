import React from "react";
import "../styles.css";
import { useParams, Link } from 'react-router-dom';
import categoriesData from "../categoriesData";

export default function QuizSettings() {
    const { category } = useParams();
    let categoryName;

    for (const obj of categoriesData) {
        if (obj.id === parseInt(category)) {
            categoryName = obj.name;
        }
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

            <form>
                <label htmlFor="integerInput">Number of questions: </label>
                <br />
                <input 
                    type="number" 
                    id="integerInput" 
                    name="integerInput" 
                    min="1" 
                    step="1" 
                    max="50" 
                    className="button"
                />
                <br />
                <label htmlFor="difficulty">Select the difficulty: </label>
                <br />
                <select
                    id="category"
                    name="categoryName"
                    className="button"
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
                    name="typeName"
                    className="button"
                >
                    <option value="any">Any type</option>
                    <option value="mcq">Multiple Choice</option>
                    <option value="boolean">True and False</option>
                </select>
                <br />
                <button className="button">Start!</button>
            </form>
        </div>
    );
}