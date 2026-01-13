
/**
 * Chunk text into smaller pieces.
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlap
 * @returns {Array<string>}
 */

import { query } from "express-validator";

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || typeof text !== 'string') {
        throw new Error("Invalid input: text must be a non-empty string");
    }

    const cleanedText = text.replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .replace(/ \n/g, '\n')
    .replace(/\r\n/g, '\n')
    .trim();

    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currChunk = [];
    let currWordCount = 0;
    let chunkIndex = 0;

    for(const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;
        if(paragraphWordCount > chunkSize) {
            if(currChunk.length>0){
                chunks.push({
                    content: currChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber : 0
                });
                currChunk = [];
                currWordCount = 0;
            }

            for(let i=0; i<paragraphWords.length; i+=(chunkSize-overlap)) {
               const chunkWords = paragraphWords.slice(i, i + chunkSize);
               chunks.push({
                   content: chunkWords.join(' '),
                   chunkIndex: chunkIndex++,
                   pageNumber : 0
               });

               if(i+chunkSize >= paragraphWords.length) break;
            }
            continue;
        }

        if(currWordCount + paragraphWordCount > chunkSize && currChunk.length>0) {
            chunks.push({
                content: currChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber : 0
            });
            const prevChunkText = currChunk.join(' ');
            const prevWords = prevChunkText.split(/\s+/);
            const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

            currChunk = [overlapText, paragraph.trim()];
            currWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
        }else{
            currChunk.push(paragraph.trim());
            currWordCount += paragraphWordCount;
        }
    }

    if(currChunk.length > 0) {
        chunks.push({
            content: currChunk.join('\n\n'),
            chunkIndex: chunkIndex,
            pageNumber : 0
        });
    }

    if(chunks.length === 0 && cleanedText.length > 0) {
        const allWords = cleanedText.split(/\s+/);
        for(let i=0; i<allWords.length; i+=(chunkSize-overlap)) {
            const chunkWords = allWords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber : 0
            });

            if(i+chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};

/**
 * @param {Array<Object>} chunks
 * @param {String} query
 * @param {Number} maxChunks
 * @returns {Array<Object>}
 */

export const findRelevantChunks = (chunks, query, maxChunks=3) => {
    if(!chunks || chunks.length==0 || !query) return [];

    const stopWords = new Set(["the", "is", "in", "and", "to", "a", "which", "on", "an", "but", "with", "it"]);
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => !stopWords.has(word) && word.length>2);

    if(queryWords.length==0){
        return chunks.slice(0, maxChunks).map(chunk => ({ content: chunk.content, chunkIndex: chunk.chunkIndex, pageNumber: chunk.pageNumber, _id : chunk._id }));
    };

    const scoredChunks = chunks.map(chunk => {
        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;
        let score=0
        for(const word of queryWords) {
            const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
            score += exactMatches*3;

            const partialMatches = (content.match(new RegExp(`${word}`, 'g')) || []).length;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        const uniqueWordsFound = queryWords.filter(word => content.includes(word)).length;
        if(uniqueWordsFound>1){
            score += uniqueWordsFound * 2;
        }

        const normalizedScore = score / Math.sqrt(contentWords);
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore : score,
            matchedWords: uniqueWordsFound
        }
    })

    return scoredChunks.filter(chunk => chunk.score > 0)
    .sort((a, b) => {
        if(b.score !== a.score){
            return b.score - a.score;
        }if(b.matchedWords !== a.matchedWords){
            return b.matchedWords - a.matchedWords;
        }
        return a.chunkIndex - b.chunkIndex;
    }).slice(0, maxChunks);
};
