import React, { useState, useEffect } from 'react';
import shared from './Shared';
// import kmIcon from './images/km.svg';
import kmIcon from './images/starlet.png';
import './TasksLearn.css';
import './TaskWordInput.css';
import correct_answer from './images/correct_answer.svg';
import incorrect_answer from './images/incorrect_answer.svg';
import { trackTaskFunnel, trackTaskAttempt, trackTaskContent } from './analytics';
import { popup } from '@telegram-apps/sdk';

const TasksLearn = ({ task, onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [inputWord, setInputWord] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [tryCount, setTryCount] = useState(0);
    const [error, setError] = useState('');

    const handleNext = () => {
        // Track content interaction
        trackTaskContent(task.id, currentStep, 'next', shared.loginData?.userId);

        if (task.contentList && currentStep < task.contentList.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (task.contentList && currentStep === task.contentList.length - 1) {
            // Track interaction start based on task type
            let eventName = 'quiz_start';
            let taskType = 'quiz';
            
            if (task.type === 5) {
                eventName = 'completion_view';
                taskType = 'share_story';
            } else if (task.type === 6) {
                eventName = 'word_input_start';
                taskType = 'word_input';
            }
            
            trackTaskFunnel(task.id, taskType, eventName, {
                task_name: task.name,
                content_steps_completed: task.contentList.length
            }, shared.loginData?.userId);
            
            // Show next step based on task type
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

    const handleWordSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputWord.trim()) {
            setError('Please enter a word');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Track word input task completion attempt
            trackTaskAttempt(task.id, 'word_input', true, {
                task_name: task.name,
                word_length: inputWord.trim().length
            }, shared.loginData?.userId);

            const result = await onComplete(task, null, inputWord.trim());
            
            // Check if the task was completed successfully
            if (result && result.length > 0) {
                // Success - show reward
                setIsCorrect(true);
                setShowResult(true);
                
                // Track successful completion
                trackTaskFunnel(task.id, 'word_input', 'completion', {
                    task_name: task.name,
                    word_length: inputWord.trim().length
                }, shared.loginData?.userId);
            } else {
                // Incorrect word
                setIsCorrect(false);
                setShowResult(true);
            }
            
        } catch (error) {
            setIsCorrect(false);
            setShowResult(true);
            setError('Failed to complete task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Track content view on initial render
    useEffect(() => {
        if (task.contentList && currentStep < task.contentList.length) {
            trackTaskContent(task.id, currentStep, 'view', shared.loginData?.userId);
        }
    }, [currentStep, task.id, task.contentList]);

    // Show Telegram popup when entering word input form for task type 6
    const showWordInputWarning = async () => {
        if (popup.open.isAvailable()) {
            const promise = popup.open({
                title: '⚠️ IMPORTANT WARNING',
                message: 'You have ONE CHANCE to enter the correct word.\n\nMake sure you type it exactly as shown - this task is case sensitive (uppercase and lowercase matter).\n\nDouble-check your answer before you submit.',
                buttons: [
                    { id: 'understand', type: 'default', text: 'I UNDERSTAND' }
                ]
            });
            const buttonId = await promise;
        } else {
            // Fallback to browser alert if popup.open is not available
            alert(
                "⚠️ IMPORTANT WARNING\n\n" +
                "You have ONE CHANCE to enter the correct word.\n\n" +
                "Make sure you type it exactly as shown - this task is case sensitive (uppercase and lowercase matter).\n\n" +
                "Double-check your answer before you submit."
            );
        }
    };

    // Show Telegram popup when entering word input form for task type 6
    useEffect(() => {
        if (task.type === 6) {
            // Check if we're showing the word input form (not content or result)
            const isShowingWordInputForm = (
                (!task.contentList || task.contentList.length === 0) && 
                !showResult
            ) || (
                task.contentList && 
                currentStep >= task.contentList.length && 
                !showResult
            );
            
            if (isShowingWordInputForm) {
                showWordInputWarning();
            }
        }
    }, [task.type, task.contentList, currentStep, showResult]);

    // Update tryCount when trying again (only for task type 2)
    const handleTryAgain = () => {
        if (task.type === 2) {
            setTryCount(prev => prev + 1);
            setShowResult(false);
            setSelectedAnswer(null);
            setCurrentStep(0);
        }
        // Task type 6 doesn't allow retry (like type 3)
    };

    const renderContent = () => {
        if (task.contentList && currentStep < task.contentList.length) {
            // Learning content view (same for all types)
            const content = task.contentList[currentStep];
            
            // Special handling for task type 5 - always show BACK button
            if (task.type === 5) {
                return (
                    <div className="learn-content">
                        <div className='quiz-heading'>
                            <h2>{content.title}</h2>
                        </div>
                        <div className='answers-container'>
                            <div dangerouslySetInnerHTML={{ __html: content.content }} />
                        </div>
                        <button className="next-button" onClick={onClose}>
                            BACK
                        </button>
                    </div>
                );
            }
            
            return (
                <div className="learn-content">
                    <div className='quiz-heading'>
                        <h2>{content.title}</h2>
                    </div>
                    <div className='answers-container'>
                        <div dangerouslySetInnerHTML={{ __html: content.content }} />
                    </div>
                    <button className="next-button" onClick={handleNext}>
                        NEXT
                    </button>
                </div>
            );
        } else if (!task.contentList || task.contentList.length === 0) {
            // Handle tasks without contentList - show interaction directly
            if (task.type === 5) {
                // Share story task - show content with back button
                return (
                    <div className="learn-content">
                        <div className='quiz-heading'>
                            <h2>{task.name}</h2>
                        </div>
                        <div className='answers-container'>
                            {task.question?.heading && (
                                <div dangerouslySetInnerHTML={{ __html: task.question.heading }} />
                            )}
                            <div className="reward-preview">
                                <p>You will earn:</p>
                                <div className="reward-amount">
                                    <img src={shared.mappingIcon[task.rewardList[0].type]} alt="Reward" className="reward-icon" />
                                    <span className='reward-amount-text'>{task.rewardList[0]?.amount || 0}</span>
                                </div>
                            </div>
                        </div>
                        <button className="next-button" onClick={onClose}>
                            BACK
                        </button>
                    </div>
                );
            } else if (task.type === 2 || task.type === 3) {
                // Quiz tasks without contentList - show quiz directly
                return (
                    <div className="quiz-content">
                        {!showResult ? (
                            <>
                                <div className="quiz-heading">
                                    {task.question?.heading}
                                </div>                            
                                <div className='quiz-question'>{task.question?.question}</div>
                                <div className="answers-container">
                                    {task.question?.answers?.map((answer, index) => (
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
            } else if (task.type === 6) {
                // Word input tasks without contentList - show form directly
                if (!showResult) {
                    return (
                        <div className="word-input-content">
                            <div className="quiz-heading">
                                <h2>{task.name}</h2>
                            </div>
                            <div className="task-description">
                                {task.question?.heading && (
                                    <div dangerouslySetInnerHTML={{ __html: task.question.heading }} />
                                )}
                            </div>
                            
                            <form onSubmit={handleWordSubmit} className="word-input-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={inputWord}
                                        onChange={(e) => setInputWord(e.target.value)}
                                        placeholder="Enter the word..."
                                        className="word-input"
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                </div>
                                
                                {error && <div className="error-message">{error}</div>}
                                
                                <button 
                                    type="submit" 
                                    className="next-button"
                                    disabled={isSubmitting || !inputWord.trim()}
                                >
                                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                                </button>
                            </form>
                        </div>
                    );
                } else {
                    return (
                        <div className="result-container">
                            {isCorrect ? (
                                <>
                                    <div className="result-icon">
                                        <img src={correct_answer} alt="Correct"/>
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
                                        <p className='text-complete-quiz'>YOU'VE COMPLETED THE TASK!</p>
                                        <div className="reward-earned">
                                            <p className='text-you-earn'>YOU'VE EARNED</p>
                                            <div className="reward-amount">
                                                <img src={shared.mappingIcon[task.rewardList[0].type]} alt="Reward" className="reward-icon" />
                                                <span className='reward-amount-text'>{task.rewardList[0]?.amount || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="tasks-okay-button" onClick={onClose}>
                                        OKAY
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="fail-content">
                                        <div className="result-icon">
                                            <img src={incorrect_answer} alt="Incorrect" className='result-icon-img'/>
                                            <div className='stars' style={{ top: 219, left: -15 }}>
                                                <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                                                <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                                                <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                                                <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                                                <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                                            </div>
                                        </div>
                                        <div className="better-luck-message">
                                            <p>Better luck next time!</p>
                                        </div>
                                    </div>
                                    <button className="try-again-button" onClick={onClose}>
                                        CONFIRM
                                    </button>
                                </>
                            )}
                        </div>
                    );
                }
            }
        } else {
            // Handle tasks with contentList but currentStep is beyond contentList length
            // This should only happen for quiz tasks (type 2, 3) after reading content
            if (task.type === 2 || task.type === 3) {
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
            } else if (task.type === 6) {
                // Word input form view - after reading content
                if (!showResult) {
                    return (
                        <div className="word-input-content">
                            <div className="quiz-heading">
                                <h2>{task.name}</h2>
                            </div>
                            <div className="task-description">
                                {task.question?.heading && (
                                    <div dangerouslySetInnerHTML={{ __html: task.question.heading }} />
                                )}
                            </div>
                            
                            <form onSubmit={handleWordSubmit} className="word-input-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={inputWord}
                                        onChange={(e) => setInputWord(e.target.value)}
                                        placeholder="Enter the word..."
                                        className="word-input"
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                </div>
                                
                                {error && <div className="error-message">{error}</div>}
                                
                                <button 
                                    type="submit" 
                                    className="next-button"
                                    disabled={isSubmitting || !inputWord.trim()}
                                >
                                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                                </button>
                            </form>
                        </div>
                    );
                } else {
                    return (
                        <div className="result-container">
                            {isCorrect ? (
                                <>
                                    <div className="result-icon">
                                        <img src={correct_answer} alt="Correct"/>
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
                                        <p className='text-complete-quiz'>YOU'VE COMPLETED THE TASK!</p>
                                        <div className="reward-earned">
                                            <p className='text-you-earn'>YOU'VE EARNED</p>
                                            <div className="reward-amount">
                                                <img src={shared.mappingIcon[task.rewardList[0].type]} alt="Reward" className="reward-icon" />
                                                <span className='reward-amount-text'>{task.rewardList[0]?.amount || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="tasks-okay-button" onClick={onClose}>
                                        OKAY
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="fail-content">
                                        <div className="result-icon">
                                            <img src={incorrect_answer} alt="Incorrect" className='result-icon-img'/>
                                            <div className='stars' style={{ top: 219, left: -15 }}>
                                                <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                                                <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                                                <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                                                <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                                                <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                                            </div>
                                        </div>
                                        <div className="better-luck-message">
                                            <p>Better luck next time!</p>
                                        </div>
                                    </div>
                                    <button className="try-again-button" onClick={onClose}>
                                        CONFIRM
                                    </button>
                                </>
                            )}
                        </div>
                    );
                }
            }
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
