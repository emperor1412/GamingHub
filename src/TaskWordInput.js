import React, { useState } from 'react';
import './TaskWordInput.css';
import './TasksLearn.css';
import shared from './Shared';
import correct_answer from './images/correct_answer.svg';
import incorrect_answer from './images/incorrect_answer.svg';
import { trackTaskFunnel, trackTaskAttempt } from './analytics';

const TaskWordInput = ({ task, onClose, onComplete }) => {
    const [inputWord, setInputWord] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
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

            const result = await onComplete(task, inputWord.trim());
            
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

    const handleTryAgain = () => {
        setShowResult(false);
        setInputWord('');
        setError('');
        setIsCorrect(false);
    };

    const renderContent = () => {
        if (!showResult) {
            return (
                <div className="word-input-content">
                    <div className="quiz-heading">
                        <h2>{task.name}</h2>
                    </div>
                    <div className="task-description">
                        <p>Please enter the correct word to complete this task:</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="word-input-form">
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
                            <button className="try-again-button" onClick={handleTryAgain}>
                                TRY AGAIN
                            </button>
                        </>
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

export default TaskWordInput; 