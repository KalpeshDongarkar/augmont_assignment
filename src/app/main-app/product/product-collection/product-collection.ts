import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FeatureHeader } from '../../../utils/shared-components/feature-header/feature-header';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../utils/core/services/category.service';
import { ProductService } from '../../../utils/core/services/product.service';
import { SharedSingletonTable } from '../../../utils/shared-components/shared-singleton-table/shared-singleton-table';
import { Environment } from '../../../environment/environment';

@Component({
  selector: 'app-product-collection',
  imports: [
    CommonModule,
    NgbModule,
    FeatureHeader,
    FormsModule,
    ReactiveFormsModule,
    SharedSingletonTable,
  ],
  templateUrl: './product-collection.html',
  styleUrl: './product-collection.scss',
})
export class ProductCollection implements OnInit, OnDestroy {
  @ViewChild('addeditproduct', { read: TemplateRef }) addeditproduct: TemplateRef<any> | undefined;
  productForm!: FormGroup;
  isEdit: boolean = false;
  editPrd: any;
  prdDataCount: number = 0;
  uniqId: string = 'prd_id';
  catDropList: any[] = [];
  prdTblData: any[] = [];
  prdDefHeaders: any[] = [];
  currentPage: number = 1;
  pageSize: any = 10;
  filetype: string = 'xlsx';
  btnArrList: any = [
    {
      btnToolTip: 'Edit',
      btnIconClass: 'fa fa-pencil',
      btnFn: 'editPrdForm',
    },
    {
      btnToolTip: 'Delete',
      btnIconClass: 'fa fa-trash',
      btnFn: 'delProduct',
    },
  ];
  exelfiles!: FileList;

  validationMessage: any = {
    prdName: [{ type: 'required', message: 'Product Name is required' }],
    prdPrice: [{ type: 'required', message: 'Product Price is required' }],
    prdCattype: [{ type: 'required', message: 'Product Category is required' }],
    prdDescrptn: [{ type: 'required', message: 'Product Description is required' }],
  };
  imagesList: any[] = [];
  baseUrl: string = Environment.IMGBASE_URL;

  constructor(
    private readonly modalService: NgbModal,
    private catService: CategoryService,
    private pdtService: ProductService
  ) {}

  ngOnInit() {
    this.productForm = new FormGroup({
      prdName: new FormControl('', [Validators.required]),
      prdPrice: new FormControl('', [Validators.required]),
      prdCattype: new FormControl('', [Validators.required]),
      prdDescrptn: new FormControl('', [Validators.required]),
      prdimages: new FormControl('', []),
    });
    this.getCategoryData();
    this.getProduct();
  }

  get prdFormErrDtls() {
    return this.productForm.controls;
  }

  createImageArr() {
    this.imagesList = Array.from({ length: 4 }, () => ({ filename: '', filepath: '' }));
  }

  dwnLoad() {
    const reqObj = {
      sheetname: 'product',
      type: this.filetype,
    };
    this.pdtService.api_shet_product(reqObj).subscribe(
      (res: any) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Product.${reqObj.type}`;
        link.click();
        this.modalService.dismissAll();
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  upldSheet() {
    const formData: FormData = new FormData();
    formData.append('fileupload', this.exelfiles[0]);
    this.pdtService.api_shetupld_product(formData).subscribe(
      (res) => {},
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  open(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        centered: true,
        backdrop: true,
        modalDialogClass: 'custom-modal-dailog',
      })
      .result.then(
        (result: any) => {
          this.filetype = 'xlsx';
          this.productForm.reset();
          console.log(`Closed with: ${result}`);
        },
        (reason: any) => {
          this.filetype = 'xlsx';
          this.productForm.reset();
          console.log(`Dismissed with: ${reason}`);
        }
      );
  }

  getCategoryData() {
    this.catService.api_catDrpDwn().subscribe(
      (res: any) => {
        this.catDropList = res.data;
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  getProduct() {
    const reqObj = {
      curtPage: this.currentPage,
      pageSize: this.pageSize,
    };
    this.pdtService.api_prdGetData(reqObj).subscribe(
      (res: any) => {
        this.prdDataCount = res.data.count;
        this.prdDefHeaders = res.data.dataHders;
        if (this.prdDataCount != 0) {
          let arrCount = Math.ceil(this.prdDataCount / this.pageSize);
          delete this.prdTblData[this.currentPage - 1];
          this.prdTblData = Array.from({ length: arrCount }, (_, idx) =>
            idx == this.currentPage - 1 ? res.data.data : []
          );
        } else {
          this.prdTblData = [];
        }
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  addProduct() {
    const formData: FormData = new FormData();
    Object.keys(this.productForm.value).forEach((key) => {
      if (key != 'prdimages') {
        formData.append(key, this.productForm.value[key]);
      }
    });
    this.imagesList.forEach(async (ele, indx) => {
      if (ele.filename !== '') {
        const blob = this.dataURLtoBlob(ele.filepath);
        formData.append(`images${indx + 1}`, blob, ele.filename);
      }
    });

    this.pdtService.api_prdInsert(formData).subscribe(
      (res: any) => {
        if (res.success) {
          this.modalService.dismissAll();
          if (this.prdTblData.length != 0) {
            if (this.prdTblData[this.currentPage - 1].length == this.pageSize) {
              this.currentPage++;
            }
          }
        }
        this.getProduct();
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  editPrdForm(itemPrd: any) {
    this.isEdit = true;
    this.editPrd = itemPrd;
    this.createImageArr();
    this.productForm.patchValue({
      prdName: itemPrd.prd_name,
      prdPrice: itemPrd.prd_price,
      prdCattype: itemPrd.prd_cattype,
      prdDescrptn: itemPrd.prd_descrptn,
    });
    if (itemPrd?.img_Arr) {
      for (let index = 0; index < itemPrd.img_Arr.length; index++) {
        this.imagesList[itemPrd.img_Arr[index].orderid - 1] = itemPrd.img_Arr[index];
        this.imagesList[itemPrd.img_Arr[index].orderid - 1].prdname = itemPrd.prd_name;
        this.imagesList[itemPrd.img_Arr[index].orderid - 1].filepath =
          this.baseUrl +
          itemPrd.img_Arr[index].midpath +
          itemPrd.prd_name +
          '/' +
          itemPrd.img_Arr[index].filename;
      }
    }
    this.open(this.addeditproduct);
  }

  delImagData(item: any) {
    if (item.prd_id) {
      let reqObj = {
        imgId: item.img_id,
        prdId: item.prd_id,
        filepath: item.prdname + '/' + item.filename,
      };
      this.pdtService.api_prdDelImg(reqObj).subscribe(
        (res: any) => {
          if (res.success) {
            let index = this.imagesList.findIndex((ele) => ele.img_id == item.img_id);
            this.imagesList[index] = { filename: '', filepath: '' };
          }
        },
        (err: any) => {}
      );
    } else {
    }
  }

  updProduct() {
    const formData: FormData = new FormData();
    formData.append('prdId', this.editPrd.prd_id);
    Object.keys(this.productForm.value).forEach((key) => {
      if (key != 'prdimages') {
        formData.append(key, this.productForm.value[key]);
      }
    });
    this.imagesList.forEach(async (ele, indx) => {
      if (ele.filename !== '') {
        if (ele.img_id) {
          formData.append(`images${indx + 1}`, ele);
        } else {
          const blob = this.dataURLtoBlob(ele.filepath);
          formData.append(`images${indx + 1}`, blob, ele.filename);
        }
      }
    });

    this.pdtService.api_prdUpdate(formData).subscribe(
      (res: any) => {
        if (res.success) {
          this.isEdit = false;
          this.getProduct();
        }
        this.getProduct();
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  delProduct($event: any) {
    const reqObj = {
      pdtId: $event.prd_id,
    };
    this.pdtService.api_prdDelete(reqObj).subscribe(
      (res: any) => {
        if (res.success) {
          if (this.currentPage == 1 && this.prdTblData[this.currentPage - 1].length == 1) {
            this.prdTblData = [];
          } else {
            this.currentPage = this.currentPage == 1 ? this.currentPage : this.currentPage--;
          }
        }
        this.getProduct();
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  private dataURLtoBlob(dataurl: string) {
    const arr: any = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  onFileSelected(event: any, params: string) {
    if (params == 'exlSheet') {
      this.exelfiles = event.target.files;
    } else if (params == 'prdUpdIMg') {
      const files: FileList = event.target.files;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (this.imagesList.some((ele) => ele.filename == '')) {
            const emtyInd = this.imagesList.findIndex((img) => img.filename === '');
            if (emtyInd !== -1) {
              this.imagesList[emtyInd].filename = file.name;
              this.imagesList[emtyInd].filepath = e.target.result;
            }
          } else {
            console.log('no extra file required');
          }
        };
        console.log(this.imagesList);
        reader.readAsDataURL(file);
      });
    }
  }

  swtchPage($event: any) {
    this.currentPage = $event;
    this.getProduct();
  }

  btnConfgFn(event: any) {
    const btnDt: any = event.btndt;
    const dataDt: any = event.dataset;
    const fn = (this as any)[btnDt.btnFn];
    if (typeof fn === 'function') {
      fn.call(this, dataDt);
    }
  }

  get imagesEmpty() {
    return this.imagesList.every((ele) => ele.filename === '');
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
