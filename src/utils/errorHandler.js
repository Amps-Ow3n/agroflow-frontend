export function getErrorMessage(error){

    return (
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Something went wrong"
    );

}