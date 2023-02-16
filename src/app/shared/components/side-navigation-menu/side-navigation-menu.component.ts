import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DxTabPanelModule } from 'devextreme-angular';
import {DxTreeViewComponent, DxTreeViewModule} from 'devextreme-angular/ui/tree-view';
import {navigation} from '../../../app-navigation';
import * as events from 'devextreme/events';
import {CookieService} from 'ngx-cookie-service';
import {isNaN} from 'lodash';
import {CommonUtilService} from '../../services/common-util.service';
import {APPCONSTANTS} from '../../constants/appconstants';
import {ComponentBehaviorService} from '../../services/component-behavior.service';
import {DxSortableModule, DxTabsModule} from 'devextreme-angular';
import {CommonModule} from '@angular/common';
import {SessionStorageService} from '../../services/session-storage.service';

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss']
})
export class SideNavigationMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('menuTreeView', {static: true}) menuTreeView: DxTreeViewComponent;
  @ViewChild('myMenuTreeView') myMenuTreeView: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<string>();

  @Output()
  openMenu = new EventEmitter<any>();

  private _selectedItem: string;
  @Input()
  set selectedItem(value: string) {
    this._selectedItem = value;
  }

  private _compactMode = false;
  @Input()
  get compactMode(): boolean {
    return this._compactMode;
  }

  set compactMode(val) {
    this._compactMode = val;
  }

  wholeItems: any[] = [];
  menuItems: any[] = [];
  myMenuItems: any[] = [];

  constructor(private elementRef: ElementRef,
              private cookieService: CookieService,
              private utilService: CommonUtilService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef,
              private sessionStorageService: SessionStorageService,
              private behaviorService: ComponentBehaviorService) {
    this.menuItems = this.getNavigation(); // 메뉴 초기화
  }

  ngOnInit(): void {

    // 헤더 탭 클릭시
    this.behaviorService.changedSystemTypeObserverable.subscribe((event: Event) => {
      if (event) {
        this.menuItems = this.wholeItems.filter(el => {
          return el.systemType === this.utilService.getSystemType();
        });
        // 탭 변경시 selected 제거
        for (const l1List of this.menuItems) {
          let chk = false;
          for (const l2 of l1List.items) {
            if (l2.selected && l2.selected === true) {
              delete l2.selected;
              chk = true;
              break;
            }
          }
          if (chk) {
            break;
          }
        }
      }
    });
  }

  ngAfterViewInit(): void {

    this.behaviorService.changedBookMarkObserverable.subscribe((event: Event) => {
      this.getNavigationBookMark();
    });
  }

  ngOnDestroy(): void {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }

  onItemClick(event): void {
    this.selectedItemChanged.emit(event);
  }

  getNavigation(): any[] {
    const userId = parseInt(this.cookieService.get(APPCONSTANTS.TOKEN_USER_USERID_UID), 0);

    if (isNaN(userId)) {  // 키가 유효하지 않으면
      return navigation.map((item) => {
        if (item.path && !(/^\//.test(item.path))) {
          item.path = `/${item.path}`;
        }
        return {...item, expanded: !this._compactMode};
      });
    }
    const menuList = [];

    this.utilService.getMenuListForUser(userId, this.utilService.getTenant(), this.utilService.getLanguage()).subscribe(data => {

      let title = '';
      let menu = {text: '', userType: '', icon: '', items: [], expanded: true};

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.data.length; i++) {
        const obj = data.data[i];

        if (!obj.l2path) {
          continue;
        }

        if (!title) {
          title = obj.l1text;
        }
        if (title !== obj.l1text) {
          title = obj.l1text;
          // @ts-ignore
          menuList.push(menu);
          menu = {text: '', userType: '', icon: '', items: [], expanded: false};
        }
        menu.text = obj.l1text;
        menu.icon = obj.l1icon;
        menu.userType = obj.userType;
        menu.expanded = /*!this._compactMode*/false;
        menu.items.push({text: obj.l2text, path: (obj.l1path + obj.l2path), expanded: false, menuL2Id: obj.menuL2Id});

        if (i === data.data.length - 1) {
          // @ts-ignore
          menuList.push(menu);
        }
      }

      this.menuItems = menuList.filter(el => {
        return el.userType === this.sessionStorageService.getItemValue('userType');
      });
      this.getNavigationBookMark();
    });

    this.wholeItems = menuList;
    return menuList;
  }

  getNavigationBookMark(): void {
    const myMenuList = [];
    const bookMarkData = {
      tenant: this.utilService.getTenant(),
      userId: this.utilService.getUserUid(),
      language: this.utilService.getLanguage()
    };

    this.utilService.getBookMark(bookMarkData).then(result => {
      let idx = 0;

      for (const rEl of result.data) {
        myMenuList.push({
          id: `${idx++}`, uid: rEl.uid, text: rEl.menuL2Text, menuL1Path: rEl.menuL1Path,
          path: rEl.path, expanded: false, menuL2Id: rEl.menuL2Id
        });
      }
    });
    this.myMenuItems = myMenuList;
  }

  onDragChange(e): void {
    if (e.fromComponent === e.toComponent) {
      const fromNode = this.findNode(this.getTreeView(e.fromData), e.fromIndex);
      const toNode = this.findNode(this.getTreeView(e.toData), this.calculateToIndex(e));
      if (toNode !== null && this.isChildNode(fromNode, toNode)) {
        e.cancel = true;
      }
    }
  }

  onDragEnd(e): void {
    if (e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
      return;
    }

    const fromTreeView = this.getTreeView(e.fromData);
    const toTreeView = this.getTreeView(e.toData);

    const fromNode = this.findNode(fromTreeView, e.fromIndex);
    const toNode = this.findNode(toTreeView, this.calculateToIndex(e));

    if (e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
      return;
    }

    const fromTopVisibleNode = this.getTopVisibleNode(e.fromComponent);
    const toTopVisibleNode = this.getTopVisibleNode(e.toComponent);

    const fromItems = fromTreeView.option('items');
    const toItems = toTreeView.option('items');
    this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

    fromTreeView.option('items', fromItems);
    toTreeView.option('items', toItems);
    fromTreeView.scrollToItem(fromTopVisibleNode);
    toTreeView.scrollToItem(toTopVisibleNode);

    this.utilService.saveBookMarkSort(this.myMenuItems).then();
  }

  getTreeView(driveName): any {
    return this.myMenuTreeView.instance;
  }

  calculateToIndex(e): number {
    if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
      return e.toIndex;
    }

    return e.fromIndex >= e.toIndex
      ? e.toIndex
      : e.toIndex + 1;
  }

  findNode(treeView, index): any {
    const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
    if (nodeElement) {
      return this.findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
    }
    return null;
  }

  findNodeById(nodes, id): any {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].itemData.id === id) {
        return nodes[i];
      }
      if (nodes[i].children) {
        const node = this.findNodeById(nodes[i].children, id);
        if (node != null) {
          return node;
        }
      }
    }
    return null;
  }

  moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem): void {

    console.log(fromNode);
    const fromIndex = fromItems.findIndex((item) => item.id === fromNode.itemData.id);
    fromItems.splice(fromIndex, 1);

    const toIndex = toNode === null || isDropInsideItem
      ? toItems.length
      : toItems.findIndex((item) => item.id === toNode.itemData.id);
    toItems.splice(toIndex, 0, fromNode.itemData);

    this.moveChildren(fromNode, fromItems, toItems);
    if (isDropInsideItem) {
      fromNode.itemData.parentId = toNode.itemData.id;
    } else {
      fromNode.itemData.parentId = toNode != null
        ? toNode.itemData.parentId
        : undefined;
    }
  }

  moveChildren(node, fromDataSource, toDataSource): void {
    if (!node.itemData.isDirectory) {
      return;
    }

    node.children.forEach((child) => {
      if (child.itemData.isDirectory) {
        this.moveChildren(child, fromDataSource, toDataSource);
      }

      const fromIndex = fromDataSource.findIndex((item) => item.id === child.itemData.id);
      fromDataSource.splice(fromIndex, 1);
      toDataSource.splice(toDataSource.length, 0, child.itemData);
    });
  }

  isChildNode(parentNode, childNode): boolean {
    let parent = childNode.parent;
    while (parent !== null) {
      if (parent.itemData.id === parentNode.itemData.id) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  getTopVisibleNode(component): any {
    const treeViewElement = component.element();
    const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
    const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');

    for (let i = 0; i < nodes.length; i++) {
      const nodeTopPosition = nodes[i].getBoundingClientRect().top;
      if (nodeTopPosition >= treeViewTopPosition) {
        return nodes[i];
      }
    }
    return null;
  }
}


