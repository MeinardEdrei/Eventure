'use client';
import '../css/evaluationSummary.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

function EvaluationSummary () {
    return (
        <>
        <div className="container">
            <div className="eventTitle">Post Evaluation Summary</div>
            <div className="eventDescription">A comprehensive report highlighting key feedback and performance insights from event evaluations.</div>
            <div className="postEvaluationContainer">
                <div className="evaluationBlock">
                    <div className="evaluationCategory">I. Clarity</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="pieChart">
                        <div className="pieChartImage">PIE CHART DITO</div>
                        <div className="pieChartBreakdown">
                            <p>0% - Excellent</p>
                            <p>0% - Very Good</p>
                            <p>0% - Good</p>
                            <p>0% - Fair</p>
                            <p>0% - Poor</p>
                        </div>
                    </div>
                </div>

                <div className="evaluationBlock">
                    <div className="evaluationCategory">II. Objective</div>
                    <div className="evaluationQuestion">The information provided in the event is clear and beneficial</div>
                    <div className="pieChart">
                        <div className="pieChartImage">PIE CHART DITO</div>
                        <div className="pieChartBreakdown">
                            <p>0% - Excellent</p>
                            <p>0% - Very Good</p>
                            <p>0% - Good</p>
                            <p>0% - Fair</p>
                            <p>0% - Poor</p>
                        </div>
                    </div>
                </div>
                <div className="belowButtons">
                    <Link href='/Event-Details'><button>Back</button></Link>
                    <button>Export</button>
                </div>
            </div>
            
        </div>
        </>
    ) 
}

export default EvaluationSummary;