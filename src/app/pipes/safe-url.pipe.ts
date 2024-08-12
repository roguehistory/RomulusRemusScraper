import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {
  url: '';
  constructor(
    private sanitizer: DomSanitizer,
    ) { }
  
    transform(url) {
      console.log(url)
      return this.sanitizer.bypassSecurityTrustStyle(url);
    }

}
