import Quiz from "../models/Quiz.js";
import Document from "../models/Document.js";

export const createQuiz = async (req, res, next) => {
    try {
        const { documentId, title, questions } = req.body;

        // Basic validation
        if (!questions || questions.length === 0) {
            return res.status(400).json({ success: false, error: "Questions are required" });
        }

        const quiz = await Quiz.create({
            userId: req.user.id,
            documentId,
            title,
            questions,
            totalQuestions: questions.length,
            score: 0,
            userAnswers: [] // Initially empty
        });

        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
};

export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            documentId: req.params.documentId,
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        next(error);
    }
};

export const getQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user.id });
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });

        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
};

export const submitQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { answers } = req.body; // Array of { questionIndex, selectedAnswer }

        const quiz = await Quiz.findOne({ _id: id, userId: req.user.id });
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });

        let score = 0;
        const userAnswers = answers.map(ans => {
            const question = quiz.questions[ans.questionIndex];
            // Simple string comparison for now
            const isCorrect = question.correctAnswer === ans.selectedAnswer;
            if (isCorrect) score++;

            return {
                questionIndex: ans.questionIndex,
                selectedAnswer: ans.selectedAnswer,
                isCorrect
            };
        });

        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = Date.now();
        await quiz.save();

        res.status(200).json({ success: true, data: quiz, score, total: quiz.totalQuestions });
    } catch (error) {
        next(error);
    }
};

export const deleteQuiz = async (req, res, next) => {
    try {
        await Quiz.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.status(200).json({ success: true, message: "Quiz deleted" });
    } catch (error) {
        next(error);
    }
};
