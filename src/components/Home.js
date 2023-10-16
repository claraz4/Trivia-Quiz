import React from "react";
import categoriesData from "../categoriesData";
import { Link } from "react-router-dom";
import coinImg from "../images/coin-icon.png";
import "../styles.css";

export default function Home() {
    const categories = categoriesData.map((category, idx) => {
        const name = category.name.indexOf(":") !== -1 ?
        category.name.substring(category.name.indexOf(":") + 2) :
        category.name;

        return (
            <Link to={`/quiz-settings/${category.id}`} key={idx} id="category-box">
                <img 
                    src={`${require(`../images/${category.icon}`)}`}
                    alt="Category"
                    width="90"
                    height="90"
                />
                <h4>{name}</h4>
            </Link>
        )
    });

    return (
        <div className="page--container">
            <div className="home--header-container">
                <div id="header-text">
                    <h1>Welcome back!</h1>
                    <p>Here to challenge your knowledge?</p>
                </div>
                <div id="logo">

                </div>
            </div>
            
            <div className="home--points-container">
                <img src={coinImg} alt="Points" />
                <div className="home--points-text">
                    <p>Points</p>
                    <h4>1209</h4>
                </div>
            </div>

            <div className="home--categories-container">
                <h3>Let's play</h3> 
                <div id="categories-grid">
                    {categories}
                </div>
            </div>
        </div>
    )
}