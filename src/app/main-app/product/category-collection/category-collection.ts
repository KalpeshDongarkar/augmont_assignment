import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { SharedSingletonTable } from '../../../utils/shared-components/shared-singleton-table/shared-singleton-table';

@Component({
  selector: 'app-category-collection',
  imports: [
    CommonModule,
    NgbModule,
    FeatureHeader,
    FormsModule,
    ReactiveFormsModule,
    SharedSingletonTable,
  ],
  templateUrl: './category-collection.html',
  styleUrl: './category-collection.scss',
})
export class CategoryCollection implements OnInit, OnDestroy {
  @ViewChild('addeditcategory', { read: TemplateRef }) addeditcategory:
    | TemplateRef<any>
    | undefined;
  categoryForm!: FormGroup;
  isEdit: boolean = false;
  editCat: any = {};
  catDataCount: number = 0;
  uniqId: string = 'cat_id';
  catTblData: any[] = [];
  catDefHeaders: any[] = [];
  currentPage: number = 1;
  pageSize: any = 10;

  validationMessage: any = {
    catName: [{ type: 'required', message: 'Category is required' }],
    catDescrptn: [{ type: 'required', message: 'Category Description is required' }],
  };
  btnArrList: any = [
    {
      btnToolTip: 'Edit',
      btnIconClass: 'fa fa-pencil',
      btnFn: 'editCategoryForm',
    },
    {
      btnToolTip: 'Delete',
      btnIconClass: 'fa fa-trash',
      btnFn: 'delCategory',
    },
  ];

  constructor(private readonly modalService: NgbModal, private catService: CategoryService) {}

  ngOnInit() {
    this.categoryForm = new FormGroup({
      catName: new FormControl('', [Validators.required]),
      catDescrptn: new FormControl('', [Validators.required]),
    });
    this.getCategory();
  }

  get catFormErrDtls() {
    return this.categoryForm.controls;
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
          console.log(`Closed with: ${result}`);
          this.categoryForm.reset();
        },
        (reason: any) => {
          this.categoryForm.reset();
          console.log(`Dismissed with: ${reason}`);
        }
      );
  }

  getCategory() {
    const reqObj = {
      curtPage: this.currentPage,
      pageSize: this.pageSize,
    };
    this.catService.api_catGetData(reqObj).subscribe(
      (res: any) => {
        this.catDataCount = res.data.count;
        this.catDefHeaders = res.data.dataHders;
        if (this.catDataCount != 0) {
          let arrCount = Math.ceil(this.catDataCount / this.pageSize);
          delete this.catTblData[this.currentPage - 1];
          this.catTblData = Array.from({ length: arrCount }, (_, idx) =>
            idx == this.currentPage - 1 ? res.data.data : []
          );
        } else {
          this.catTblData = [];
        }
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  editCategoryForm(itemCnt: any) {
    this.isEdit = true;
    this.editCat = itemCnt;
    this.categoryForm.patchValue({
      catName: itemCnt.cat_name,
      catDescrptn: itemCnt.cat_desptn,
    });
    this.open(this.addeditcategory);
  }

  updCategory() {
    const reqObj = {
      catId: this.editCat.cat_id,
      catName: this.categoryForm.controls['catName'].value,
      catDescrptn: this.categoryForm.controls['catDescrptn'].value,
    };
    this.catService.api_catUpdate(reqObj).subscribe(
      (res: any) => {
        if (res.success) {
          this.modalService.dismissAll();
          this.isEdit = false;
          this.getCategory();
        }
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  addCategory() {
    const reqObj = {
      catName: this.categoryForm.controls['catName'].value,
      catDescrptn: this.categoryForm.controls['catDescrptn'].value,
    };
    this.catService.api_catInsert(reqObj).subscribe(
      (res: any) => {
        if (res.success) {
          this.modalService.dismissAll();
          if (this.catTblData.length != 0) {
            if (this.catTblData[this.currentPage - 1].length == this.pageSize) {
              this.currentPage++;
            }
          }
        }
        this.getCategory();
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  delCategory($event: any) {
    const reqObj = {
      catId: $event.cat_id,
    };
    this.catService.api_catDelete(reqObj).subscribe(
      (res: any) => {
        if (res.success) {
          if (this.catTblData[this.currentPage - 1].length == 1) {
            this.currentPage = this.currentPage == 1 ? this.currentPage : this.currentPage--;
          }
        }
        this.getCategory();
      },
      (err: any) => {
        console.log('Error message:', err.message);
      }
    );
  }

  swtchPage($event: any) {
    this.currentPage = $event;
    this.getCategory();
  }

  btnConfgFn(event: any) {
    const btnDt: any = event.btndt;
    const dataDt: any = event.dataset;
    const fn = (this as any)[btnDt.btnFn];
    if (typeof fn === 'function') {
      fn.call(this, dataDt);
    }
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
