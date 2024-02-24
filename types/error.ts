class NoMatchId extends Error {
    response?: {
        data: any;
        status: number;
        headers: string;
     };
}

class CustomError extends Error{

}

export {NoMatchId, CustomError}