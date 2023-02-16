/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : api-result.ts
 * Author : jbh5310
 * Lastupdate : 2021-03-17 11:03:04
 */

export interface ApiResult<T> {
  success: boolean;
  code: string;
  msg: string;
  data: T;
}
