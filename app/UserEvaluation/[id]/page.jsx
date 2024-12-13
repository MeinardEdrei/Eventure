'use client';
import '../../css/createEvaluation.css';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
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
                const response = await axios.get(`http://localhost:5000/api/evaluation/${id}/post-evaluation`);
                
                if (response.data && response.data.length > 0) {
                    const evaluationData = response.data[0];
                    
                    // PROCESS STRINGIFIED JSON DATA INTO JS OBJECT
                    if (evaluationData.evaluationQuestions) {
                        const processedCategories = evaluationData.evaluationQuestions.flatMap(question => {
                            const categoriesArray = JSON.parse(question.category);
                            const questionsArray = JSON.parse(question.question);

                            console.log("Raw Categories:", categoriesArray);
                            console.log("Raw Questions:", questionsArray);
                        
                            return categoriesArray.map((categoryName, index) => ({
                                categoryName: categoryName,
                                questions: questionsArray[index].map((q, qIndex) => {
                                    return {
                                        id: qIndex + 1,
                                        question: q.question || q,
                                        questionAnswer: q.questionAnswer || ''
                                    };
                                })
                            }));
                        });
                        
                        setEvaluationForm({
                            ...evaluationData,
                            processedCategories: processedCategories
                        });

                        console.log("Processed Categories:", processedCategories);
                    }
                }
            } catch (error) {
                console.log("Error fetching evaluation form:", error);
            }
        };

        fetchEvaluationForm();
    }, [id]);

    const handleAnswerChange = (questionId, value) => {
        // const questionId = `${categoryIndex}-${questionIndex}`;
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Create a mapping of questions to their actual database IDs
        const createQuestionIdMapping = () => {
            const mapping = {};
            evaluationForm.evaluationQuestions.forEach(question => {
                const categoriesArray = JSON.parse(question.category);
                const questionsArray = JSON.parse(question.question);
                
                categoriesArray.forEach((categoryName, categoryIndex) => {
                    questionsArray[categoryIndex].forEach((q, qIndex) => {
                        // Use a unique key to match the question
                        const key = `${categoryName}-${q.question || q}`;
                        mapping[key] = question.id; // Assuming this is the evaluation question record ID
                    });
                });
            });
            return mapping;
        };

        const questionIdMapping = createQuestionIdMapping();

        const evaluationAnswers = evaluationForm.processedCategories.flatMap(category => 
            category.questions.map(question => {
                // Find the actual question ID using the mapping
                const questionKey = `${category.categoryName}-${question.question}`;
                const actualQuestionId = questionIdMapping[questionKey];

                if (!actualQuestionId) {
                    console.error("Could not find question ID for:", questionKey);
                    return null;
                }
                
                return {
                    AttendeeId: session.user.id,
                    EvaluationFormId: evaluationForm.id,
                    QuestionId: actualQuestionId, 
                    Answer: answers[question.id],
                };
            }).filter(answer => answer !== null)  // Remove any null entries
        );

        console.log("Prepared Submission:", evaluationAnswers);

        try {
            const response = await axios.post(
                `http://localhost:5000/api/evaluation/submit-evaluation`, 
                evaluationAnswers
            );
            if (response.status === 200) {
                alert(response.data.message);
                router.push("/Events");
            }
        } catch (error) {
            console.log("Error submitting evaluation:", error);
        }
    };

    if (!evaluationForm) {
        return <div>Loading...</div>;
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
                                                name={`answer-${categoryIndex}-${questionIndex}`}
                                                value="Excellent"
                                                onChange={() => handleAnswerChange(question.id, "Excellent")}
                                                required
                                            />{" "}
                                            Excellent
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${categoryIndex}-${questionIndex}`}
                                                value="Very-Good"
                                                onChange={() => handleAnswerChange(question.id, "Very-Good")}
                                            />{" "}
                                            Very Good
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${categoryIndex}-${questionIndex}`}
                                                value="Good"
                                                onChange={() => handleAnswerChange(question.id, "Good")}
                                            />{" "}
                                            Good
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${categoryIndex}-${questionIndex}`}
                                                value="Fair"
                                                onChange={() => handleAnswerChange(question.id, "Fair")}
                                            />{" "}
                                            Fair
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`answer-${categoryIndex}-${questionIndex}`}
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