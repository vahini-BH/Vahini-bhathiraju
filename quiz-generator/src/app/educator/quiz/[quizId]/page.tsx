'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Copy, Users, BarChart3, Eye, EyeOff, Share2, CheckCircle, XCircle } from 'lucide-react';
import { formatDuration, calculateScore } from '@/lib/utils';

interface Quiz {
  id: string;
  title: string;
  topic: string;
  roomCode: string;
  duration: number;
  numQuestions: number;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    order: number;
  }>;
}

interface Response {
  id: string;
  studentName: string;
  selectedAnswer: number;
  isCorrect: boolean;
  submittedAt: string;
  question: {
    question: string;
    options: string[];
    correctAnswer: number;
    order: number;
  };
}

export default function EducatorQuizDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.quizId as string;
  const isNewQuiz = searchParams.get('created') === 'true';
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchQuizData();
    fetchResponses();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/quiz?roomCode=${quizId}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/responses`);
      if (response.ok) {
        const data = await response.json();
        setResponses(data.responses);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = () => {
    if (quiz) {
      navigator.clipboard.writeText(quiz.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareQuiz = () => {
    if (quiz) {
      const text = `Join my quiz "${quiz.title}" with room code: ${quiz.roomCode}\n\nGo to: ${window.location.origin}/student`;
      navigator.clipboard.writeText(text);
      alert('Share text copied to clipboard!');
    }
  };

  const getStudentStats = () => {
    const students = [...new Set(responses.map(r => r.studentName))];
    const studentScores = students.map(studentName => {
      const studentResponses = responses.filter(r => r.studentName === studentName);
      const correctAnswers = studentResponses.filter(r => r.isCorrect).length;
      const totalAnswers = studentResponses.length;
      return {
        name: studentName,
        score: totalAnswers > 0 ? calculateScore(correctAnswers, totalAnswers) : 0,
        answered: totalAnswers,
        correct: correctAnswers,
      };
    });
    return studentScores.sort((a, b) => b.score - a.score);
  };

  const getQuestionStats = () => {
    if (!quiz) return [];
    
    return quiz.questions.map(question => {
      const questionResponses = responses.filter(r => r.question.order === question.order);
      const correctResponses = questionResponses.filter(r => r.isCorrect).length;
      const totalResponses = questionResponses.length;
      
      return {
        ...question,
        totalResponses,
        correctResponses,
        accuracy: totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0,
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Quiz not found</p>
          <Link href="/educator" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const studentStats = getStudentStats();
  const questionStats = getQuestionStats();
  const totalStudents = studentStats.length;
  const averageScore = totalStudents > 0 ? Math.round(studentStats.reduce((sum, s) => sum + s.score, 0) / totalStudents) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/educator" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                {showAnswers ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span>{showAnswers ? 'Hide' : 'Show'} Answers</span>
              </button>
              <button
                onClick={shareQuiz}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {isNewQuiz && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">Quiz created successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">Share the room code with your students to get started.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                  <p className="text-gray-600 mb-4">{quiz.topic}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{quiz.numQuestions} questions</span>
                    <span>{formatDuration(quiz.duration)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quiz.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">Room Code</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold font-mono text-blue-600">{quiz.roomCode}</span>
                    <button
                      onClick={copyRoomCode}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy room code"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                  {copied && <p className="text-sm text-green-600 mt-1">Copied!</p>}
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Responses</p>
                    <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Questions & Performance</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {questionStats.map((question, index) => (
                  <div key={question.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Question {index + 1}
                        </h3>
                        <p className="text-gray-700 mb-3">{question.question}</p>
                        
                        {showAnswers && (
                          <div className="space-y-2 mb-4">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-3 rounded-lg border ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <span>{option}</span>
                                  {optionIndex === question.correctAnswer && (
                                    <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-6">
                        <div className="bg-gray-100 rounded-lg p-3 min-w-[120px]">
                          <div className="text-2xl font-bold text-gray-900">{question.accuracy}%</div>
                          <div className="text-sm text-gray-600">
                            {question.correctResponses}/{question.totalResponses} correct
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Student Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Student Leaderboard</h2>
              </div>
              
              {studentStats.length === 0 ? (
                <div className="p-6 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-600 text-sm">Students will appear here once they complete the quiz</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {studentStats.map((student, index) => (
                    <div key={student.name} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">
                              {student.correct}/{student.answered} correct
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{student.score}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}