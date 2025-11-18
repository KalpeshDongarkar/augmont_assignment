import { Component } from '@angular/core';
import { ProductService } from '../../utils/core/services/product.service';

@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  constructor(private pdtService: ProductService) {}

  downloadReport() {
    const reqObj = {
      sheetname: 'Active_Product_Reports',
    };
    this.pdtService.download_rpt_product(reqObj).subscribe(
      (res: any) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reqObj.sheetname}.csv`;
        link.click();
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }
}
