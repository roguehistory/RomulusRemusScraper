import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  VIDEOS;

  constructor(private DataService: DataService,private loadingCtrl: LoadingController) {}

  async processCSV(){
    let data = this.DataService.processCSV();
    console.log(data)
  }

  async getImage(id){
    this.DataService.getJSONbyID(id).subscribe(data => {
      return data.thumbnail
    });
  }
  
  gotoUrl(link){
    console.log(link)
    window.location.href = link;
  }

  async ngOnInit(){let loading = await this.loadingCtrl.create({
      message: 'Loading Data',
    });

    loading.present();

    this.DataService.getJSON().subscribe(async data => {
      this.VIDEOS = data;
      loading.dismiss()
      loading = await this.loadingCtrl.create({
        message: 'Loaded '+data.length+" records.",
        duration: 2000,
        spinner: null
      });
  
      loading.present();
    });
  }

}
