export interface Page<T> {
    content: T[];
    page: PageDetails;
};

export interface PageDetails {
    size: number,
    number: number,
    totalElements: number,
    totalPages: number
};