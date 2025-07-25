import React, { useState, useEffect } from 'react';
import shared from './Shared';
// import kmIcon from './images/km.svg';
import kmIcon from './images/starlet.png';
import './TasksLearn.css';
import correct_answer from './images/correct_answer.svg';
import incorrect_answer from './images/incorrect_answer.svg';
import { trackTaskFunnel, trackTaskAttempt, trackTaskContent } from './analytics';

const TasksLearn = ({ task, onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [tryCount, setTryCount] = useState(0);

    const handleNext = () => {
        // Track content interaction
        trackTaskContent(task.id, currentStep, 'next', shared.loginData?.userId);

        if (currentStep < task.contentList.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (currentStep === task.contentList.length - 1) {
            // Track quiz start
            trackTaskFunnel(task.id, 'quiz', 'quiz_start', {
                task_name: task.name,
                content_steps_completed: task.contentList.length
            }, shared.loginData?.userId);
            
            // Show quiz
            setCurrentStep(currentStep + 1);
        }
    };

    const handleAnswerSelect = (index) => {
        setSelectedAnswer(index);
    };

    const handleNextAnswer = async () => {
        if (selectedAnswer === null) return;
        
        console.log('Selected answer:', selectedAnswer, '\tCorrect answer:', task.question.answerIndex);
        const correct = task.question.answerIndex === selectedAnswer;
        setIsCorrect(correct);
        setShowResult(true);
        
        // Track quiz attempt
        trackTaskAttempt(task.id, 'quiz', correct, {
            task_name: task.name,
            selected_answer: selectedAnswer,
            correct_answer: task.question.answerIndex,
            attempt_count: tryCount + 1
        }, shared.loginData?.userId);

        console.log('Correct:', correct);
        
        // For task type 3, always call completeTask regardless of correct/incorrect
        if (task.type === 3) {
            const reward = await onComplete(task, selectedAnswer);
            console.log('Reward:', reward);
        } else if (correct) {
            // For task type 2, only call completeTask if correct
            trackTaskFunnel(task.id, 'quiz', 'completion', {
                task_name: task.name,
                attempts_needed: tryCount + 1
            }, shared.loginData?.userId);

            const reward = await onComplete(task, selectedAnswer);
            console.log('Reward:', reward);
        }
    };

    // Track content view on initial render
    useEffect(() => {
        if (currentStep < task.contentList.length) {
            trackTaskContent(task.id, currentStep, 'view', shared.loginData?.userId);
        }
    }, [currentStep, task.id, task.contentList.length]);

    // Update tryCount when trying again (only for task type 2)
    const handleTryAgain = () => {
        if (task.type === 2) {
            setTryCount(prev => prev + 1);
            setShowResult(false);
            setSelectedAnswer(null);
            setCurrentStep(0);
        }
    };

    const renderContent = () => {
        if (currentStep < task.contentList.length) {
            // Learning content view
            const content = task.contentList[currentStep];
            return (
                <div className="learn-content">
                    <div className='quiz-heading'>
                        <h2>{content.title}</h2>
                    </div>
                    <div className='answers-container'>
                        {/* {content.content} */}
                        <div dangerouslySetInnerHTML={{ __html: content.content }} />
                    </div>
                    {/* <img src="https://pub-8bab4a9dfe21470ebad9203e437e2292.r2.dev/miniGameHub/SuI1Oopmz+UyFoxEtRyAsfKqTtAKiXqFHoekK9GzbKQ="></img> */}
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
                            <div className="quiz-heading">
                                {task.question.heading}
                            </div>                            
                            <div className='quiz-question'>{task.question.question}</div>
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
                        isCorrect ? (
                            <div className="result-container">
                                <div className="result-icon">
                                    <img src={isCorrect ? correct_answer : incorrect_answer} alt={isCorrect ? "Correct" : "Incorrect"}/>
                                    <div className='stars' style={{ top: 190, left: 0 }}>
                                        <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                                        <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                                        <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                                        <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                                        <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                                    </div>
                                </div>
                                <div className="success-content">
                                    <div className='text-bingo'>BINGO</div>
                                    <p className='text-complete-quiz'>YOU'VE COMPLETED THE QUIZ!</p>
                                    <div className="reward-earned">
                                        <p className='text-you-earn'>YOU'VE EARNED</p>
                                        <div className="reward-amount">
                                        <img src={shared.mappingIcon[task.rewardList[0].type]} alt="KM" className="reward-icon" />
                                            <span className='reward-amount-text'>{task.rewardList[0]?.amount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="tasks-okay-button" onClick={() => {
                                        // if (isCorrect) {
                                        //     onComplete(task.id);
                                        // }
                                        onClose();
                                    }}>
                                    OKAY
                                </button>
                            </div>
                        ) : (
                            <div className="result-container">
                                <div className="fail-content">
                                    <div className="result-icon">
                                        <img src={isCorrect ? correct_answer : incorrect_answer} alt={isCorrect ? "Correct" : "Incorrect"} className='result-icon-img'/>
                                        <div className='stars' style={{ top: 219, left: -15 }}>
                                            <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                                            <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                                            <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                                            <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                                            <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                                        </div>
                                    </div>
                                    {task.type === 3 && (
                                        <div className="better-luck-message">
                                            <p>Better luck next time!</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    className={task.type === 3 ? "confirm-button" : "try-again-button"} 
                                    onClick={task.type === 3 ? onClose : handleTryAgain}
                                >
                                    {task.type === 3 ? "CONFIRM" : "TRY AGAIN"}
                                </button>
                            </div>
                        )
                    )}
                </div>
            );
        }
    };

    return (
        <div className="tasks-content">
            <div className="tasks-inner-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default TasksLearn;
