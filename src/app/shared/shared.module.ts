import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MarkdownModule.forRoot({
      markedOptions: {
       provide: MarkedOptions,
       useValue: {
         sanitze: true
       } 
      }
  })
  ],
  exports: [TranslateModule, WebviewDirective, FormsModule, MarkdownModule]
})
export class SharedModule {}
