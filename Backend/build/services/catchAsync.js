"use strict";
//Global function to reduce use of try catch error handling
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (fn) => {
    return (req, res) => {
        fn(req, res).catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: "Internal Error",
                errorMessage: err.message,
            });
        });
    };
};
exports.default = errorHandler;
