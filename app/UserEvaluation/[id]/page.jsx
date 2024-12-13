'use client';
import '../../css/createEvaluation.css';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

function AttendeePostEvaluation() {
    const router = useRouter();
    const { data: session } = useSession();
    const [evaluationForm, setEvaluationForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchEvaluationForm = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/evaluation/${id}/evaluation-form`);
                
                console.log("Raw Response:", response.data);

                if (response.data) {
                    const processedForm = {
                        id: response.data.id,
                        title: response.data.title,
                        description: response.data.description,
                        processedCategories: response.data.categories ? response.data.categories.map(category => ({
                            categoryName: category.name,
                            questions: category.questions.map(question => ({
                                id: question.id,
                                question: question.questionText
                            }))
                        })) : []
                    };

                    console.log("Processed Form:", processedForm);
                    setEvaluationForm(processedForm);
                } else {
                    console.error("No evaluation form data found");
                    alert("No evaluation form available for this event.");
                }
            } catch (error) {
                console.error("Error fetching evaluation form:", error.response ? error.response.data : error.message);
                alert("Failed to load evaluation form. Please try again later.");
            }
        };

        fetchEvaluationForm();
    }, [id]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all questions are answered
        const allQuestionsAnswered = evaluationForm.processedCategories.every(category => 
            category.questions.every(question => answers[question.id])
        );

        if (!allQuestionsAnswered) {
            alert("Please answer all questions before submitting.");
            return;
        }

        const evaluationAnswers = Object.keys(answers).map((questionId) => ({
            AttendeeId: session.user.id,
            EvaluationFormId: evaluationForm.id,
            QuestionId: questionId,
            Answer: answers[questionId],
        }));

        try {
            const response = await axios.post(`http://localhost:5000/api/evaluation/submit-evaluation`, evaluationAnswers);
            if (response.status === 200) {
                alert(response.data.message);
                router.push("/Events");
            }
        } catch (error) {
            console.error("Error submitting evaluation:", error);
            alert("Failed to submit evaluation. Please try again.");
        }
    };

    if (!evaluationForm) {
        return <div>Loading evaluation form...</div>;
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-10">
                    <div className="eventTitle bg-transparent mb-2">
                        {evaluationForm.title}
                    </div>
                    <div className="eventDescription bg-transparent">
                        {evaluationForm.description}
                    </div>
                </div>
                <div className="postEvaluationContainer">
                    {evaluationForm.processedCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="evaluationBlock">
                            <div className="evaluationCategory bg-transparent">
                                {category.categoryName}
                            </div>
                            {category.questions.map((question, questionIndex) => (
                                <div key={questionIndex}>
                                    <div className="addQuestion flex mt-2">
                                        <h1 className='p-2 w-full border-white/10 border-b-2'>{question.question}</h1>
                                    </div>
                                    <div className="evaluationInput">
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${question.id}`}
                                                value="Excellent"
                                                onChange={() => handleAnswerChange(question.id, "Excellent")}
                                                required
                                            />{" "}
                                            Excellent
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${question.id}`}
                                                value="Very-Good"
                                                onChange={() => handleAnswerChange(question.id, "Very-Good")}
                                            />{" "}
                                            Very Good
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${question.id}`}
                                                value="Good"
                                                onChange={() => handleAnswerChange(question.id, "Good")}
                                            />{" "}
                                            Good
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${question.id}`}
                                                value="Fair"
                                                onChange={() => handleAnswerChange(question.id, "Fair")}
                                            />{" "}
                                            Fair
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${question.id}`}
                                                value="Poor"
                                                onChange={() => handleAnswerChange(question.id, "Poor")}
                                            />{" "}
                                            Poor
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="belowButtons">
                        <Link href='/Events'>
                            <button type="button">Back</button>
                        </Link>
                        <button type="submit" className="bg-purple-700">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AttendeePostEvaluation;