import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { InvoiceService } from './services/invoice.service';
import { Invoice } from './models/invoice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  invoiceForm: FormGroup;

  TotalBalance: number = 0;
  TotalBalanceAfterDiscount: number = 0;
  TotalTax: number;
  TotalShipping: number;
  TotalPaidBalance: number;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    // initialize reactive form
    this.initForm();
  }

  private initForm() {
    this.invoiceForm = new FormGroup({
      'CompanyName': new FormControl('', Validators.required),
      'CompanyAddress': new FormControl('', Validators.required),
      'StateZipCode': new FormControl('', Validators.required),
      'Date': new FormControl('', Validators.required),
      'ReceiptNO': new FormControl('', Validators.required),
      'BillContactName': new FormControl('', Validators.required),
      'BillClientCompanyName': new FormControl('', Validators.required),
      'BillAddress': new FormControl('', Validators.required),
      'BillPhone': new FormControl('', Validators.required),
      'BillEmail': new FormControl('', [Validators.required, Validators.email]),
      'ShipName': new FormControl('', Validators.required),
      'ShipClientCompanyName': new FormControl('', Validators.required),
      'ShipAddress': new FormControl('', Validators.required),
      'ShipPhone': new FormControl('', Validators.required),
      'Discount': new FormControl('', Validators.required),
      'TaxRate': new FormControl('', Validators.required),
      'Shipping': new FormControl('', Validators.required),
      'Remarks': new FormControl('',),
      'Items': new FormArray([
        new FormGroup({
          'Description': new FormControl('', Validators.required),
          'Quantity': new FormControl(0, [Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
          'UnitPrice': new FormControl(0, [Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
        }),
      ], Validators.required),
    });
  }

  // export values to json file
  createInvoice() {
    this.invoiceService.exportDataToJsonFile(this.invoiceForm.value).subscribe();
    console.log(this.invoiceForm.value);
  }

  // get value from json file and edit the form with this values
  importInputs() {
    this.invoiceService.importDataFromJsonFile().subscribe(
      (data: any) => {
        let items = new FormArray([], Validators.required);

        if(data['Items']) {
          for(let item of data.Items) {
            items.push(
              new FormGroup({
                'Description': new FormControl(item.Description, Validators.required),
                'Quantity': new FormControl(item.Quantity , [Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
                'UnitPrice': new FormControl(item.UnitPrice , [Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
              })
            );
          }
        }

        this.invoiceForm = new FormGroup({
          'CompanyName': new FormControl(data.CompanyName, Validators.required),
          'CompanyAddress': new FormControl(data.CompanyAddress, Validators.required),
          'StateZipCode': new FormControl(data.StateZipCode, Validators.required),
          'Date': new FormControl(data.Date, Validators.required),
          'ReceiptNO': new FormControl(data.ReceiptNO, Validators.required),
          'BillContactName': new FormControl(data.BillContactName, Validators.required),
          'BillClientCompanyName': new FormControl(data.BillClientCompanyName, Validators.required),
          'BillAddress': new FormControl(data.BillAddress, Validators.required),
          'BillPhone': new FormControl(data.BillPhone, Validators.required),
          'BillEmail': new FormControl(data.BillEmail, [Validators.required, Validators.email]),
          'ShipName': new FormControl(data.ShipName, Validators.required),
          'ShipClientCompanyName': new FormControl(data.ShipClientCompanyName, Validators.required),
          'ShipAddress': new FormControl(data.ShipAddress, Validators.required),
          'ShipPhone': new FormControl(data.ShipPhone, Validators.required),
          'Discount': new FormControl(data.Discount, Validators.required),
          'TaxRate': new FormControl(data.TaxRate, Validators.required),
          'Shipping': new FormControl(data.Shipping, Validators.required),
          'Remarks': new FormControl(data.Remarks,),
          'Items': items,
        });
      }
    );
  }


  // reset the form
  ResetInputs() {
    this.invoiceForm.reset();
    this.TotalBalance = 0;
    this.TotalBalanceAfterDiscount = 0;
    this.TotalTax = 0;
    this.TotalShipping = 0;
    this.TotalPaidBalance = 0;
  }

  // add new item to the invoice
  addNewItem() {
    const formGroup = new FormGroup({
      'Description': new FormControl('', Validators.required),
      'Quantity': new FormControl(0, [Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'UnitPrice': new FormControl(0, [Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
    });
    (<FormArray>this.invoiceForm.get('Items')).push(formGroup);
  }

  // delete item from invoice
  onDeleteItem(formGroupID: number) {
    (<FormArray>this.invoiceForm.get('Items')).removeAt(formGroupID);
  }

  // calculate subtotal
  calculateTotal() {
    let totalBalance: number = 0;
    //console.log(this.invoiceForm.value.Items);
      for(let item of this.invoiceForm.value.Items) {
        totalBalance =  totalBalance + ( parseFloat(item.Quantity) * parseFloat(item.UnitPrice));
      }
      return isNaN(totalBalance)? this.TotalBalance: this.TotalBalance = totalBalance;
  }

  // calculate subtotal after discount
  calculateTotalAfterDiscount() {
    return this.TotalBalanceAfterDiscount = this.TotalBalance - this.invoiceForm.value.Discount
  }


  // calculate total tax
  calculateTotalTax() {
    this.TotalTax = this.TotalBalanceAfterDiscount * (this.invoiceForm.value.TaxRate/100)
    this.TotalPaidBalance = this.TotalBalanceAfterDiscount + this.TotalTax;
    return this.TotalTax;
  }

  // calculate total shipping
  calculateTotalShipping() {
    return this.TotalPaidBalance = this.TotalPaidBalance + this.invoiceForm.value.Shipping;
  }

}
