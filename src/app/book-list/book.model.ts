import { Author } from "../author-list/author.model";
import { Member } from "../member-list/member.model";

export interface Book {
    id: number;
    title: string | null;
    isbn: string | null;
    createdAt: string | null;
    lastModifiedAt: string | null;
    borrowerId: number | null;
    authorId: number | null;
}