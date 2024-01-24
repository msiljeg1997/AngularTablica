import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
  originalSalesHeader: any;
  insertForm!: FormGroup;
  showInsertForm = false;

constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient) {
  this.filteredSalesLines = [];
  this.selectedNo = '';
  this.displayedSalesHeader = [];
}

ngOnInit() {
  this.insertForm = this.fb.group({
    No: ['', Validators.required],
    BillToName: ['', Validators.required],
    BillToAddress: ['', Validators.required],
    ShipToName: ['', Validators.required],
    ShipToAddress: ['', Validators.required],
    DocumentType: ['', Validators.required]
  });

  this.dataService.getSalesHeader().subscribe({
    next: data => {
      this.salesHeader = data.map((item: any) => ({ ...item, editMode: false }));
      this.updateDisplayedSalesHeader();
    },
    error: error => {
      console.error('Error occurred:', error);
    }
  });
};




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
    this.dataService.updateSalesHeader(noAsInt, { ...salesHeaderWithoutNo, DocumentType: this.originalSalesHeader.DocumentType }).subscribe({
      next: () => {
        console.log('Updejtano');
        salesHeader.editMode = false; 
      },
      error: (error: any) => {
        console.error('Error neki jbg:', error);
      }
    });
  } else {
    this.originalSalesHeader = { ...salesHeader };
    salesHeader.editMode = true; 
  }
}

deleteRow(no: string, DocumentType: string) {
  const noAsInt = parseInt(no, 10);
  this.dataService.deleteSalesHeader(noAsInt, DocumentType).subscribe({
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


onSubmit() {

  const formValues = this.insertForm.value;
  let xmlDataStream = '';
  xmlDataStream += '<SalesHeader>';
  xmlDataStream += `<No>${formValues.No}</No>`;
  xmlDataStream += `<BillToName>${formValues.BillToName}</BillToName>`;
  xmlDataStream += `<BillToAddress>${formValues.BillToAddress}</BillToAddress>`;
  xmlDataStream += `<ShipToName>${formValues.ShipToName}</ShipToName>`;
  xmlDataStream += `<ShipToAddress>${formValues.ShipToAddress}</ShipToAddress>`;
  xmlDataStream += `<DocumentType>${formValues.DocumentType}</DocumentType>`;
  xmlDataStream += '</SalesHeader>';
  console.log(xmlDataStream);

  this.http.post('http://localhost:5161/api/BCCommunication/api/dodajNoviSH', xmlDataStream, {
    responseType: 'text',
    headers: new HttpHeaders().set('Content-Type', 'application/xml')
}).subscribe({
    next: (response) => {
        console.log('Poslano!:', response);
    },
    error: (error) => {
        console.error('Nije poslano jer =>:', error);
        console.log(xmlDataStream);
    }
});


  if (this.insertForm.valid) {
    this.salesHeader.push(this.insertForm.value);
    this.insertForm.reset();
    this.showInsertForm = false;
  } else {
    alert('All fields are mandatory');
  }
}

}


