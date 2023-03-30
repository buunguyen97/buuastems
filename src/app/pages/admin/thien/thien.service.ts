import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {ApiResult} from '../../../shared/vo/api-result';


@Injectable({
    providedIn: 'root'
})


export class ThienService {

    httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/user`;
    data1 = [
        {code: '10층교육장', name: '10층교육장'},
        {code: '8층테스트', name: '8층테스트'},
        {code: 'ASTEMS교육장(매장)2', name: 'ASTEMS교육장(매장)2'},
        {code: '고객지원테스트01', name: '고객지원테스트01'},
        {code: '고객지원테스트02', name: '고객지원테스트02'},
    ];
    data2 = [
        {code: '0218', name: '0218'},
        {code: '0416대분류', name: '0416대분류'},
        {code: '0904교육대', name: '0904교육대'},
        {code: '1027대분류', name: '1027대분류'},
    ];
    data3 = [
        {code: '0904교육대', name: '0904교육대'},
        {code: '1027대분류', name: '1027대분류'},
    ];
    data4 = [
        {code: '0218', name: '0218'},
        {code: '0416대분류', name: '0416대분류'},
        {code: '1027대분류', name: '1027대분류'},
    ];
    Data = [
        {Bill_No: 'J01', 상품코드: 'Thien', 현금매출: 'Vinhomes Golden', 고객명: 'N'},
        {Bill_No: 'J02', 상품코드: 'Buu', 현금매출: 'Vinhomes Golden', 고객명: 'N'},
        {Bill_No: 'J03', 상품코드: 'Phong', 현금매출: 'Vinhomes Golden', 고객명: 'N'},
        {Bill_No: 'J04', 상품코드: 'Tinh', 현금매출: 'Vinhomes Golden', 고객명: 'N'}];

    constructor(private http: JHttpService) {
    }

    // async datas(Data: {}): Promise<ApiResult<UserVO[]>> {
    //   const baseUrl = `${this.httpUrl}/findUser`;

    //   try {
    //     const result = await this.http.post<ApiResult<UserVO[]>>(baseUrl, Data).toPromise();
    //     return result;
    //   } catch {
    //     return {
    //       success: false,
    //       data: null,
    //       code: '-999',
    //       msg: 'Post service api error!'
    //     };
    //   }
    // }

    getOrders() {
        return orders;
    }

    getFoods() {
        return foods;
    }

    getEats() {
        return eats;
    }

    setDataGrid(orders, kay: string[]): string[] {
        for (const item of orders) {

            if (Boolean(item.items)) {
                this.setDataGrid(item.items, kay);
            } else {

                for (const key of Object.keys(item)) {

                    if (key === 'dataField') {
                        kay.push(item[key]);
                    }
                }
            }
        }
        return kay;
    }

    async get(searchData: {}): Promise<ApiResult<UserVO[]>> {
        const baseUrl = `${this.httpUrl}/findUser`;
        const createdDatetime = new Date();
        createdDatetime.toISOString();
        try {
            const result = await this.http.post<ApiResult<UserVO[]>>(baseUrl, searchData).toPromise();
            return result;
        } catch {
            return {
                success: false,
                data: null,
                code: '-999',
                msg: 'Post service api error!'
            };
        }
    }

    async getPopup(data: {}): Promise<ApiResult<UserVO>> {
        // Api 설정
        const baseUrl = `${this.httpUrl}/findUserFull`;

        try {
            // Post 방식으로 조회
            const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
            return result;
        } catch {
            return {
                success: false,
                data: null,
                code: '-999',
                msg: 'Post service api error!'
            };
        }
    }

    async save(data: {}): Promise<ApiResult<UserVO>> {
        const baseUrl = `${this.httpUrl}/saveUser`;
        try {
            const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
            return result;
        } catch (e) {
            return {
                success: false,
                data: null,
                code: e.code,
                msg: e.msg
            };
        }
    }

    async update(data: {}): Promise<ApiResult<UserVO>> {
        const baseUrl = `${this.httpUrl}/updateUser`;
        try {
            const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
            return result;
        } catch (e) {
            return {
                success: false,
                data: null,
                code: e.code,
                msg: e.msg
            };
        }
    }

    async sendPost(data: any, command?: string): Promise<ApiResult<any>> {
        const url = `${this.httpUrl}/${command}`;

        try {
            return await this.http.post<ApiResult<any>>(url, data).toPromise();
        } catch (e) {
            return COMMONINITDATA.DEFAULT_POST_API_ERROR;
        }
    }

    async delete(data: {}): Promise<ApiResult<void>> {
        const baseUrl = `${this.httpUrl}/deleteUser`;
        try {
            const result = await this.http.post<ApiResult<void>>(baseUrl, data).toPromise();
            return result;
        } catch (e) {
            return {
                success: false,
                data: null,
                code: e.code,
                msg: e.msg
            };
        }
    }

    async updatePwd(data: {}): Promise<ApiResult<UserVO>> {
        const baseUrl = `${this.httpUrl}/updatePwd`;
        try {
            const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
            return result;
        } catch (e) {
            return {
                success: false,
                data: null,
                code: e.code,
                msg: e.msg
            };
        }
    }


    async resetPassword(data: {}): Promise<ApiResult<UserVO>> {
        const baseUrl = `${this.httpUrl}/resetPassword`;
        try {
            const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
            return result;
        } catch (e) {
            return {
                success: false,
                data: null,
                code: e.code,
                msg: e.msg
            };
        }
    }
}

const orders: Order[] = [{
    ID: 1,
    model: '001',
    text1: '만원짜리',
    remainAmt: 3,
    createdDatetime: '	2023-03-24T07:20:03.878Z'

}, {
    ID: 2,
    model: '002',
    text1: '10만원',
    remainAmt: 2,
    createdDatetime: '	2023-03-24T07:20:03.878Z'

}, {
    ID: 3,
    model: '003',
    text1: '오만원권',
    remainAmt: 0,
    createdDatetime: '	2023-03-24T07:20:03.878Z'
}, {
    ID: 4,
    model: '004',
    text1: '테스트테스트테스트',
    remainAmt: 0,
    createdDatetime: '	2023-03-24T07:20:03.878Z'
}, {
    ID: 5,
    model: '005',
    text1: '테스트',
    remainAmt: 0,
    createdDatetime: '	2023-03-24T07:20:03.878Z'

}];


const foods: Food[] = [{

    name: 1,
    text2: '배추유나카드',
    text3: '10',
    text4: '25',
    fromDate: '2014-02-26',
    toDate: '2016-08-26',
    hi: '',

    model: '001',
    qr: '[003]'
}, {

    name: 2,
    text2: '한샘그룹카드',
    text3: '0',
    text4: '50',
    fromDate: '2018-09-16',
    toDate: '2020-08-06',
    hi: '',

    model: '001',
    qr: '[002]'

}, {

    name: 3,
    text2: '테스트용카드',
    text3: '50',
    text4: null,
    fromDate: '2022-02-26',
    toDate: '2022-11-26',
    hi: '',

    model: '002',
    qr: '[004]'

}, {

    name: 4,
    text2: 'hi',
    text3: '50',
    text4: '10',
    fromDate: '2022-12-26',
    toDate: '2023-01-26',
    hi: '4000',

    model: '001',
    qr: '[005]'
}, {

    name: 5,
    text2: 'kkkkkkk',
    text3: '0',
    text4: null,
    fromDate: '2023-02-26',
    toDate: '2023-03-26',
    hi: '',
    model: '001',
    qr: '[006]'

}];

const eats: Eat[] = [{

    id: 1,
    app1: 'xp',
    app2: 'xp1',
    app3: 'xp2',
    app4: 'xp테스트',
    app5: '20',
    model: '002'
}];

export class Eat {
    id: number;
    app1: string;
    app2: string;
    app3: string;
    app4: string;
    app5: string;
    model: string;
}

export class Food {
    name: number;
    text2: string;
    text3: string;
    text4: string;
    fromDate: string;
    toDate: string;
    model: string;
    hi: string;
    qr: string;

}


export class Order {
    ID: number;
    model: string;
    text1: string;
    remainAmt: number;
    createdDatetime: string;
}


export interface UserVO {
    tenant: string;
    uid: number;
    usr: string;
    actFlg: string;
    name: string;
    shortName: string;
    userGroup: string;
    companyId: number;
    company: string;
    tel: string;
    email: string;

    userType: string;
}

export interface MenuSearchVO {
    text: string;
    text1: string;

    text5: string;
    text6: string;
    text7: string;
    text8: string;
    text9: string;
    text10: string;
    title: string;
}

