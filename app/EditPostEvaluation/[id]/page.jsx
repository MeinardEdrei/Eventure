"use client";
import "../../css/createEvaluation.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

function EditPostEvaluation() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [questionDotsMenuOpen, setQuestionDotsMenuOpen] = useState(null);
  const [categoryDotsMenuOpen, setCategoryDotsMenuOpen] = useState(null);
  const [evaluationTitle, setEvaluationTitle] = useState("");
  const [evaluationDescription, setEvaluationDescription] = useState("");
  const questionDropDown = useRef(null);
  const categoryDropDown = useRef(null);
  const [categories, setCategories] = useState([
    {
      categoryName: "",
      questions: [
        {
          question: "",
          questionAnswer: "",
        },
      ],
    },
  ]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/evaluation/${id}/post-evaluation`
        );
        
        // PROCESS STRINGIFIED JSON DATA INTO JS OBJECT
        if (response.data && response.data.length > 0) {
          const evaluationData = response.data[0];
          
          setEvaluationTitle(evaluationData.title);
          setEvaluationDescription(evaluationData.description);

          if (evaluationData.evaluationQuestions) {
            // RETURN PROCESSED OBJECT WITH THE CATEGORY AND QUESTION
            // Used FlatMap here to avoid nested arrays
            const processedCategories = evaluationData.evaluationQuestions.flatMap(question => {
              const categoriesArray = JSON.parse(question.category);
              const questionsArray = JSON.parse(question.question);
            
              return categoriesArray.map((categoryName, index) => ({
                categoryName: categoryName,
                questions: questionsArray[index].map(q => ({
                  question: q.question,
                  questionAnswer: q.questionAnswer || ""
                }))
              }));
            });
            
            setCategories(processedCategories);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  // UPDATE EVALUTATION FUNCTION
  const handleCreateEvaluation = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const categoryNames = categories.map((category) => category.categoryName);
    const categoryQuestions = categories.map((category) => category.questions);

    formData.append("EventId", id);
    formData.append("OrganizerId", session?.user?.id);
    formData.append("Title", evaluationTitle);
    formData.append("Description", evaluationDescription);
    formData.append("Categories", JSON.stringify(categoryNames));
    formData.append("Questions", JSON.stringify(categoryQuestions));

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/evaluation/update-form`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        router.push(`/Event-Details/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // VALUES HANDLERS
  const handleCategoryChange = (categoryIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].categoryName = value;
    setCategories(newCategories);
  };

  const handleQuestionsChange = (categoryIndex, questionIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions[questionIndex].question = value;
    setCategories(newCategories);
  };

  const handleAnswerChange = (categoryIndex, questionIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions[questionIndex].questionAnswer =
      value;
    setCategories(newCategories);
  };

  // CATEGORY FUNCTION
  const addNewCategory = () => {
    const newCategories = [...categories];
    newCategories.push({
      categoryName: "",
      questions: [{ question: "", questionAnswer: "" }],
    });
    setCategories(newCategories);
  };

  const removeCategory = (categoryIndex) => {
    const newCategories = [...categories];
    newCategories.splice(categoryIndex, 1);
    setCategories(newCategories);
  };

  // QUESTION FUNCTION
  const addNewQuestion = (categoryIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions.push({
      question: "",
      questionAnswer: "",
    });
    setCategories(newCategories);
  };

  const removeQuestion = (categoryIndex, questionIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions.splice(questionIndex, 1);
    setCategories(newCategories);
  };

  const toggleQuestionMenu = (categoryIndex, questionIndex) => {
    // If the same menu is clicked again, close
    if (
      questionDotsMenuOpen?.categoryIndex === categoryIndex &&
      questionDotsMenuOpen?.questionIndex === questionIndex
    ) {
      setQuestionDotsMenuOpen(null);
    } else {
      setQuestionDotsMenuOpen({ categoryIndex, questionIndex });
    }
  };

  // HANDLE CLICK OUTSIDE EVENT FOR DROPDOWN
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        questionDropDown.current &&
        !questionDropDown.current.contains(event.target)
      ) {
        setQuestionDotsMenuOpen(null);
      }
      if (
        categoryDropDown.current &&
        !categoryDropDown.current.contains(event.target)
      ) {
        setCategoryDotsMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="container">
        <form onSubmit={handleCreateEvaluation}>
          <div className="flex flex-col">
            <input
              className="eventTitle bg-transparent focus:outline-none"
              autoFocus={true}
              placeholder={evaluationTitle}
              value={evaluationTitle}
              onChange={(e) => setEvaluationTitle(e.target.value)}
              required
            />
            <input
              className="eventDescription bg-transparent focus:outline-none"
              placeholder={evaluationDescription}
              value={evaluationDescription}
              onChange={(e) => setEvaluationDescription(e.target.value)}
              required
            />
          </div>
          <div className="postEvaluationContainer">

            {/* CATEGORIES MAPPING */}
            {categories.map((category, categoryIndex) => {
              return (
                <div key={categoryIndex} className="evaluationBlock">
                  <div className="flex">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryDotsMenuOpen(
                            categoryIndex === categoryDotsMenuOpen
                              ? null
                              : categoryIndex
                          )
                        }
                        className="p-2 hover:bg-purple-800/30 rounded-full"
                      >
                        <MoreVertical className="text-gray-500" size={20} />
                      </button>
                      {categoryDotsMenuOpen === categoryIndex && (
                        <div
                          ref={categoryDropDown}
                          className="absolute left-0 z-10 mt-2 w-48 bg-white border rounded-md shadow-lg"
                        >
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={() => {
                                addNewCategory();
                                setCategoryDotsMenuOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Plus className="mr-2 text-green-500" size={16} />{" "}
                              Add Category
                            </button>
                            {categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  removeCategory(categoryIndex);
                                  setCategoryDotsMenuOpen(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                              >
                                <Trash2 className="mr-2" size={16} /> Delete
                                Category
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* CATEGORY */}
                    <input
                      className="evaluationCategory bg-transparent w-full focus:outline-none"
                      placeholder="Category Name"
                      value={category.categoryName}
                      onChange={(e) =>
                        handleCategoryChange(categoryIndex, e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* MAPPING OF QUESTIONS */}
                  {category.questions.map((question, questionIndex) => {
                    return (
                      <div key={questionIndex}>
                        <div className="addQuestion flex mt-2">
                          {/* QUESTION */}
                          <input
                            type="text"
                            placeholder="e.g. The information provided in the event is clear and beneficial"
                            className="focus:outline-none"
                            value={question.question}
                            onChange={(e) =>
                              handleQuestionsChange(
                                categoryIndex,
                                questionIndex,
                                e.target.value
                              )
                            }
                            required
                          />
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                toggleQuestionMenu(categoryIndex, questionIndex)
                              }
                              className="p-2 ml-2 hover:bg-purple-800/30 rounded-full"
                            >
                              <MoreVertical
                                className="text-gray-500"
                                size={20}
                              />
                            </button>
                            {questionDotsMenuOpen?.categoryIndex ===
                              categoryIndex &&
                              questionDotsMenuOpen?.questionIndex ===
                                questionIndex && (
                                <div
                                  ref={questionDropDown}
                                  className="absolute right-0 z-10 mt-2 w-48 bg-white border rounded-md shadow-lg"
                                >
                                  <div className="py-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        addNewQuestion(categoryIndex);
                                        setQuestionDotsMenuOpen(null);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Plus
                                        className="mr-2 text-green-500"
                                        size={16}
                                      />{" "}
                                      Add Question
                                    </button>
                                    {category.questions.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          removeQuestion(
                                            categoryIndex,
                                            questionIndex
                                          );
                                          setQuestionDotsMenuOpen(null);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                      >
                                        <Trash2 className="mr-2" size={16} />{" "}
                                        Delete Question
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="evaluationInput">
                          <label>
                            <input
                              type="radio"
                              name={`answer-${questionIndex}`}
                              value="Excellent"
                              onChange={() =>
                                handleAnswerChange(
                                  categoryIndex,
                                  questionIndex,
                                  "Excellent"
                                )
                              }
                            />{" "}
                            Excellent
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`answer-${questionIndex}`}
                              value="Very-Good"
                              onChange={() =>
                                handleAnswerChange(
                                  categoryIndex,
                                  questionIndex,
                                  "Very-Good"
                                )
                              }
                            />{" "}
                            Very Good
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`answer-${questionIndex}`}
                              value="Good"
                              onChange={() =>
                                handleAnswerChange(
                                  categoryIndex,
                                  questionIndex,
                                  "Good"
                                )
                              }
                            />{" "}
                            Good
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`answer-${questionIndex}`}
                              value="Fair"
                              onChange={() =>
                                handleAnswerChange(
                                  categoryIndex,
                                  questionIndex,
                                  "Fair"
                                )
                              }
                            />{" "}
                            Fair
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`answer-${questionIndex}`}
                              value="Poor"
                              onChange={() =>
                                handleAnswerChange(
                                  categoryIndex,
                                  questionIndex,
                                  "Poor"
                                )
                              }
                            />{" "}
                            Poor
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div className="belowButtons">
              <Link href={`/Event-Details/${id}`}>
                <button>Back</button>
              </Link>
              <button className="bg-purple-700">Update</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditPostEvaluation;
