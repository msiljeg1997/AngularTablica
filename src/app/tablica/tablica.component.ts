import { Component } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-tablica',
  templateUrl: './tablica.component.html',
  styleUrls: ['./tablica.component.css']
})
export class TablicaComponent {
  salesHeader: any[] = [];
  salesLines: any[] = [];
  selectedNo: string;
  filteredSalesLines!: any[];
  displayedSalesHeader: any[];
  showAllRows: boolean = false;

constructor(private dataService: DataService) {
  this.filteredSalesLines = [];
  this.selectedNo = '';
  this.displayedSalesHeader = [];
}

ngOnInit() {
  this.dataService.getSalesHeader().subscribe({
    next: data => {
      this.salesHeader = data;
      this.updateDisplayedSalesHeader();
    },
    error: error => {
      console.error('Error occurred:', error);
    }
  });

  this.dataService.getSalesLine().subscribe({
    next: data => {
      this.salesLines = data;
    },
    error: error => {
      console.error('Error occurred:', error);
    }
  }); 
}


updateDisplayedSalesHeader() {
  this.displayedSalesHeader = this.showAllRows ? this.salesHeader : this.salesHeader.slice(0, 5);
}

toggleShowAll() {
  this.showAllRows = !this.showAllRows;
  this.updateDisplayedSalesHeader();
}


selectNo(no: string) {
  this.selectedNo = no;
  this.filteredSalesLines = this.salesLines.filter(sl => sl.DocumentNo === no);
  console.log(this.filteredSalesLines); 
 
}



}


