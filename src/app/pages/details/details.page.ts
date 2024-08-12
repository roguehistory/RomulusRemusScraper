import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, UrlSerializer } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import * as _ from 'underscore/underscore'

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public data;
  public VIDEOS;
  public RECORD;
  public COMMENTS;
  public DETAILS;

  constructor(private route:ActivatedRoute,private DataService:DataService) { }

  getURL(id){
    console.log(id)
    let link = "https://www.youtube.com/embed/"+id
    return link;
  }

  ngOnInit() {
    let myID;
    this.route.paramMap.subscribe(params => { 
      console.log(params.get('data'))
      myID = params.get('data');
    });
    this.DataService.getJSON().subscribe(data => {
      this.RECORD = _.findWhere(data,{id:myID});
      console.log('DETAILS:',this.RECORD);
    });
    this.DataService.getJSONbyID(myID).subscribe(data => {
      // console.log("COMMENTS:",data.comment_response)
      console.log("Video Details:",data.video_description)
      this.DETAILS = data.video_description;
    });
    
  }

}
