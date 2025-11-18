import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shared-singleton-table',
  imports: [CommonModule, NgbModule],
  templateUrl: './shared-singleton-table.html',
  styleUrl: './shared-singleton-table.scss',
})
export class SharedSingletonTable implements OnInit, OnChanges {
  @Input() mainData: any[] = [];
  @Input() uniqIdKey: string = '';
  @Input() btnArr: any[] = [];
  @Input() hdkeys: any[] = [];
  @Input() sortArr: any[] = [];
  @Input() searchArr: any[] = [];
  @Output() _btnFunctn: EventEmitter<any> = new EventEmitter<any>();
  @Output() _sortDataFunctn: EventEmitter<any> = new EventEmitter<any>();
  @Output() _SearchDataFunctn: EventEmitter<any> = new EventEmitter<any>();

  mainTblData: any = [];
  tempDataSet: any = [];
  headerKeys: any = [];

  @Input() currentPage: number = 1;
  @Input() pageSize: any = 10;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.crtTblData();
  }

  crtTblData() {
    console.log(this.headerKeys);
    this.mainTblData = this.mainData[this.currentPage - 1]
      ? [
          ...new Set(
            this.mainData[this.currentPage - 1].map((ele: any) => {
              const filteredEntries = Object.entries(ele).filter(
                ([key, value]) => key.includes(' ') || /^[A-Z]/.test(key) || key === this.uniqIdKey
              );
              return Object.fromEntries(filteredEntries);
            })
          ),
        ]
      : [];

    if (this.mainTblData.length != 0) {
      this.tempDataSet = this.mainTblData;
      if (this.headerKeys.length != 0) {
        let extrHeader = Object.keys(this.mainTblData[0]);
        let lastHeader = this.headerKeys.map((ele: any) => ele.hdrName);
        let newHeaders = extrHeader.filter((hrdName) => !lastHeader.includes(hrdName));
        let newHeaderObjects = newHeaders.map((name) => ({ hdrName: name }));
        this.headerKeys.push(...newHeaderObjects);
      } else {
        this.headerKeys = Object.keys(this.mainTblData[0]).map((ele) => ({
          hdrName: ele,
          srtBy: '',
        }));
      }
    } else {
      if (this.headerKeys?.length) {
        this.headerKeys = [...this.headerKeys];
      } else {
        this.headerKeys = this.hdkeys.map((ele) => ({ hdrName: ele, srtBy: '' }));
      }
    }
  }

  smlVal(value: any): boolean {
    if (value.defrole != undefined) {
      return value.defrole == 0;
    } else {
      return true;
    }
  }

  showColFn(value: string) {
    return !/^[a-z]+/.test(value);
  }

  configFn(btnCnfg: any, itemSet: any) {
    let mnItmSet: any = this.mainData[this.currentPage - 1].find(
      (ele: any) => ele[this.uniqIdKey] == itemSet[this.uniqIdKey]
    );
    this._btnFunctn.emit({ btndt: btnCnfg, dataset: mnItmSet });
  }

  sortData(hdr: any) {
    this._sortDataFunctn.emit(hdr);
  }

  searchDataTerm(hdr: any, event: any) {
    console.log(event.target.value);
    hdr.searchTerm = event.target.value;
    console.log(this.headerKeys, hdr);
    if (hdr.searchTerm.length >= 3) {
      let hrArr = this.headerKeys.filter((hkey: any) => (hkey?.searchTerm ?? '').length >= 3);
      this._SearchDataFunctn.emit(hrArr);
    }
  }
}
