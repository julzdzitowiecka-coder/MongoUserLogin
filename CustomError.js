/**
 * Custom Error Class: ValidationError
 *
 * Represents an error that occurs when validation fails.
 * Inherits from the built-in Error class.
 */
class ValidationError extends Error {
    constructor(message) {
        // Call the constructor of the parent class (Error)
        super(message);

        // Custom properties for the ValidationError
        this.code = 407; // Custom error code
        this.name = "ValidationError"; // Custom error name
    }
}

/**
 * Custom Error Class: InvalidUserError
 *
 * Represents an error that occurs when dealing with an invalid user.
 * Inherits from the built-in Error class.
 */
class InvalidUserError extends Error {
    constructor(message) {
        // Call the constructor of the parent class (Error)
        super(message);

        // Custom properties for the InvalidUserError
        this.code = 407; // Custom error code
        this.name = "InvalidUserError"; // Custom error name
    }
}

/**
 * Custom Error Class: AuthenticationFailed
 *
 * Represents an error that occurs when authentication fails.
 * Inherits from the built-in Error class.
 */
class AuthenticationFailed extends Error {
    constructor(message) {
        // Call the constructor of the parent class (Error)
        super(message);

        // Custom properties for the AuthenticationFailed error
        this.code = 407; // Custom error code
        this.name = "AuthenticationFailed"; // Custom error name
    }
}

module.exports = { ValidationError, InvalidUserError, AuthenticationFailed};
