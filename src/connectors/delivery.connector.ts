import {AxiosRequestConfig} from "axios";
import {CONFIG} from '../../main-config';
import {ReqAuth, ResAllBranches, ResAuth, ResErr} from '../../models';
import {WinstonLoggerWrapper} from '../winston-logger-wrapper';
import {Connector, ConnectorResponse, ConnectorResponseStatus} from "./connector";

export class EgressConnector extends Connector {
  private readonly url: string;
  private readonly timeout: number;
  constructor(url: string, timeout: number, trace: boolean) {
    super();
    this.url = url
    this.timeout = timeout
    super.setTrace(trace)
  }

  async getAccessToken(): Promise<ResAuth | string> {
    const accessReq = new ReqAuth;
    accessReq.login = CONFIG.life.login;
    accessReq.password = CONFIG.life.pass;
    accessReq.auth = 'password'
    const options: AxiosRequestConfig = this.createTokenOptions(JSON.stringify(accessReq));
    const LifeResponse: ConnectorResponse = await super.post(options);
    const result = this.TokenResponse(LifeResponse);
    if (!result) return "";
    return result
  }

  async getUserToken(login: string): Promise<ResAuth | string> {
    const accessReq = new ReqAuth;
    accessReq.my_login = login;
    accessReq.auth = 'password'
    accessReq.password = CONFIG.life.pass
    accessReq.login = CONFIG.life.login
    const options: AxiosRequestConfig = this.createTokenOptions(JSON.stringify(accessReq));
    const LifeResponse: ConnectorResponse = await super.post(options);
    const result = this.TokenResponse(LifeResponse);
    if (!result) return "";
    return result
  }

  //любой запрос post
  async postReq(request: Req): Promise<ResErr | string | any> {
    const req = JSON.stringify(request.request)
    const options: AxiosRequestConfig = this.createOptions(req);
    const resp: ConnectorResponse = await super.post(options)
    const result = this.EscResponse(resp, request.id);
    if (!result) return "";
    return result
  }



  private createOptions(data?: string): AxiosRequestConfig {

    const options: AxiosRequestConfig = {
      url: this.url,
      timeout: this.timeout,
    }
    if (data) {
      options.data = data
    }
    return options
  }

  private createTokenOptions(data: string | undefined = undefined): AxiosRequestConfig {

    const options: AxiosRequestConfig = {
      url: this.url,
      timeout: this.timeout,

      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (data) {
      options.data = data
    }
    return options
  }

  private TokenResponse(response: ConnectorResponse): ResAuth | string | undefined {
    const winstonWrapper = new WinstonLoggerWrapper();
    switch (response.status) {
      case ConnectorResponseStatus.SUCCESS:
        if ((response.httpStatusCode === 200) && (response.data)) {
          return response.data as ResAuth;
        } else {
          winstonWrapper.log('error', "ОШИБКА! DATA_ERROR! Не получен AccessToken! " + response.data);
          return "DATA_ERROR, Не получен AccessToken!";
        }
      case ConnectorResponseStatus.OPERATION_ERROR:
        let errMes = ""
        let error: any
        try {
          error = JSON.parse(response.data)
        } catch {
          errMes = response.httpStatusCode + ', ' + response.error;
        }
        if (!error?.businessError?.code) {
          errMes = response.httpStatusCode + ', ' + response.error;
        } else {
          errMes = error.businessError.code + ', ' + error.businessError.message
        }
        winstonWrapper.log('error', "ОШИБКА! OPERATION_ERROR! Не получен AccessToken! " + errMes);
        return errMes;
      case ConnectorResponseStatus.TIMEOUT_ERROR:
        winstonWrapper.log('error', "ОШИБКА! TIMEOUT_ERROR! Не удалось соединиться с сервером для получения AccessToken! ");
        return "TIMEOUT_ERROR, Не удалось соединиться с сервером для получения AccessToken!";
      case ConnectorResponseStatus.CONNECTION_ERROR:
        winstonWrapper.log('error', "ОШИБКА! CONNECTION_ERROR! Не удалось соединиться с сервером для получения AccessToken! ");
        return "CONNECTION_ERROR, Не удалось соединиться с сервером для получения AccessToken!";
      case ConnectorResponseStatus.CONFIG_ERROR:
        winstonWrapper.log('error', "ОШИБКА! CONFIG_ERROR! Не удалось соединиться с сервером для получения AccessToken! ");
        return "CONFIG_ERROR, Не удалось соединиться с сервером для получения AccessToken!";
      default:
        winstonWrapper.log('error', "ОШИБКА! UNKNOWN_ERROR! Не удалось соединиться с сервером для получения AccessToken! ");
        return "UNKNOWN_ERROR, Не удалось соединиться с сервером для получения AccessToken!";
    }

  }

  private EscResponse(response: ConnectorResponse, msgId: string): ResErr | string | undefined | ResAllBranches {

    switch (response.status) {
      case ConnectorResponseStatus.SUCCESS:
        if (response.httpStatusCode === 200) {
          return response.data;
        }

      default:
        return this.logErrors(response, msgId)
    }

  }

  private logErrors(response: ConnectorResponse, msgId: string) {
    const winstonWrapper = new WinstonLoggerWrapper();
    let errStr = 'Не удалось соединиться с сервером для получения информации!'
    switch (response.status) {
      case ConnectorResponseStatus.OPERATION_ERROR:
        let errMes = ""
        errMes = response.httpStatusCode + ', ' + response.httpStatusCode + ', ' + response.error;
        winstonWrapper.log('error', "ОШИБКА! OPERATION_ERROR! id = " + msgId + " Не получена информация! " + errMes);
        return errMes;
      case ConnectorResponseStatus.TIMEOUT_ERROR:
        winstonWrapper.log('error', "ОШИБКА! TIMEOUT_ERROR!  id = " + msgId + " " + errStr);
        return 504 + ', ' + "TIMEOUT_ERROR, " + errStr;
      case ConnectorResponseStatus.CONNECTION_ERROR:
        winstonWrapper.log('error', "ОШИБКА! CONNECTION_ERROR! id = " + msgId + " " + errStr);
        return 500 + ', ' + "CONNECTION_ERROR, " + errStr;
      case ConnectorResponseStatus.CONFIG_ERROR:
        winstonWrapper.log('error', "ОШИБКА! CONFIG_ERROR! id = " + msgId + " " + errStr);
        return 501 + ', ' + "CONFIG_ERROR, " + errStr;
      default:
        winstonWrapper.log('error', "ОШИБКА! UNKNOWN_ERROR! id = " + msgId + " " + errStr);
        return 500 + ', ' + "UNKNOWN_ERROR, " + errStr;
    }

  }
}

export interface Req {
  readonly id: string,
  readonly type: string,
  readonly request: any
}


export interface RegisterClientRes {
  readonly HttpResponseStatusCode: number,
}


