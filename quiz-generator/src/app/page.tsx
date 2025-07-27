import Link from 'next/link';
import { BookOpen, Users, ArrowRight, Zap, Clock, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Quiz Generator</h1>
            </div>
            <div className="text-sm text-gray-600">
              Powered by AI • Built for Education
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Create & Take Quizzes
            <span className="text-blue-600"> Instantly</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Transform any topic into engaging multiple-choice quizzes. 
            Educators can generate questions instantly, while students join with simple room codes.
          </p>
          
          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Setup</h3>
              <p className="text-gray-600">Create quizzes in minutes with AI assistance. Set duration and question count.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Joining</h3>
              <p className="text-gray-600">Students join instantly with a simple room code. No accounts needed.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real Results</h3>
              <p className="text-gray-600">Get instant feedback and detailed analytics on student performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Educator Panel */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">For Educators</h3>
                <p className="text-gray-600">Create and manage quizzes</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-1 rounded-full mt-1">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Generate AI Quizzes</h4>
                  <p className="text-gray-600 text-sm">Input any topic and get instant multiple-choice questions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-1 rounded-full mt-1">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Share Room Codes</h4>
                  <p className="text-gray-600 text-sm">Get unique codes to share with your students</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-1 rounded-full mt-1">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Track Results</h4>
                  <p className="text-gray-600 text-sm">Monitor student performance in real-time</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/educator" 
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Creating</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Student Panel */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">For Students</h3>
                <p className="text-gray-600">Join and take quizzes</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-1 rounded-full mt-1">
                  <ArrowRight className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Enter Room Code</h4>
                  <p className="text-gray-600 text-sm">Join any quiz with a simple 6-character code</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-1 rounded-full mt-1">
                  <ArrowRight className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Answer Questions</h4>
                  <p className="text-gray-600 text-sm">Take quizzes at your own pace with clear instructions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-1 rounded-full mt-1">
                  <ArrowRight className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Get Results</h4>
                  <p className="text-gray-600 text-sm">See your score and correct answers instantly</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/student" 
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Join Quiz</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Ready for AI integration and real-time features
          </p>
        </div>
      </footer>
    </div>
  );
}
