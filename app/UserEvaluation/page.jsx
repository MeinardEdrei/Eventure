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
                            <input type="radio" name="rating_clarity" value="excellent" required /> Excellent
                        </label>
                        <label>
                            <input type="radio" name="rating_clarity" value="very-good" required /> Very Good
                        </label>
                        <label>
                            <input type="radio" name="rating_clarity" value="good" required /> Good
                        </label>
                        <label>
                            <input type="radio" name="rating_clarity" value="fair" required /> Fair
                        </label>
                        <label>
                            <input type="radio" name="rating_clarity" value="poor" required /> Poor
                        </label>
                    </div>

                    <br/>
                    <div className="evaluationCategory">II. Relevance</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="evaluationInput">
                        <label>
                            <input type="radio" name="rating_relevance" value="excellent" required /> Excellent
                        </label>
                        <label>
                            <input type="radio" name="rating_relevance" value="very-good" required /> Very Good
                        </label>
                        <label>
                            <input type="radio" name="rating_relevance" value="good" required /> Good
                        </label>
                        <label>
                            <input type="radio" name="rating_relevance" value="fair" required /> Fair
                        </label>
                        <label>
                            <input type="radio" name="rating_relevance" value="poor" required /> Poor
                        </label>
                    </div>

                    <div className="evaluationCategory">III. Organization and flow</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="evaluationInput">
                        <label>
                            <input type="radio" name="rating_organization" value="excellent" required /> Excellent
                        </label>
                        <label>
                            <input type="radio" name="rating_organization" value="very-good" required /> Very Good
                        </label>
                        <label>
                            <input type="radio" name="rating_organization" value="good" required /> Good
                        </label>
                        <label>
                            <input type="radio" name="rating_organization" value="fair" required /> Fair
                        </label>
                        <label>
                            <input type="radio" name="rating_organization" value="poor" required /> Poor
                        </label>
                    </div>

                    <div className="evaluationCategory">IV. Assistance of the facilitators</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="evaluationInput">
                        <label>
                            <input type="radio" name="rating_facilitators" value="excellent" required /> Excellent
                        </label>
                        <label>
                            <input type="radio" name="rating_facilitators" value="very-good" required /> Very Good
                        </label>
                        <label>
                            <input type="radio" name="rating_facilitators" value="good" required /> Good
                        </label>
                        <label>
                            <input type="radio" name="rating_facilitators" value="fair" required /> Fair
                        </label>
                        <label>
                            <input type="radio" name="rating_facilitators" value="poor" required /> Poor
                        </label>
                    </div>

                    <div className="evaluationCategory">V. Activities during sessions</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="evaluationInput">
                        <label>
                            <input type="radio" name="rating_activities" value="excellent" required /> Excellent
                        </label>
                        <label>
                            <input type="radio" name="rating_activities" value="very-good" required /> Very Good
                        </label>
                        <label>
                            <input type="radio" name="rating_activities" value="good" required /> Good
                        </label>
                        <label>
                            <input type="radio" name="rating_activities" value="fair" required /> Fair
                        </label>
                        <label>
                            <input type="radio" name="rating_activities" value="poor" required /> Poor
                        </label>
                    </div>

                </div>
                <div className="belowButtons">
                    <Link href='/OrganizerEvents'><button>Back</button></Link>
                    <button>Submit</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default PostEvaluation;
