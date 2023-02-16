import {Injectable} from '@angular/core';
import Query from 'devextreme/data/query';
import * as XLSX from 'xlsx';
import {Workbook} from 'exceljs';
import {exportDataGrid} from 'devextreme/excel_exporter';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class GridUtilService {

  private ALLOWED_PAGE_SIZE = [50, 100, 200, 'all']; // 그리드 행 갯수 목록
  private PAGE_SIZE = 50;  // 기본 행 갯수 기본값
  private MAIN_GRID_ALLOWED_SIZE = [5, 10, 20, 'all'];  // 상단 그리드 행 갯수 목록
  private MAIN_GRID_PAGE_SIZE = 5;  // 상단 그리드 행 갯수 기본값
  private gridComp: any;

  constructor() {
    this.gridComp = null;
    this.exportExcelForGrid = this.exportExcelForGrid.bind(this);
  }

  /**
   * 그리드 행 갯수 목록
   */
  getAllowedPageSize(): any {
    return this.ALLOWED_PAGE_SIZE;
  }

  getMainGridAllowedSize(): any {
    return this.MAIN_GRID_ALLOWED_SIZE;
  }

  /**
   * 그리드 행 선택 갯수
   */
  getPageSize(): any {
    return this.PAGE_SIZE;
  }

  getMainGridPageSize(): any {
    return this.MAIN_GRID_PAGE_SIZE;
  }

  // 그리드 툴바
  onToolbarPreparing(e): void {
    const toolbarItems = e.toolbarOptions.items;
    const newToolbarItems = [];

    if (toolbarItems.find(item => item.name === 'groupPanel')) {
      newToolbarItems.push(toolbarItems.find(item => item.name === 'groupPanel'));          // first
    }
    newToolbarItems.push(toolbarItems.find(item => item.name === 'searchPanel'));         // second
    newToolbarItems.push(toolbarItems.find(item => item.name === 'exportButton'));        // third
    newToolbarItems.push(toolbarItems.find(item => item.name === 'columnChooserButton')); // 4th

    e.toolbarOptions.items = newToolbarItems;
  }

  // 그리드 툴바
  onToolbarPreparingWithExportExcel(e, grid): void {
    this.gridComp = null;
    this.gridComp = grid;

    const toolbarItems = e.toolbarOptions.items;
    const newToolbarItems = [];

    if (toolbarItems.find(item => item.name === 'groupPanel')) {
      newToolbarItems.push(toolbarItems.find(item => item.name === 'groupPanel'));          // first
    }
    newToolbarItems.push(toolbarItems.find(item => item.name === 'searchPanel'));         // second
    newToolbarItems.push(toolbarItems.find(item => item.name === 'exportButton'));        // third
    newToolbarItems.push(toolbarItems.find(item => item.name === 'columnChooserButton')); // 4th

    newToolbarItems.push({  // third
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'download',
        onClick: this.exportExcelForGrid
      }
    });

    e.toolbarOptions.items = newToolbarItems;
  }

  // 그리드 툴바
  onToolbarPreparingWithComBtn(e, pageObj, addBtn, delBtn): void {

    const toolbarItems = e.toolbarOptions.items;
    const newToolbarItems = [];

    if (toolbarItems.find(item => item.name === 'groupPanel')) {
      newToolbarItems.push(toolbarItems.find(item => item.name === 'groupPanel'));          // first
    }
    newToolbarItems.push(toolbarItems.find(item => item.name === 'searchPanel'));         // second
    newToolbarItems.push({  // third
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'add',
        onClick: addBtn.bind(pageObj)
      }
    });
    newToolbarItems.push({  // 4th
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'minus',
        onClick: delBtn.bind(pageObj)
      }
    });

    if (toolbarItems.find(item => item.name === 'exportButton')) {
      newToolbarItems.push(toolbarItems.find(item => item.name === 'exportButton'));        // 5th
    }

    newToolbarItems.push(toolbarItems.find(item => item.name === 'columnChooserButton')); // 6th

    e.toolbarOptions.items = newToolbarItems;
  }

  // 그리드 상태 저장
  fnGridSaveState(gridStateKey: string): any {
    return (state) => {
      state.selectedRowKeys = [];
      state.pageIndex = 0;
      state.focusedRowKey = null;
      localStorage.setItem(gridStateKey, JSON.stringify(state));
    };
  }

  // 그리드 상태 로드
  fnGridLoadState(gridStateKey: string): any {
    return () => {
      return new Promise((resolve/*, reject*/) => {
        const data = localStorage.getItem(gridStateKey);
        if (data) {
          const state = JSON.parse(data);
          resolve(state);
        } else {
          resolve(null);
        }
      });
    };
  }

  /**
   * 엑셀 추출 커스텀(사용안함)
   */
  exportExcelForGrid(): void {
    const cols = this.gridComp.instance.getVisibleColumns();
    const rows = this.gridComp.instance.getVisibleRows();

    const excelData = [];
    const headerData = [];
    for (const col of cols) {
      headerData.push(col.caption);
    }
    // for (const col of cols) {
    //   headerData.push({
    //     v: col.caption,
    //     t: 's',
    //     s: {
    //       font: {name: 'Courier', sz: 50},
    //       border: {
    //         top: {
    //           style: 'thin',
    //           color: '000000'
    //         },
    //         bottom: {
    //           style: 'thin',
    //           color: '000000'
    //         },
    //       }
    //     }
    //   });
    // }

    excelData.push(headerData);
    for (const row of rows) {
      const rowData = [];
      for (const c of row.cells) {
        rowData.push(c.displayValue);
      }
      excelData.push(rowData);
    }

    // for (const row of rows) {
    //   const rowData = [];
    //   for (const c of row.cells) {
    //     rowData.push({
    //       v: c.displayValue,
    //       t: 's'
    //     });
    //   }
    //   excelData.push(rowData);
    // }

    // console.log(excelData);
    const sheet = XLSX.utils.aoa_to_sheet(excelData, {cellStyles: true});

    // sheet = XLSX.utils.sheet_to_json(sheet);

    // console.log(sheet);

    // tslint:disable-next-line:forin
    for (const idx in cols) {
      // const col = cols[idx];

      // console.log(idx + 1);
      const colNum = this.numToColumn((Number(idx) + 1));
      // console.log(colNum);
      // const col = sheet[colNum + '1'];
      sheet[colNum + '1'].s = {
        border: {
          right: {
            style: 'thin',
            color: '000000'
          },
          left: {
            style: 'thin',
            color: '000000'
          },
        }
      };

    }

    console.log(sheet);

    // sheet = XLSX.utils.json_to_sheet(sheet, {cellStyles: true});


    // const header = sheet.getRow(1);
    // console.log(header);


    const wb = XLSX.utils.book_new();
    const data = XLSX.utils.aoa_to_sheet([
      [1], // A1
      [2], // A2
      [{t: 'n', v: 3, f: 'A1+A2', s: {font: {name: 'Courier', sz: 50}}}] // A3
    ], {cellStyles: true});
    // XLSX.utils.book_append_sheet(wb, sheet, 'sheet1');
    XLSX.utils.book_append_sheet(wb, data, 'sheet1');
    XLSX.writeFile(wb, 'DataGrid.xlsx', {cellStyles: true});
    // const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});

    // const row = [
    //   {v: 'Courier: 24', t: 's', s: {font: {name: 'Courier', sz: 50}}},
    //   {v: 'bold & color', t: 's', s: {font: {bold: true, color: {rgb: 'FF0000'}}}},
    //   {v: 'fill: color', t: 's', s: {fill: {fgColor: {rgb: 'E9E9E9'}}}},
    //   {v: 'line\nbreak', t: 's', s: {alignment: {wrapText: true}}},
    // ];

    // const ws = XLSX.utils.aoa_to_sheet([row]);
    // XLSX.utils.book_append_sheet(wb, ws, 'readme demo');
    // XLSX.writeFile(wb, 'xlsx-js-style-demo.xlsx');

    //
    // const a = window.document.createElement('a');
    // a.href = window.URL.createObjectURL(new Blob([this.s2ab(wbout)], {type: 'application/octet-stream'}));
    // a.download = 'gridData.xlsx';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(a.href);
  }

  s2ab(s: string): any {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  numToColumn(num): any {
    let s = '';
    let t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      // tslint:disable-next-line:no-bitwise
      num = (num - t) / 26 | 0;
    }
    return s || undefined;
  }

  /**
   * 그리드 엑셀 추출(전체/페이지)
   *
   * 1. grid export [allowExportSelectedData]="true" 추가
   *    <dxo-export [enabled]="true" [allowExportSelectedData]="true"></dxo-export>
   * 2. grid option onPageExportXlsx 메소드 추가
   *  (onExporting)="gridUtil.onPageExportXlsx($event, 'itemList')"
   */
  onPageExportXlsx(e: any, fileNm?: string): void {

    const ext = '.xlsx';
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const fnCustomizeCell = (options) => {
      const {gridCell, excelCell} = options;

      // rowNum
      if (gridCell.column.name === 'No' && gridCell.rowType === 'data') {
        if (!toggle) {
          toggle = true;
          num = 0;
        }
        num++;
        excelCell.value = num;  // 엑셀 번호
      }
    };

    // 엑셀 파일명
    let fileName = fileNm ? fileNm : 'DataGrid.xlsx';
    if (!fileName.endsWith(ext)) {
      fileName += ext;
    }

    let toggle = false;
    let num = 0;
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
      customizeCell: fnCustomizeCell
    }).then((r) => {

      if (r.to.row === 1) {
        const keys = e.component
          .getVisibleRows()
          .filter((row) => row.rowType === 'data')
          .map((i) => i.key);

        e.component.option('selectedRowKeys', keys);

        exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
          customizeCell: fnCustomizeCell
        }).then((rr) => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
          });
        });

        e.component.deselectAll();
      } else {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
        });
      }
    });

    e.cancel = true;
  }


  onFnExporting(e): void {
    // console.log('start');
    //
    //
    // const workbook = XLSX.utils.book_new();
    // const keys = e.component.getSelectedRowKeys();
    // // const worksheet = workbook.addWorksheet('sheet1');
    // XLSX.utils.book_append_sheet(wb, sheet, 'sheet1');
    // const newKeys = e.component
    //   .getVisibleRows()
    //   .filter((r) => r.rowType === 'data')
    //   .map((i) => i.key);
    //
    // e.component.option('selectedRowKeys', newKeys);
    //
    // console.log(newKeys);
    // console.log(exportDataGrid);
    // exportDataGrid({
    //   component: e.component,
    //   worksheet,
    //   selectedRowsOnly: true,
    //   autoFilterEnabled: true
    // }).then(() => {
    //   console.log('thens thens ');
    //   workbook.xlsx.writeBuffer().then((buffer) => {
    //     e.component.option('selectedRowKeys', keys);
    //     console.log(keys);
    //
    //     const a = window.document.createElement('a');
    //     a.href = window.URL.createObjectURL(new Blob([buffer], {type: 'application/octet-stream'}));
    //     // a.href = baseUrl;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //
    //   });
    // });
    //
    // // e.component.export
    //
    // e.cancel = true;
    // console.log('end');
  }

  /*

  DataGrid Custom Summary

   1. html에 dxo-summary 추가 (summaryType=custom)
   <dxo-summary [calculateCustomSummary]="calculateCustomSummary">
   <dxi-total-item showInColumn="qty1"
   name="qty1"
   summaryType="custom"
   valueFormat="#,##0.####"
   displayFormat="{0}">
   </dxi-total-item>
   </dxo-summary>

   2. component.ts에 searchList 배열추가
   // summary
   searchList = [];

   3. 조회이벤트 메소드에 조회결과 searchList 대입 추가
   const result = await this.service.get(this.mainFormData);
      this.searchList = result.data;

   4. DataGrid에 [onOptionChanged] 이벤트 추가

   onOptionChanged(e): void {
    this.gridUtil.onOptionChangedForSummary(e, this); // 합계 계산
  }

   5. component.ts에 [calculateCustomSummary] 메소드 정의
   calculateCustomSummary(options): void {
    this.gridUtil.setCustomSummary(options, this.mainGrid, this);
   }

   6. 컴포넌트 생성자에
   this.calculateCustomSummary = this.calculateCustomSummary.bind(this);
   */

  // 그리드 합계를 위한 onOptionChanged
  onOptionChangedForSummary(e, tt): void {

    // 서머리를 위한 배열 생성
    if (!
      tt.summaryList
    ) {
      tt.summaryList = [];
    }

    // if (!tt.searchList) {
    //   tt.searchList = [];
    // }

    if (e.fullName.indexOf('dataSource') >= 0) {
      tt.summaryList = tt.searchList;
      // e.component.refresh();
    }

    if (e.fullName.indexOf('pageIndex') >= 0 || e.fullName === 'paging.pageSize') {
      e.component.refresh();
    }

    if (e.fullName.indexOf('sortOrder') >= 0) {
      const result = /columns\[(?<colNum>.*?)\]\.sortOrder/g.exec(e.fullName);
      if (result.groups) {
        const colNm = e.component.columnOption(Number(result.groups.colNum), 'dataField');
        tt.summaryList = Query(tt.searchList).sortBy(colNm, 'desc' === e.value).toArray();
      }
    }
  }

  setCustomSummary(options, grid, tt): void {
    if (grid.summary.totalItems.find(el => el.name === options.name)
    ) {
      this.calculateCustomSummary(options, tt);
    }
  }

  // 그리드 합계 계산
  calculateCustomSummary(o, tt): void {
    if (o.summaryProcess === 'finalize'
    ) {
      o.totalValue = 0;
      const pageIndex = o.component.pageIndex();
      const pageSize = o.component.option('paging.pageSize');
      const skip = pageSize * (pageIndex);

      if (pageSize === 0) { // page size === 'All'
        Query(tt.summaryList)
          .sum(o.name)
          .then(res => {
            o.totalValue = res;
          });
      } else {
        Query(tt.summaryList)
          .slice(skip, pageSize)
          .sum(o.name)
          .then(res => {
            o.totalValue = res;
          });
      }
    }
  }

  /**
   * 횡스크롤 제거
   */
  fnScrollOption(grid): void {
    const scrollable = grid.instance.getScrollable();
    scrollable.option('direction', 'vertical'); // both : vertical, horizontal
  }

  fnScrollOptionHoriz(grid): void {
    const scrollable = grid.instance.getScrollable();
    scrollable.option('direction', 'horizontal'); // both : vertical, horizontal
  }

  // return today yyyy-MM-dd
  getToday(): string {
    const today = new Date();
    const seperator = '-';
    const yyyy = today.getFullYear();
    const MM = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

    return yyyy + seperator + MM + seperator + dd;
  }
}
