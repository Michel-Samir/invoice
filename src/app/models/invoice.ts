import { Item } from './item';

export class Invoice {
    constructor(private CompanyName: string,
                private CompanyAddress: string,
                private StateZipCode: string,
                private Date: Date,
                private ReceiptNO: number,
                private BillContactName: string,
                private BillClientCompanyName: string,
                private BillAddress: string,
                private BillPhone: number,
                private BillEmail: string,
                private ShipName: string,
                private ShipClientCompanyName: string,
                private ShipAddress: string,
                private ShipPhone: number,
                private Items: Item,
                private Discount: number,
                private TaxRate: number,
                private Shipping: number,
                private Remarks?: string) {}
}