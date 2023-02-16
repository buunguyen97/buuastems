import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import { ScreenService } from '../../shared/services';
import { ItemClickEvent as TreeViewItemClickEvent } from 'devextreme/ui/tree_view';
import { ItemClickEvent as ToolbarItemClickEvent } from 'devextreme/ui/toolbar';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { CommonModule } from '@angular/common';

import { Router, NavigationEnd } from '@angular/router';
import {APPCONSTANTS} from '../../shared/constants/appconstants';
import {CommonUtilService} from '../../shared/services/common-util.service';
import {SharedComponentsModule} from '../../shared/components/sharedComponents.module';

@Component({
  selector: 'app-side-nav-inner-toolbar',
  templateUrl: './side-nav-inner-toolbar.component.html',
  styleUrls: ['./side-nav-inner-toolbar.component.scss']
})
export class SideNavInnerToolbarComponent implements OnInit {
  @ViewChild(DxScrollViewComponent, { static: true }) scrollView!: DxScrollViewComponent;
  selectedRoute = '';

  menuOpened!: boolean;
  temporaryMenuOpened = false;

  @Input()
  title!: string;

  menuMode = 'shrink';
  menuRevealMode = 'expand';
  minMenuSize = 0;
  shaderEnabled = false;

  constructor(private screen: ScreenService, private router: Router, private utilService: CommonUtilService) { }

  ngOnInit() {
    this.menuOpened = this.screen.sizes['screen-large'];

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.selectedRoute = val.urlAfterRedirects.split('?')[0];
      }
    });

    this.screen.changed.subscribe(() => this.updateDrawer());

    this.updateDrawer();
  }

  updateDrawer() {
    const isXSmall = this.screen.sizes['screen-x-small'];
    const isLarge = this.screen.sizes['screen-large'];

    this.menuMode = isLarge ? 'shrink' : 'overlap';
    this.menuRevealMode = isXSmall ? 'slide' : 'expand';
    this.minMenuSize = isXSmall ? 0 : 65;
    this.shaderEnabled = !isLarge;
  }

  toggleMenu = (e: ToolbarItemClickEvent) => {
    this.menuOpened = !this.menuOpened;
    e.event?.stopPropagation();
  }

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return !this.menuOpened;
  }

  navigationChanged(event: TreeViewItemClickEvent) {
    const path = (event.itemData as any).path;
    const pointerEvent = event.event;

    // if (path && this.menuOpened) {
    //   if (event.node?.selected) {
    //     pointerEvent?.preventDefault();
    //   } else {
    //     this.router.navigate([path]);
    //     this.scrollView.instance.scrollTo(0);
    //   }
    //
    //   if (this.hideMenuAfterNavigation) {
    //     this.temporaryMenuOpened = false;
    //     this.menuOpened = false;
    //     pointerEvent?.stopPropagation();
    //   }
    // } else {
    //   pointerEvent?.preventDefault();
    // }

    if (path && this.menuOpened) {
      if (event.node.selected) {
        pointerEvent.preventDefault();
      } else {
        let pathName = '';

        if (!event.node.parent) {
          const menu1text = this.utilService.convert(event.itemData['menuL1Path']);
          const menu2text = this.utilService.convert(event.itemData['path']);
          pathName = menu1text + APPCONSTANTS.TEXT_PATH_SEPARATOR + menu2text;
        } else {
          pathName = `${event.node.parent.text}${APPCONSTANTS.TEXT_PATH_SEPARATOR}${event.node.text}`;
        }

        this.utilService.setPageInfo({
          path: event.itemData['path'],
          pathName,
          title: event.node.text,
          menuL2Id: event.itemData['menuL2Id']
        });
        this.router.navigate([path], {skipLocationChange: true});
        this.scrollView.instance.scrollTo(0);
      }

      if (this.hideMenuAfterNavigation) {
        this.temporaryMenuOpened = false;
        this.menuOpened = false;
        pointerEvent.stopPropagation();
      }
    } else {
      pointerEvent.preventDefault();
    }
  }

  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
}

@NgModule({
  imports: [ DxDrawerModule, DxToolbarModule, DxScrollViewModule, CommonModule, SharedComponentsModule ],
  exports: [ SideNavInnerToolbarComponent ],
  declarations: [ SideNavInnerToolbarComponent ]
})
export class SideNavInnerToolbarModule { }
