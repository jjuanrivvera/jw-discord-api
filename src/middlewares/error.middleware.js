module.exports = (err, req, res, _next) => {
    const httpStatus = err.status || 500;

    // Log all errors for debugging
    console.error('API Error:', {
        status: httpStatus,
        message: err.message,
        path: req.path,
        stack: err.stack
    });

    return res.status(httpStatus).send({
        status: httpStatus,
        message: err.message || 'Internal server error'
    });
};
