import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const body = await request.json();
    const { questionId, studentName, selectedAnswer } = body;
    const { quizId } = params;

    if (!questionId || !studentName || selectedAnswer === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the question to check correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const isCorrect = selectedAnswer === question.correctAnswer;

    // Upsert response (update if exists, create if doesn't)
    const response = await prisma.response.upsert({
      where: {
        quizId_questionId_studentName: {
          quizId,
          questionId,
          studentName,
        }
      },
      update: {
        selectedAnswer,
        isCorrect,
        submittedAt: new Date(),
      },
      create: {
        quizId,
        questionId,
        studentName,
        selectedAnswer,
        isCorrect,
      },
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error submitting response:', error);
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
    const { searchParams } = new URL(request.url);
    const studentName = searchParams.get('studentName');
    const { quizId } = params;

    if (studentName) {
      // Get responses for a specific student
      const responses = await prisma.response.findMany({
        where: { quizId, studentName },
        include: {
          question: {
            select: {
              question: true,
              options: true,
              correctAnswer: true,
            }
          }
        },
        orderBy: {
          question: {
            order: 'asc'
          }
        }
      });

      return NextResponse.json({ responses });
    } else {
      // Get all responses for the quiz (for educator view)
      const responses = await prisma.response.findMany({
        where: { quizId },
        include: {
          question: {
            select: {
              question: true,
              options: true,
              correctAnswer: true,
              order: true,
            }
          }
        },
        orderBy: [
          { studentName: 'asc' },
          { question: { order: 'asc' } }
        ]
      });

      return NextResponse.json({ responses });
    }
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}