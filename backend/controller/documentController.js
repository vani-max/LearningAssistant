import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import Highlight from "../models/Highlight.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from '../utils/textChunker.js';
import fs from "fs/promises";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const { title } = req.body;
        if (!title) {
            await fs.unlink(req.file.path);
            return res.status(400).json({ message: "Title is required" });
        }

        const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            filePath: fileUrl,
            fileSize: req.file.size,
            status: 'processing'
        });

        processPDF(document._id, req.file.path).catch(error => {
            console.error("Error processing PDF:", error);
        });

        res.status(201).json({ message: "Document uploaded successfully", document });
    } catch (error) {
        console.error("Error uploading document:", error);
        res.status(500).json({ message: "Error uploading document" });
    }
};

const processPDF = async (documentId, filePath) => {
    try {
        const { text } = await extractTextFromPDF(filePath);
        const chunks = chunkText(text, 500, 50);
        await Document.findByIdAndUpdate(documentId, { status: 'ready', extractedText: text, chunks: chunks });
    } catch (error) {
        console.error("Error processing PDF:", error);
    }
};

export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: "flashcards",
                    localField: "_id",
                    foreignField: "documentId",
                    as: "flashcardSets"
                }
            },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "_id",
                    foreignField: "documentId",
                    as: "quizzes"
                }
            },
            {
                $addFields: {
                    flashcardCount: { $size: "$flashcardSets" },
                    quizCount: { $size: "$quizzes" }
                }
            }, {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0
                }
            },
            {
                $sort: { uploadDate: -1 }
            }
        ]);
        res.status(200).json({ documents });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: "Error fetching documents" });
    }
};

export const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        const flashcardCount = await Flashcard.countDocuments({ documentId: document._id, userId: req.user._id });
        const quizCount = await Quiz.countDocuments({ documentId: document._id, userId: req.user._id });

        document.lastAccessed = new Date();
        await document.save();
        const documentData = document.toObject();
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

        res.status(200).json({ document: documentData });
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ message: "Error fetching document" });
    }
};

export const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        const filename = document.filePath.split('/').pop();
        const localPath = path.join(__dirname, '../uploads/documents', filename);
        await fs.unlink(localPath).catch(err => {
            console.error("Error deleting document file:", err);
        });
        await document.deleteOne();

        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Error deleting document" });
    }
};
export const addHighlight = async (req, res, next) => {
    try {
        const { pageNumber, content, position, color, note } = req.body;
        const highlight = await Highlight.create({
            userId: req.user._id,
            documentId: req.params.id,
            pageNumber,
            content,
            position,
            color,
            note
        });
        res.status(201).json({ highlight });
    } catch (error) {
        console.error("Error adding highlight:", error);
        res.status(500).json({ message: "Error adding highlight" });
    }
};

export const getHighlights = async (req, res, next) => {
    try {
        const highlights = await Highlight.find({
            documentId: req.params.id,
            userId: req.user._id
        });
        res.status(200).json({ highlights });
    } catch (error) {
        console.error("Error fetching highlights:", error);
        res.status(500).json({ message: "Error fetching highlights" });
    }
};

export const deleteHighlight = async (req, res, next) => {
    try {
        const highlight = await Highlight.findOneAndDelete({
            _id: req.params.highlightId,
            userId: req.user._id
        });
        if (!highlight) {
            return res.status(404).json({ message: "Highlight not found" });
        }
        res.status(200).json({ message: "Highlight deleted" });
    } catch (error) {
        console.error("Error deleting highlight:", error);
        res.status(500).json({ message: "Error deleting highlight" });
    }
};

import Note from "../models/Note.js";

export const addNote = async (req, res, next) => {
    try {
        const { pageNumber, content } = req.body;
        const note = await Note.create({
            userId: req.user._id,
            documentId: req.params.id,
            pageNumber,
            content
        });
        res.status(201).json({ note });
    } catch (error) {
        console.error("Error adding note:", error);
        res.status(500).json({ message: "Error adding note" });
    }
};

export const getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({
            documentId: req.params.id,
            userId: req.user._id
        }).sort({ createdAt: -1 });
        res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Error fetching notes" });
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.noteId,
            userId: req.user._id
        });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Error deleting note" });
    }
};

export const updateNote = async (req, res, next) => {
    try {
        const { content } = req.body;
        const note = await Note.findOneAndUpdate({
            _id: req.params.noteId,
            userId: req.user._id
        }, { content, updatedAt: Date.now() }, { new: true });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ note });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: "Error updating note" });
    }
};

export const searchDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { query } = req.query;

        if (!query) return res.status(400).json({ message: "Query is required" });

        const document = await Document.findOne({ _id: id, userId: req.user._id });
        if (!document) return res.status(404).json({ message: "Document not found" });

        // Simple Regex Search on Chunks
        // Note: For large scale, use MongoDB Text Index or Atlas Search
        const regex = new RegExp(query, 'i');
        const results = document.chunks
            .filter(chunk => regex.test(chunk.content))
            .map(chunk => ({
                chunkIndex: chunk.chunkIndex,
                pageNumber: chunk.pageNumber,
                // Return a snippet around the match
                snippet: getSnippet(chunk.content, query),
                matchCount: (chunk.content.match(regex) || []).length
            }));

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error searching document:", error);
        res.status(500).json({ message: "Error searching document" });
    }
};

const getSnippet = (text, query) => {
    const regex = new RegExp(query, 'i');
    const match = text.match(regex);
    if (!match) return text.substring(0, 100) + '...';

    const index = match.index;
    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + query.length + 40);

    return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
};
