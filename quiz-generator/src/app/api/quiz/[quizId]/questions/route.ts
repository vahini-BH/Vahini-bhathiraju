import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const body = await request.json();
    const { questions } = body;
    const { quizId } = params;

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Questions array is required' },
        { status: 400 }
      );
    }

    // Verify quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Delete existing questions and create new ones
    await prisma.question.deleteMany({
      where: { quizId }
    });

    const questionData = questions.map((q: any, index: number) => ({
      quizId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      order: index + 1,
    }));

    const createdQuestions = await prisma.question.createMany({
      data: questionData,
    });

    return NextResponse.json({ 
      message: 'Questions added successfully',
      count: createdQuestions.count 
    });
  } catch (error) {
    console.error('Error adding questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = params;

    const questions = await prisma.question.findMany({
      where: { quizId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        options: true,
        order: true,
        // Don't include correctAnswer in student responses
      }
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}