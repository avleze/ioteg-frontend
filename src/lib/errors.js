export function getErrors(error) {
    let errors = {};

    error.response.data["subErrors"].forEach(error => {
        errors[error.field] = error.message;
    });

    return errors;
}