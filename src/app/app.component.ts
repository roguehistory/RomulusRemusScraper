import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentUser: any;
  totalCollections;
  osStream = [];
  appPages = [];
  labels = [];

  constructor(
    public platform: Platform) {
    this.platform.ready().then(async () => {
      console.log("platform is ready!")
    })
  }

  async ngOnInit() {
    this.appPages = [
      {
        title: 'List View',
        url: '/list',
        icon: 'list'
      },{
        title: 'Upload CSV',
        url: '/upload',
        icon: 'images',
      },{
        title: 'Readme',
        url: '/readme',
        icon: 'eye'
      }

    ];

  }

}
