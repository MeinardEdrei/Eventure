'use client';
import '../css/createEvaluation.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

function PostEvaluation () {
    return (
        <>
        <div className="container">
            <div className="eventTitle">Post Evaluation</div>
            <div className="eventDescription">Design and distribute surveys or forms to gather feedback and assess event performance.</div>
            <div className="postEvaluationContainer">
                <div className="evaluationBlock">
                    <div className="evaluationCategory">I. Clarity</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="evaluationInput">
                        <label>
                            <input type="radio" name="rating" value="excellent" required /> Excellent
                        </label>
                        <label>
                            <input type="radio" name="rating" value="very-good" required /> Very Good
                        </label>
                        <label>
                            <input type="radio" name="rating" value="good" required /> Good
                        </label>
                        <label>
                            <input type="radio" name="rating" value="fair" required /> Fair
                        </label>
                        <label>
                            <input type="radio" name="rating" value="poor" required /> Poor
                        </label>
                    </div>


                    <div className="addQuestion"><input type="text" name="" id="" placeholder='Ask something meaningful...'/></div>

                    {/* <div className="addCategory"><input type="text" name="" id="" placeholder='Type a category...'/></div> */}
                    <br/>
                    <div className="evaluationCategory">II. Objective</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="evaluationInput">
                        <label>
                            <input type="radio" name="rating2" value="excellent" required /> Excellent
                        </label>
                        <label>
                            <input type="radio" name="rating2" value="very-good" required /> Very Good
                        </label>
                        <label>
                            <input type="radio" name="rating2" value="good" required /> Good
                        </label>
                        <label>
                            <input type="radio" name="rating2" value="fair" required /> Fair
                        </label>
                        <label>
                            <input type="radio" name="rating2" value="poor" required /> Poor
                        </label>
                    </div>
                    <div className="addQuestion"><input type="text" name="" id="" placeholder='Ask something meaningful...'/></div>
                </div>
                <div className="belowButtons">
                    <Link href='/OrganizerEvents'><button>Back</button></Link>
                    <button>Create</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default PostEvaluation;