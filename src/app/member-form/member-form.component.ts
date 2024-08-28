import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberClient } from '../member-list/member.client';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.css'
})
export class MemberFormComponent implements OnInit {
  memberId = -1;
  memberForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
  });

  constructor(
    private memberClient: MemberClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const memberIdString = paramMap.get('id');
      if(!memberIdString) {
        this.memberId = -1;
        return;
      }
      const memberId = +memberIdString;
      if(!memberId) {
        this.memberId = -1;
        return;
      }

      this.memberClient.getMemberById(memberId).subscribe(responseData => {
        this.memberId = responseData.id;
        this.memberForm.patchValue({
          firstName: responseData.firstName,
          lastName: responseData.lastName,
          email: responseData.email
        });
      });
    });
  }

  onSubmit() {
    if(this.memberForm.invalid) {
      return;
    }
    const firstName = this.memberForm.value.firstName as unknown as string;
    const lastName = this.memberForm.value.lastName as unknown as string;
    const email = this.memberForm.value.email as unknown as string;
    const memberData = {
      firstName: firstName,
      lastName: lastName,
      email: email
    }

    if(this.memberId === -1) {
      this.memberClient.addNewMember(memberData).subscribe(response => {
        this.router.navigate(['/members']);
      });
    } else {
      this.memberClient.updateMember(this.memberId, memberData).subscribe(response => {
        this.router.navigate(['/members']);
      });
    }
  }
}
