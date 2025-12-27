// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Error:', err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Customize error response structure
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFoundHandler };
