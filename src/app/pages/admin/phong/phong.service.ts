import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Injectable({
    providedIn: 'root'
})

export class PhongService {
    httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/tran`;
    Test

    constructor(private http: JHttpService) {
    }

    getOders() {
        return orders;
    }

    getTests() {
        return tests;
    }

    async sendPost(data: any, command?: string): Promise<ApiResult<any>> {
        const url = `${this.httpUrl}/${command}`;

        try {
            return await this.http.post<ApiResult<any>>(url, data).toPromise();
        } catch (e) {
            return COMMONINITDATA.DEFAULT_POST_API_ERROR;
        }
    }
}

const orders: Order[] = [{
    ID: 1,
    text1: '테스트지역',
    num: 3,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '001',
}, {
    ID: 2,
    text1: '나먕쥬',
    num: 2,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '002',
}, {
    ID: 3,
    text1: '서울',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 4,
    text1: '뭐지이게',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 5,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 6,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 7,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 8,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 9,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 10,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 11,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 12,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 13,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 14,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 15,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 16,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 17,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 18,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 19,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 20,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 21,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 22,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 23,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 24,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 25,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 26,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 27,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 28,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 29,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 30,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 31,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 32,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 33,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 34,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 35,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 36,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 37,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 38,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 39,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 40,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 41,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 42,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 43,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 44,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 45,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 46,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 47,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 48,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 49,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 50,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 51,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 52,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 53,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 54,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 55,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 56,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 57,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 58,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 59,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 60,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 61,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 62,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 63,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 64,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 65,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 66,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 67,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 68,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 69,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
}, {
    ID: 70,
    text1: 'buu',
    num: 0,
    Datetime: '3/24/2023, 1:49:58 PM',
    model: '003',
},];

export class Order {
    ID: number;
    text1: string;
    num: number;
    Datetime: string;
    model: string;
}

const tests: Test[] = [{
    id: 1,
    name: '8층테스트',
    famous: '홍아무개',
    add: '서울특별시 광진구 구의강변로 30 (구의동) 목림빌딩	',
    phone: '02) 123-1231',
    mail: 'atpos101@astems.co.kr',
    model: '001',
}, {
    id: 2,
    name: 'ASTEMS교육장(매장)3',
    famous: '홍길동',
    add: '서울 광진구 구의동  599',
    phone: '02) 000-0000',
    mail: '	atpos103@astems.co.krr',
    model: '001',
},
    {
        id: 3,
        name: 'SCR테스트',
        famous: '홍길동',
        add: '서울 광진구 구의동  599',
        phone: '02) 000-0000',
        mail: '	atpos104@astems.co.krr',
        model: '001',
    }, {
        id: 4,
        name: 'ASTEMS교육장(매장)2',
        famous: '홍길동',
        add: '서울 광진구 구의동  599',
        phone: '02) 000-0000',
        mail: '	atpos102@astems.co.krr',
        model: '002',
    }, {
        id: 5,
        name: '10층교육장',
        famous: '홍길동',
        add: '서울 광진구 구의동  599',
        phone: '02) 453-5200',
        mail: 'atpos105@astems.co.krr',
        model: '002',
    },];

export class Test {
    id: number;
    name: string;
    famous: string;
    add: string;
    phone: string;
    mail: string;
    model: string;
}
