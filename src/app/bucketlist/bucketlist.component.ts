import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { BucketlistService } from './bucketlist.service';
import { IBucketlist } from './bucketlist';
import { LoginService } from '../auth/login/login.service';

@Component({
  moduleId: module.id,
  templateUrl: 'bucketlist.component.html',
  styleUrls: ['./bucketlist.component.css']
})

export class BucketlistComponent implements OnInit {
  model: any = {};
  pageTitle: string = 'Bucketlist';
  errorMessage: string;

  bucketlists: IBucketlist[];

  constructor(
    private loginService: LoginService,
    private bucketlistService: BucketlistService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService) {}

// pass the data of the current bucketlist
getModalValues(bucketlist_id, title, description) {
    this.model.bucketlist_id = bucketlist_id;
    this.model.title = title
    this.model.description = description
  }

  ngOnInit(): void {
      if (this.loginService.isLoggedIn()) {
            this.router.navigate(['/bucketlists']);
            } else {
            this.router.navigate(['/auth/login']);
            }

           this.bucketlistService.getBuckelists()
                     .subscribe(
                       bucketlists => this.bucketlists = bucketlists.bucketlists,
                       error =>  this.errorMessage = <any>error);
    }
    // creates a new bucketlist
    createBucketlist(): void{
        this.bucketlistService.createBucketlist(this.model)
            .subscribe(
                data => { console.log(data)
                    if(data.json().message === 'Bucketlist with that title already exists'){
                        this.errorMessage = 'Bucketlist with that title already exists';
                        //  this._flashMessagesService.show('Bucketlist with that title already exists', { timeout: 10000 });
                         this.router.navigate(['/bucketlists']);
                    }
                    else{
                        this.router.navigate(['/bucketlists']);
                        this._flashMessagesService.show('Bucketlist Created Succesfully!!!', { timeout: 5000 });
                    }
                },
                );
                 window.location.reload();
    }

    // update a bucketlist 
    updateBucketlist(): void{
        this.bucketlistService.updateBucketlist(this.model)
            .subscribe(
                data => { console.log(data)},
                (error) => { console.log(error)}
            );
            window.location.reload();
    }

    // delete a bucketlist
    deleteBucketlist(){
        this.bucketlistService.deleteBucketlist(this.model)
        .subscribe(
            data => { data },
            (error) => { error}
        );
        window.location.reload(true);
    }
}