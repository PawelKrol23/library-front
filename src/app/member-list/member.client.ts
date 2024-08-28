import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Member } from "./member.model";
import { MemberFilters } from "./member-filter-form/member-filter-form.component";
import { Page } from "../shared/Page.model";

export interface MemberData {
    lastName: string,
    firstName: string,
    email: string,
}

@Injectable({ providedIn: "root" })
export class MemberClient {
    readonly serverAddress = 'http://localhost:8080';

    constructor(private http: HttpClient) {
    }

    getAllMembers(membersFilters: MemberFilters): Observable<Member[]> {
        return this.http.get<Member[]>(
            this.serverAddress + '/members/all',
            {
                params: {
                    ...membersFilters
                }
            }
        );
    }

    getMembersPage(membersFilters: MemberFilters, page: number): Observable<Page<Member>> {
        return this.http.get<Page<Member>>(
            this.serverAddress + '/members',
            {
                params: {
                    ...membersFilters,
                    page: page
                }
            }
        );
    }
    
    getMembersInCsv(membersFilters: any) {
        return this.http.get<string>(
            this.serverAddress + '/members/csv',
            {
                observe: 'response',
                responseType: "text" as "json",
                params: membersFilters
            }
        );
    }

    uploadMembersInCsv(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(
            this.serverAddress + '/members/csv',
            formData
        );
    }

    getMembersInExcel(membersFilters: any) {
        return this.http.get(
            this.serverAddress + '/members/excel',
            {
                observe: 'response',
                responseType: "blob" as "json",
                params: membersFilters
            }
        );
    }

    uploadMembersInExcel(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(
            this.serverAddress + '/members/excel',
            formData
        );
    }

    getMemberById(memberId: number) {
        return this.http.get<Member>(
            this.serverAddress + `/members/${memberId}`
        );
    }

    updateMember(memberId: number, memberData: MemberData) {
        return this.http.put(
            this.serverAddress + `/members/${memberId}`,
            memberData
        )
    }

    deleteMember(memberId: number) {
        return this.http.delete(
            this.serverAddress + `/members/${memberId}`
        );
    }

    addNewMember(memberData: MemberData) {
        return this.http.post(
            this.serverAddress + '/members',
            memberData
        )
    }
}