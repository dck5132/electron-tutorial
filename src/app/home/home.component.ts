import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  versions = [
    {versionName: 'node', versionNumber: process.versions.node},
    {versionName: 'electron', versionNumber: process.versions.electron},
    {versionName: 'chrome', versionNumber: process.versions.chrome}
  ];


  constructor() { }

  ngOnInit(): void { }

}
