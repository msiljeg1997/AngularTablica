import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
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
    No: ['', [Validators.required, Validators.maxLength(5), Validators.pattern("^[0-9]*$")]],
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
  this.dataService.getSalesLine().subscribe({
    next: data => {
      this.salesLines = data;
      console.log('Selected No:', no);
      console.log('Sales Lines:', this.salesLines);
      this.selectedNo = no;
      this.filteredSalesLines = this.salesLines.filter(sl => sl.DocumentNo === no);
      console.log('Filtered Sales Lines:', this.filteredSalesLines);
    },
    error: error => {
      console.error('Error occurred:', error);
    }
  })
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
  xmlDataStream += '<root>';
  xmlDataStream += '<SalesHeader>';
  xmlDataStream += `<No>${formValues.No}</No>`;
  xmlDataStream += `<BillToName>${formValues.BillToName}</BillToName>`;
  xmlDataStream += `<BillToAddress>${formValues.BillToAddress}</BillToAddress>`;
  xmlDataStream += `<ShipToName>${formValues.ShipToName}</ShipToName>`;
  xmlDataStream += `<ShipToAddress>${formValues.ShipToAddress}</ShipToAddress>`;
  xmlDataStream += `<DocumentType>${formValues.DocumentType}</DocumentType>`;
  xmlDataStream += '</SalesHeader>';
  xmlDataStream += '</root>';
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
  let errorMessage = 'Please correct the following errors:\n';
  Object.keys(this.insertForm.controls).forEach(key => {
    const control = this.insertForm.get(key);
    if (control) {
      if (control.errors != null) {
        const controlErrors: ValidationErrors = control.errors;
        Object.keys(controlErrors).forEach(keyError => {
          errorMessage += key + ' ' + keyError + ', ';
        });
      }
    }
  });
  alert(errorMessage);
}

}
}


