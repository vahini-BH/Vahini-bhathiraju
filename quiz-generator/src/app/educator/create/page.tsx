'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, Wand2 } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Quiz metadata
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [numQuestions, setNumQuestions] = useState(5);
  const [educatorName, setEducatorName] = useState('');
  
  // Questions
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Initialize questions array when step changes
  React.useEffect(() => {
    if (step === 2 && questions.length === 0) {
      const initialQuestions = Array.from({ length: numQuestions }, () => ({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      }));
      setQuestions(initialQuestions);
    }
  }, [step, numQuestions, questions.length]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!title.trim() || !topic.trim() || !educatorName.trim()) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(2);
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const generateSampleQuestions = () => {
    const sampleQuestions: Question[] = [
      {
        question: `What is a key concept in ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
      },
      {
        question: `Which of the following is most important for understanding ${topic}?`,
        options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
        correctAnswer: 1,
      },
      {
        question: `In the context of ${topic}, what would be the best approach?`,
        options: ['Approach A', 'Approach B', 'Approach C', 'Approach D'],
        correctAnswer: 2,
      },
    ];

    const filledQuestions = questions.map((q, index) => {
      if (index < sampleQuestions.length) {
        return sampleQuestions[index];
      }
      return q;
    });

    setQuestions(filledQuestions);
  };

  const saveQuiz = async () => {
    // Validate questions
    const isValid = questions.every(q => 
      q.question.trim() && 
      q.options.every(opt => opt.trim()) &&
      q.correctAnswer >= 0 && q.correctAnswer < 4
    );

    if (!isValid) {
      alert('Please fill in all questions and options');
      return;
    }

    setLoading(true);
    try {
      // Create quiz
      const quizResponse = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          topic,
          duration,
          numQuestions,
          createdBy: educatorName,
        }),
      });

      if (!quizResponse.ok) throw new Error('Failed to create quiz');

      const { quiz } = await quizResponse.json();

      // Add questions
      const questionsResponse = await fetch(`/api/quiz/${quiz.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });

      if (!questionsResponse.ok) throw new Error('Failed to add questions');

      router.push(`/educator/quiz/${quiz.id}?created=true`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
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
              <h1 className="text-xl font-bold text-gray-900">Create New Quiz</h1>
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Details</h2>
                <p className="text-gray-600">Set up your quiz parameters and basic information</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="educatorName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    id="educatorName"
                    type="text"
                    value={educatorName}
                    onChange={(e) => setEducatorName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Photosynthesis Quiz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Topic/Subject *
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Photosynthesis, World War 2, Calculus"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">This will be used to generate AI questions (future feature)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions
                    </label>
                    <select
                      id="numQuestions"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <select
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Next: Add Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setStep(1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Details</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{numQuestions} questions • {duration} minutes</p>
            </div>
            <button
              onClick={saveQuiz}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Quiz'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Questions Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* AI Helper */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">AI Question Generator (Coming Soon)</h3>
                <p className="text-blue-700 text-sm">Auto-generate questions for "{topic}" with AI assistance</p>
              </div>
              <button
                onClick={generateSampleQuestions}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Wand2 className="h-4 w-4" />
                <span>Sample Questions</span>
              </button>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      placeholder="Enter your question here..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Select the radio button next to the correct answer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}