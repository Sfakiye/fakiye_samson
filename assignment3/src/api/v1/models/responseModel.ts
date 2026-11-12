export interface ApiResponse<T> {
    message: string;
    data?: T;
}

export const successResponse = <T>(
    data: T,
    message: string
): ApiResponse<T> => ({
    message,
    data,
});

export const messageResponse = (message: string): ApiResponse<null> => ({
    message,
});