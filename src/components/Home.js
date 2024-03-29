import React from "react";
import categoriesData from "../categoriesData";
import { Link, useLocation } from "react-router-dom";
import coinImg from "../images/coin-icon.webp";
import profile from "../images/profile-icon.webp";
import resetSymbol from "../images/arrow.webp";
import "../styles.css";

export default function Home() {
    // Get the points from previous rounds if any
    const location = useLocation();
    const [currentPoints, setCurrentPoints] = React.useState(parseInt(localStorage.getItem("totalPoints")) || 0);

    const state = location.state ? location.state.points : null;

    React.useEffect(() => {
        if (localStorage.getItem("added") === "false") {
            const newPoints = state ? parseInt(location.state.points) : 0;
            setCurrentPoints(prevPoints => prevPoints + newPoints);
            console.log("points: " + currentPoints);
            localStorage.setItem("added", "true");
        }
    }, [state]);

    React.useEffect(() => {
        localStorage.setItem("totalPoints", currentPoints.toString());
    }, [currentPoints])

    // Reset the points
    function handleReset() {
        localStorage.removeItem("totalPoints");
        setCurrentPoints(0);
    }
    console.log(localStorage.getItem("totalPoints"));

    // Get the categories
    const categories = categoriesData.map((category, idx) => {
        const name = category.name.indexOf(":") !== -1 ?
        category.name.substring(category.name.indexOf(":") + 2) :
        category.name;

        return (
            <Link 
                to={`/quiz-settings/${category.id}`} 
                key={idx} 
                className="category-box"

            >
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
        {window.innerWidth < 640
            && 
        <div>
            <div className="home--header-container">
                <div id="header-text">
                    <h1>Welcome back!</h1>
                    <p>Here to challenge your knowledge?</p>
                </div>
                <img src={profile} alt="Profile" id="profile" width="50px" height="50px" />
            </div>
            
            <div id="points-container">
                <div className="home--points-container">
                    <img src={coinImg} alt="Points" width="45px" height="45px" />
                    <div className="home--points-text">
                        <p>Points</p>
                        <h4>{currentPoints}</h4>
                    </div>
                </div>
                <button id="reset-button" title="Reset Points" onClick={handleReset}>
                    <img src={resetSymbol} alt="Reset" width="25px" height="25px" />
                </button>
            </div>
        </div>
        }

        {window.innerWidth >= 640 && 
            <div className="home--header-container">
                    <div className="welcome-container">
                        <img src={profile} alt="Profile" id="profile" width="50px" height="50px" />
                        <div id="header-text">
                            <h1>Welcome back!</h1>
                            <p>Here to challenge your knowledge?</p>
                        </div>
                    </div>
                    <div id="points-container">
                        <button id="reset-button" title="Reset Points" onClick={handleReset}>
                            <img src={resetSymbol} alt="Reset" width="25px" height="25px" />
                        </button>
                        <div className="home--points-container">
                            <img src={coinImg} alt="Points" width="45px" height="45px" />
                            <div className="home--points-text">
                                <p>Points</p>
                                <h4>{currentPoints}</h4>
                            </div>
                        </div>
                    </div>
            </div>
        }

            <div className="home--categories-container">
                <h3>Let's play</h3> 
                <div id="categories-grid">
                    {categories}
                </div>
            </div>
        </div>
    )
}