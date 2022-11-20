const createError = require("http-errors");

function notFoundHandler(req,res,next) {
    next(createError(404,"Your requested content was not found!"));
}

function errorHandler(err,req,res,next) {
    console.log(err,"err fina");
    res.status(err.status || 500)
    .json({status:err.status || 500, message:err.message})
}

module.exports = {
    notFoundHandler,
    errorHandler
}

