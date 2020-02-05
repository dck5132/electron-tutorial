import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from './electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private electronService: ElectronService
  ) {
    console.log('Navigation Service Initialized');
   }

   navigate(path: string) {
    console.log(path);
    console.log('/' + path);  
    this.router.navigate(['/' + path]);
   }
}

