"use client";
import "../css/createEvaluation.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { MoreVertical, Plus, Trash2 } from "lucide-react";

function PostEvaluation() {
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
          questionText: "",
          rating: "",
        },
      ],
    },
  ]);

  // CREATE EVALUTATION FUNCTION
  const handleCreateEvaluation = async (e) => {
    e.preventDefault();
  };

  // VALUES HANDLERS
  const handleCategoryChange = (categoryIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].categoryName = value;
    setCategories(newCategories);
  };

  const handleQuestionsChange = (categoryIndex, questionIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions[questionIndex].questionText = value;
    setCategories(newCategories);
  };

  const handleRatingsChange = (categoryIndex, questionIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions[questionIndex].questionRating =
      value;
    setCategories(newCategories);
  };

  // CATEGORY FUNCTION
  const addNewCategory = () => {
    const newCategories = [...categories];
    newCategories.push({
      categoryName: "",
      questions: [{ questionText: "", questionRating: "" }],
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
      questionText: "",
      questionRating: "",
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
              placeholder="Post Evaluation Title"
              onChange={(e) => setEvaluationTitle(e.target.value)}
              required
            />
            <input
              className="eventDescription bg-transparent focus:outline-none"
              placeholder="Design and distribute surveys or forms to gather feedback and assess event performance."
              onChange={(e) => setEvaluationDescription(e.target.value)}
              required
            />
          </div>
          <div className="postEvaluationContainer">
            {categories.map((category, categoryIndex) => (
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
                {category.questions.map((question, questionIndex) => {
                  return (
                    <div key={questionIndex}>
                      <div className="addQuestion flex mt-2">
                        <input
                          type="text"
                          placeholder="e.g. The information provided in the event is clear and beneficial"
                          className="focus:outline-none"
                          value={question.questionText}
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
                            <MoreVertical className="text-gray-500" size={20} />
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
                            name={`rating-${questionIndex}`}
                            value="Excellent"
                            onChange={() =>
                              handleRatingsChange(
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
                            name={`rating-${questionIndex}`}
                            value="Very-Good"
                            onChange={() =>
                              handleRatingsChange(
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
                            name={`rating-${questionIndex}`}
                            value="Good"
                            onChange={() =>
                              handleRatingsChange(
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
                            name={`rating-${questionIndex}`}
                            value="Fair"
                            onChange={() =>
                              handleRatingsChange(
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
                            name={`rating-${questionIndex}`}
                            value="Poor"
                            onChange={() =>
                              handleRatingsChange(
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
            ))}
            <div className="belowButtons">
              <Link href="/My-Events">
                <button>Back</button>
              </Link>
              <button className="bg-purple-700">Create</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default PostEvaluation;
