/**
 * @desc This file contain Success and Error response for sending to client / user
 */

/**
 * @desc Send any success response
 *
 * @param {string} message
 * @param {object | array} results
 * @param {number} statusCode
 */
exports.success = (message, result, statusCode) => {
    return {
        error: false,
        statusCode,
        message,
        result
    };
};

/**
 * @desc Send any error response
 *
 * @param {string} message
 * @param {number} statusCode
 */
exports.error = (message, statusCode) => {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];

    // Get matched code
    const findCode = codes.find((code) => code === statusCode);

    if (!findCode) statusCode = 500;
    else statusCode = findCode;

    //log
    console.log("Error returned from API: ", message);

    return {
        error: true,
        statusCode,
        message
    };
};

/**
 * @desc Send any validation response
 *
 * @param {object | array} errors
 */
exports.validation = (message, errors) => {
    return {
        error: true,
        statusCode: 422,
        message,
        errors
    };
};