import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    pageNumber: {
        type: Number,
        required: true,
    },
    content: { 
        type: String,
        required: false,
    },
    position: { 
        boundingRect: {
            x1: Number,
            y1: Number,
            x2: Number,
            y2: Number,
            width: Number,
            height: Number
        },
        rects: [{ 
            x1: Number,
            y1: Number,
            x2: Number,
            y2: Number,
            width: Number,
            height: Number
        }]
    },
    color: {
        type: String,
        default: '#ffeb3b', 
    },
    note: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Highlight = mongoose.model('Highlight', highlightSchema);
export default Highlight;
