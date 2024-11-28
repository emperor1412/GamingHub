import React, { useState } from 'react';
import shared from './Shared';
import kmIcon from './images/km.svg';
import './TasksLearn.css';
import correct_answer from './images/correct_answer.svg';
import incorrect_answer from './images/incorrect_answer.svg';

const TasksLearn = ({ task, onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleNext = () => {
        if (currentStep < task.contentList.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (currentStep === task.contentList.length - 1) {
            // Show quiz
            setCurrentStep(currentStep + 1);
        }
    };

    const handleAnswerSelect = (index) => {
        setSelectedAnswer(index);
    };

    const handleNextAnswer = async () => {
        if (selectedAnswer === null) return;
        
        const correct = task.question.answerIndex == selectedAnswer;
        setIsCorrect(correct);
        setShowResult(true);
        
        console.log('Correct:', correct);
        if(correct) {
            // try {
            //     await fetch(`${shared.server_url}/api/app/taskComplete?token=${shared.loginData.token}`, {
            //         method: 'POST',
            //         body: JSON.stringify({ 
            //             id: task.id,
            //             answerIndex: selectedAnswer 
            //         })
            //     });
            // } catch (error) {
            //     console.error('Error submitting answer:', error);
            // }
        }
    };

    const renderContent = () => {
        if (currentStep < task.contentList.length) {
            // Learning content view
            const content = task.contentList[currentStep];
            return (
                <div className="learn-content">
                    <h2>{content.title}</h2>
                    <p>{content.content}</p>
                    <button className="next-button" onClick={handleNext}>
                        NEXT
                    </button>
                </div>
            );
        } else {
            // Quiz view
            return (
                <div className="quiz-content">
                    {!showResult ? (
                        <>
                            <h2>{task.question.question}</h2>
                            <div className="answers-container">
                                {task.question.answers.map((answer, index) => (
                                    <button
                                        key={index}
                                        className={`answer-button ${selectedAnswer === index ? 'selected' : ''}`}
                                        onClick={() => !showResult && handleAnswerSelect(index)}
                                        disabled={showResult}
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                            {selectedAnswer !== null && (
                                <button className="next-button" onClick={handleNextAnswer}>
                                    NEXT
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="result-container">
                            <div className="result-icon">
                                <img src={isCorrect ? correct_answer : incorrect_answer} alt={isCorrect ? "Correct" : "Incorrect"}/>
                            </div>
                            {isCorrect ? (
                                <>
                                <h3>BINGO</h3>
                                <p style={{ fontSize: '11px' }}>YOU'VE COMPLETED THE CRYPTO SLANG QUIZ!</p>
                                    <div className="reward-earned">
                                        <p>YOU'VE EARNED</p>
                                        <div className="reward-amount">
                                            <img src={kmIcon} alt="KM" />
                                            <span>{task.rewardList[0]?.amount || 0}</span>
                                        </div>
                                    </div>
                                    <button className="tasks-okay-button" onClick={onClose}>
                                        OKAY
                                    </button>
                                </>
                            ) : (
                                <button className="try-again-button" onClick={() => {
                                    setShowResult(false);
                                    setSelectedAnswer(null);
                                    setCurrentStep(0);
                                }}>
                                    TRY AGAIN
                                </button>
                            )}
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="learn-task-overlay">
            <div className="learn-task-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default TasksLearn;
