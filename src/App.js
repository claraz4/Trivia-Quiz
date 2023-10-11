import React from "react";
import "./styles.css";
import Home from "./components/Home";
import QuizSettings from "./components/QuizSettings";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/quiz-settings/:category" element={<QuizSettings />} />    
                </Routes>
            </Router>
        </div>
    );
}