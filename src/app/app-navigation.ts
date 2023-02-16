/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : app-navigation.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-21 16:08:12
 */

export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Examples',
    icon: 'folder',
    items: [
      {
        text: 'Profile',
        path: '/profile'
      },
      {
        text: 'Tasks',
        path: '/tasks'
      }
    ],
    visible: false
  }
  ,
  // {
  //   text: 'Master',
  //   icon: 'columnchooser',
  //   items: [
  //     {
  //       text: 'Tenant',
  //       path: '/wm/master/tenant'
  //     },
  //     // {
  //     //   text: 'Warehouse',
  //     //   path: '/wm/master/warehouse'
  //     // },
  //     {
  //       text: 'Location',
  //       path: '/wm/master/location'
  //     },
  //     {
  //       text: 'Users',
  //       path: '/wm/master/user'
  //     },
  //     {
  //       text: 'Company',
  //       path: '/wm/master/company'
  //     },
  //     {
  //       text: 'ItemAdmin',
  //       path: '/wm/master/itemAdmin'
  //     }
  //     // {
  //     //   text: 'Item',
  //     //   path: '/wm/master/item'
  //     // }
  //   ]
  //   , visible: false
  // },
  {
    text: 'Receive',
    icon: 'columnchooser',
    items: [
      // {
      //   text: 'Receive',
      //   path: '/wm/receive/receive'
      // },
      {
        text: 'ReceiveSerial',
        path: '/wm/receive/rcv-serial'
      }
    ]
    , visible: false
  },
  {
    text: 'Simulation',
    icon: 'columnchooser',
    items: [
      {
        text: 'Simulation',
        path: '/poc/simulation'
      },
      {
        text: '제조원가',  // ManufactureCost
        path: '/poc/manuCost'
      },
      {
        text: '운송비(지역별)', // RegionxCar
        path: '/poc/regionxCar'
      },
      {
        text: '배차기준', // CarxItemLoad
        path: '/poc/carxItemLoad'
      },
      {
        text: '해상운송료', // DeliverySeeFee
        path: '/poc/deliverySeeFee'
      },
      {
        text: '물류이동기간', // DeliveryLeadTime
        path: '/poc/deliveryLeadTime'
      }
    ]
  }, {
    text: 'MM',
    icon: 'columnchooser',
    items: [
      {
        text: '거래처', // company
        path: '/mm/company'
      },
      {
        text: '거래처_new', // companyAlporter
        path: '/mm/companyalporter'
      },
      {
        text: '사용자', // Users
        path: '/mm/user'
      },
      {
        text: '창고', // Warehouse
        path: '/mm/warehouse'
      },
      {
        text: '로케이션', // Location
        path: '/mm/location'
      },
      {
        text: '품목', // Item
        path: '/mm/item'
      },
      {
        text: '품목1', // Item1
        path: '/mm/itemalporter'
      },
      {
        text: '품목관리사', // Itemadmin
        path: '/mm/itemadmin'
      },
      {
        text: '코드', // Code
        path: '/mm/code'
      },
      {
        text: 'receiverequest',
        path: '/mm/receiverequest',
        visible: false
      },
      {
        text: 'releaserequest',
        path: '/mm/releaserequest',
        visible: false
      },
      {
        text: '어플리케이션', // application
        path: '/mm/app'
      },
      {
        text: '메세지관리', // mfmessage
        path: '/mm/mfmessage'
      },
      {
        text: 'Users',
        path: '/wm/master/user'
      },
      {
        text: '메뉴', // menu
        path: '/mm/menu'
      },
      {
        text: '권한', // pgmauthority
        path: '/mm/pgmauthority'
      },
      {
        text: '부품구성표관리', // bomAdmin
        path: '/mm/bomadmin'
      },
      {
        text: '공정표관리',
        path: '/mm/ptroute'
      },
      {
        text: '제품별공정등록',
        path: '/mm/ptitemroute'
      },
      {
        text: '창고별품목제어',
        path: '/mm/whxitem'
      },
      {
        text: '생산지시등록',
        path: '/mm/ptprodrq'
      },
      {
        text: '생산실적등록',
        path: '/mm/ptprodrel'
      },
      {
        text: '제공재고현황조회',
        path: '/mm/ptprodinvstatus'
      },
      {
        text: '생산실적집계',
        path: '/mm/prodtot'
      },
      {
        text: '생산투입비용',
        path: '/mm/ptprodcost'
      },
      {
        text: '테스트',
        path: '/test/test'
      },
      
      {
        text: '공통',
        path: '/common/layout0'
      },
      {
        text: '레이아웃1',
        path: '/common/layout1'
      },
      {
        text: '레이아웃2',
        path: '/common/layout2'
      },
      {
        text: '레이아웃3',
        path: '/common/layout3'
      },
      {
        text: '레이아웃4',
        path: '/common/layout4'
      },
      {
        text: '레이아웃5',
        path: '/common/layout5'
      },
      {
        text: '레이아웃6',
        path: '/common/layout6'
      },
      {
        text: '레이아웃7',
        path: '/common/layout7'
      },
      {
        text: '레이아웃8',
        path: '/common/layout8'
      },
      {
        text: '레이아웃9',
        path: '/common/layout9'
      },
      {
        text: '레이아웃10',
        path: '/common/layout10'
      },
      
      {
        text: 'Astems_1',
        path: '/common/astems'
      },


    ]
  }, {
    text: 'Work',
    icon: 'columnchooser',
    items: [
      {
        text: '주문', // Order
        path: '/poc/order'
      },
      {
        text: '출고', // So
        path: '/poc/so'
      },
      {
        text: '입고', // Receive
        path: '/poc/receive'
      },
      {
        text: '재고', // Inv
        path: '/poc/pinv'
      },
      {
        text: 'Trace',
        path: '/poc/mapview'
      },
      {
        text: '입고예정',
        path: '/rcv/rcv'
      },
      {
        text: '적치지시서',
        path: '/rcv/rcvinstructreport'
      }
    ]
  },
  {
    text: 'INV',
    icon: 'columnchooser',
    items: [
      {
        text: '로케이션상황조회',
        path: 'inv/locationStatus'
      },
      {
        text: '재고조회(창고)',
        path: 'inv/invTagWh'
      },
      {
        text: '재고조회(창고x로케이션)',
        path: 'inv/invTagWhLocation'
      },
      {
        text: '재고조회(창고x로케이션x로트)',
        path: 'inv/invTagWhLocationLot'
      },
      {
        text: '로케이션재고이동',
        path: 'inv/moveLocation'
      },
      {
        text: '로케이션이동지시',
        path: 'inv/riInstruct'
      },
      {
        text: '창고이동지시',
        path: 'inv/warehousemove'
      },
      {
        text: '로케이션이동지시취소',
        path: 'inv/riInstructCancel'
      },
      {
        text: '로케이션이동지시서',
        path: 'inv/riInstructReport'
      },
      {
        text: '로케이션이동실적',
        path: 'inv/riInstructResult'
      },
      {
        text: '수불이력조회',
        path: 'inv/inOutHistory'
      },
      {
        text: '입출고이동이력조회',
        path: 'inv/inOutHistory'
      },
      {
        text: '재고조사지시서',
        path: 'inv/phyinstructreport'
      }
    ]
  }, {
    text: '출고',
    icon: 'columnchooser',
    items: [
      {
        text: '출고예정', // So
        path: '/so/so'
      },
      {
        text: '수주확정',
        path: '/so/soaccept'
      },
      {
        text: '수주취소',
        path: '/so/soacceptcancel'
      },
      {
        text: '피킹지시',
        path: '/so/soallocate'
      },
      {
        text: '피킹지시서',
        path: '/so/soallocatereport'
      },
      {
        text: '피킹지시취소',
        path: '/so/soallocatecancel'
      },
      {
        text: '피킹실적등록',
        path: '/so/sopick'
      },
      {
        text: '피킹실적취소',
        path: '/so/sopickcancel'
      },
      {
        text: '출고확정',
        path: '/so/soconfirmed'
      },
      {
        text: '거래명세서',
        path: '/so/soreport'
      },
      {
        text: '출고확정취소',
        path: '/so/soconfirmedcancel'
      },
      {
        text: '출고진행상황',
        path: '/so/sostatus'
      }
    ]
  }
];
