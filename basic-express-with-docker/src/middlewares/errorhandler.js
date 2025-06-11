import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statuscode = err.statuscode || 400;
        const message = error.message || "Something went wrong";
        error = new ApiError(statuscode, message, error?.errors || [], err.stack);
    }
    console.log(error);
    return res.status(error.statuscode).json({ ...error, message: error.message });
};

export { errorHandler };