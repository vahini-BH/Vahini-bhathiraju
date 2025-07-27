# AI Quiz Generator

A full-stack web application for creating and taking interactive multiple-choice quizzes. Built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## 🚀 Features

### For Educators
- **Quiz Creation**: Create quizzes with custom topics, duration, and number of questions
- **Room Codes**: Generate unique 6-character codes for students to join
- **Real-time Analytics**: Monitor student performance and quiz statistics
- **Question Management**: Add multiple-choice questions with up to 4 options
- **Results Dashboard**: View detailed analytics and student leaderboards

### For Students
- **Easy Join**: Join quizzes using simple room codes
- **Interactive Quiz Taking**: Answer questions one by one with a clean interface
- **Timer**: Built-in countdown timer for time-limited quizzes
- **Instant Results**: View scores and detailed answer explanations
- **Progress Tracking**: Visual progress bar during quiz completion

### Technical Features
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **API Routes**: RESTful API built with Next.js API routes
- **Real-time Ready**: Architecture prepared for WebSocket integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom gradients and animations

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a PostgreSQL database
   - Update the `DATABASE_URL` in `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/quiz_generator?schema=public"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

The application uses the following main models:

### Quiz
- Basic quiz information (title, topic, room code, duration)
- Relationships to questions and responses

### Question  
- Multiple-choice questions with options and correct answers
- Ordered within each quiz

### Response
- Student answers to specific questions
- Tracks correctness and submission time

### Student
- Student participation records
- Links students to specific quizzes

## 🎯 Usage

### Creating a Quiz (Educator)

1. Go to `/educator` and enter your name
2. Click "Create New Quiz"
3. Fill in quiz details:
   - Quiz title
   - Topic/subject
   - Number of questions (5, 10, 15, or 20)
   - Duration (15, 30, 45, or 60 minutes)
4. Add questions and multiple-choice options
5. Mark the correct answer for each question
6. Save the quiz to get a unique room code

### Taking a Quiz (Student)

1. Go to `/student`
2. Enter your name and the room code provided by your educator
3. Answer questions one by one
4. Submit your answers before time runs out
5. View your results and correct answers

### Viewing Results (Educator)

1. Access your quiz from the educator dashboard
2. View real-time statistics:
   - Number of students who have taken the quiz
   - Average score
   - Per-question performance analytics
   - Student leaderboard
3. Share the quiz with additional students using the room code

## 🔮 Future Enhancements

### AI Integration (Ready for Implementation)
- **AI Question Generation**: Integrate with OpenAI or other AI services to auto-generate questions based on topics
- **Smart Question Difficulty**: AI-powered difficulty adjustment based on student performance
- **Content Analysis**: AI analysis of quiz topics to suggest related questions

### Real-time Features
- **WebSocket Integration**: Live quiz sessions with real-time participant tracking
- **Live Leaderboards**: Real-time score updates during quiz sessions
- **Instant Notifications**: Push notifications for quiz start/end events

### Advanced Features
- **Question Types**: Support for true/false, fill-in-the-blank, and essay questions
- **Image Support**: Add images to questions and answer options
- **Quiz Templates**: Pre-built quiz templates for common subjects
- **Export Results**: Export quiz results to CSV/PDF formats
- **User Authentication**: Full user management with accounts and profiles

## 📁 Project Structure

```
quiz-generator/
├── src/
│   ├── app/
│   │   ├── api/                 # Next.js API routes
│   │   ├── educator/            # Educator pages
│   │   ├── student/             # Student pages
│   │   └── page.tsx             # Homepage
│   └── lib/
│       ├── db.ts                # Prisma client setup
│       └── utils.ts             # Utility functions
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons

---

**Ready to create engaging quizzes? Get started now!** 🎓✨
