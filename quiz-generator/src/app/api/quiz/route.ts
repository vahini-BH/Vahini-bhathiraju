import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRoomCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, topic, duration, numQuestions, createdBy } = body;

    if (!title || !topic || !duration || !numQuestions || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique room code
    let roomCode = generateRoomCode();
    let existingQuiz = await prisma.quiz.findUnique({
      where: { roomCode }
    });

    // Ensure room code is unique
    while (existingQuiz) {
      roomCode = generateRoomCode();
      existingQuiz = await prisma.quiz.findUnique({
        where: { roomCode }
      });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        topic,
        roomCode,
        duration: parseInt(duration),
        numQuestions: parseInt(numQuestions),
        createdBy,
      },
    });

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get('roomCode');
    const createdBy = searchParams.get('createdBy');

    if (roomCode) {
      // Get specific quiz by room code (or quiz ID for educator access)
      let quiz;
      
      // Check if roomCode is actually a quiz ID (for educator access)
      if (roomCode.length > 6) {
        quiz = await prisma.quiz.findUnique({
          where: { id: roomCode },
          include: {
            questions: {
              orderBy: { order: 'asc' }
            },
            _count: {
              select: {
                responses: {
                  where: {
                    selectedAnswer: { not: null }
                  }
                }
              }
            }
          }
        });
      } else {
        // Standard room code lookup
        quiz = await prisma.quiz.findUnique({
          where: { roomCode },
          include: {
            questions: {
              orderBy: { order: 'asc' }
            },
            _count: {
              select: {
                responses: {
                  where: {
                    selectedAnswer: { not: null }
                  }
                }
              }
            }
          }
        });
      }

      if (!quiz) {
        return NextResponse.json(
          { error: 'Quiz not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ quiz });
    }

    if (createdBy) {
      // Get all quizzes created by a specific educator
      const quizzes = await prisma.quiz.findMany({
        where: { createdBy },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              questions: true,
              responses: {
                where: {
                  selectedAnswer: { not: null }
                }
              }
            }
          }
        }
      });

      return NextResponse.json({ quizzes });
    }

    return NextResponse.json(
      { error: 'Missing roomCode or createdBy parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}