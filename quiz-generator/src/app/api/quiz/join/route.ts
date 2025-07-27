import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomCode, studentName } = body;

    if (!roomCode || !studentName) {
      return NextResponse.json(
        { error: 'Room code and student name are required' },
        { status: 400 }
      );
    }

    // Find the quiz
    const quiz = await prisma.quiz.findUnique({
      where: { roomCode },
      select: {
        id: true,
        title: true,
        topic: true,
        duration: true,
        numQuestions: true,
        isActive: true,
        createdAt: true,
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    if (!quiz.isActive) {
      return NextResponse.json(
        { error: 'Quiz is no longer active' },
        { status: 400 }
      );
    }

    // Check if student already joined
    const existingStudent = await prisma.student.findUnique({
      where: {
        name_quizId: {
          name: studentName,
          quizId: quiz.id,
        }
      }
    });

    if (existingStudent) {
      return NextResponse.json({
        quiz,
        student: existingStudent,
        message: 'Welcome back!'
      });
    }

    // Create student record
    const student = await prisma.student.create({
      data: {
        name: studentName,
        quizId: quiz.id,
      }
    });

    return NextResponse.json({
      quiz,
      student,
      message: 'Successfully joined the quiz!'
    });
  } catch (error) {
    console.error('Error joining quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}