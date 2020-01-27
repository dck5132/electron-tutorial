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
    this.electronService.ipcRenderer.on(path, (event, arg) => {
      console.log(this.router);
      this.ngZone.run(() => {
        console.log(event);
        console.log(arg);
        console.log(this.router);
        this.router.navigate(['/' + path]);
      })
    });
   }
}
