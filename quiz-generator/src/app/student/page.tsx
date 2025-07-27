'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, LogIn, Clock, BookOpen } from 'lucide-react';

export default function StudentPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const joinQuiz = async () => {
    if (!roomCode.trim() || !studentName.trim()) {
      setError('Please enter both room code and your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: roomCode.toUpperCase(),
          studentName: studentName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to join quiz');
        return;
      }

      // Store student info in localStorage for the session
      localStorage.setItem('studentName', studentName.trim());
      localStorage.setItem('quizId', data.quiz.id);
      localStorage.setItem('roomCode', roomCode.toUpperCase());
      localStorage.setItem('quizData', JSON.stringify(data.quiz));

      // Redirect to quiz
      router.push(`/student/quiz/${data.quiz.id}`);
    } catch (error) {
      console.error('Error joining quiz:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
          </div>
        </div>
      </header>

      {/* Join Form */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join a Quiz</h2>
              <p className="text-gray-600">Enter the room code provided by your educator</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Room Code
                </label>
                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono tracking-wider"
                  onKeyPress={(e) => e.key === 'Enter' && joinQuiz()}
                />
                <p className="text-sm text-gray-500 mt-1">Ask your educator for the room code</p>
              </div>

              <button
                onClick={joinQuiz}
                disabled={!roomCode.trim() || !studentName.trim() || loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="h-5 w-5" />
                <span>{loading ? 'Joining...' : 'Join Quiz'}</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>How it works</span>
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-semibold text-xs">1</span>
                </div>
                <p>Get the room code from your educator</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-semibold text-xs">2</span>
                </div>
                <p>Enter your name and the room code above</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-semibold text-xs">3</span>
                </div>
                <p>Answer questions one by one at your own pace</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-semibold text-xs">4</span>
                </div>
                <p>View your results when finished</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}