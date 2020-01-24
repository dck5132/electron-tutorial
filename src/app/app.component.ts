import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService
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
        }
      ]
      }])
      this.electronService.remote.Menu.setApplicationMenu(menu);
    } else {
      console.log('Mode web');
    }
  }
}
