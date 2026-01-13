import e from "express";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if(err.name === 'CastError') {
        statusCode = 404;
        message = 'Resource not found';
    }

    if(err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        statusCode = 400;
        message = `${field} already exists`;
    }
    
    if(err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(value => value.message).join(', ');
    }

    if(err.code==='LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = 'File size is too large';
    }

    if(err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if(err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }

    console.log('Error:', { message, statusCode, stack: err.stack });

    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode: statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
