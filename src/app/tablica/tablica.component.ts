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
      this.salesHeader = data.map((item: any) => ({ ...item, editMode: false }));
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

editRow(salesHeader: any) {
  if (salesHeader.editMode) {
    const { No, ...salesHeaderWithoutNo } = salesHeader;
    const noAsInt = parseInt(No, 10);
    this.dataService.updateSalesHeader(noAsInt, salesHeaderWithoutNo).subscribe({
      next: () => {
        console.log('Updejtano');
        salesHeader.editMode = false; 
      },
      error: (error: any) => {
        console.error('Error neki jbg:', error);
      }
    });
  } else {
    salesHeader.editMode = true; 
  }
}

deleteRow(no: string) {
  const noAsInt = parseInt(no, 10);
  this.dataService.deleteSalesHeader(noAsInt).subscribe({
    next: () => {
      console.log('Sales header deleted successfully');
      // Remove the deleted sales header from the local data
      this.salesHeader = this.salesHeader.filter(sh => sh.No !== no);
      this.updateDisplayedSalesHeader();
    },
    error: (error: any) => {
      console.error('Error occurred:', error);
    }
  });
}

}


