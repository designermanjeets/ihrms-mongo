import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ihrms-search',
  templateUrl: './ihrms-search.component.html',
  styleUrls: ['./ihrms-search.component.scss']
})
export class IhrmsSearchComponent implements OnInit {

  value = '';
  hide = true;

  @Input() placeholder: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
