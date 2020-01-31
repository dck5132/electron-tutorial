import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private router: Router
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);

      let menu = this.electronService.remote.Menu.buildFromTemplate([{
        label: 'File',
        submenu: [{
          label: 'Open',
          click: () => {
            this.electronService.remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
          }
        },
        {
          label: 'Open Google',
          click: () => {
            this.electronService.ipcRenderer.send('google');
          }
        },
        {
          label: 'Open Auth Bin',
          click: () => {
            this.electronService.ipcRenderer.send('auth');
          }
        },
        {
          label: 'Open Child',
          click: () => {
            this.electronService.ipcRenderer.send('child');
          }
        }
      ]
      }])
      this.electronService.remote.Menu.setApplicationMenu(menu);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit () {
    console.log(this.router);
  }
}
