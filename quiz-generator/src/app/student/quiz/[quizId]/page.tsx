'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { calculateScore } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  duration: number;
  numQuestions: number;
}

export default function StudentQuiz() {
  const params = useParams();
  const quizId = params.quizId as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const storedStudentName = localStorage.getItem('studentName');
    const storedQuizId = localStorage.getItem('quizId');
    
    if (!storedStudentName || storedQuizId !== quizId) {
      // Redirect to student join page if not properly joined
      window.location.href = '/student';
      return;
    }
    
    setStudentName(storedStudentName);
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (quiz && !completed && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, completed, timeLeft]);

  const fetchQuizData = async () => {
    try {
      // First try to get quiz by room code to check if we have access
      const storedRoomCode = localStorage.getItem('roomCode');
      
      const [questionsResponse] = await Promise.all([
        fetch(`/api/quiz/${quizId}/questions`)
      ]);

      if (!questionsResponse.ok) {
        throw new Error('Failed to fetch quiz data');
      }

      const questionsData = await questionsResponse.json();

      // Get quiz info from localStorage or make another API call
      const storedQuiz = localStorage.getItem('quizData');
      if (storedQuiz) {
        const quizData = JSON.parse(storedQuiz);
        setQuiz(quizData);
        setTimeLeft(quizData.duration * 60); // Convert to seconds
      }

      setQuestions(questionsData.questions);
      setQuizStartTime(new Date());
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const nextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    if (selectedAnswer !== undefined) {
      await submitAnswer(currentQuestion.id, selectedAnswer);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitAnswer = async (questionId: string, selectedAnswer: number) => {
    try {
      await fetch(`/api/quiz/${quizId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          studentName,
          selectedAnswer,
        }),
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      // Submit any remaining unanswered questions
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && selectedAnswers[currentQuestion.id] !== undefined) {
        await submitAnswer(currentQuestion.id, selectedAnswers[currentQuestion.id]);
      }

      // Fetch results
      const response = await fetch(`/api/quiz/${quizId}/responses?studentName=${encodeURIComponent(studentName)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.responses);
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Quiz not found</p>
          <Link href="/student" className="text-purple-600 hover:text-purple-700">
            Back to Student Portal
          </Link>
        </div>
      </div>
    );
  }

  if (completed) {
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalQuestions = results.length;
    const score = calculateScore(correctAnswers, totalQuestions);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/student" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Take Another Quiz</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Quiz Complete!</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Score Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center mb-8">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Score</h2>
              <div className="text-6xl font-bold text-purple-600 mb-4">{score}%</div>
              <p className="text-xl text-gray-600 mb-4">
                {correctAnswers} out of {totalQuestions} correct
              </p>
              <p className="text-gray-500">Great job, {studentName}!</p>
            </div>

            {/* Detailed Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Detailed Results</h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {results.map((result, index) => (
                  <div key={result.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        result.isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {result.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Question {index + 1}
                        </h4>
                        <p className="text-gray-700 mb-3">{result.question.question}</p>
                        
                        <div className="space-y-2">
                          {result.question.options.map((option: string, optionIndex: number) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                optionIndex === result.question.correctAnswer
                                  ? 'bg-green-50 border-green-200 text-green-800'
                                  : optionIndex === result.selectedAnswer
                                  ? 'bg-red-50 border-red-200 text-red-800'
                                  : 'bg-gray-50 border-gray-200 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span>{option}</span>
                                {optionIndex === result.question.correctAnswer && (
                                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                )}
                                {optionIndex === result.selectedAnswer && optionIndex !== result.question.correctAnswer && (
                                  <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">Student: {studentName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span className={`font-mono ${timeLeft < 300 ? 'text-red-600' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion?.question}
            </h2>

            <div className="space-y-4 mb-8">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswers[currentQuestion.id] === index
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion.id] === index
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion?.id] === undefined || submitting}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>
                  {submitting ? 'Submitting...' : 
                   currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </span>
                {currentQuestionIndex < questions.length - 1 && (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}