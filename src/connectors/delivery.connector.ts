import {AxiosRequestConfig} from "axios";
import {Error} from '../models';
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

  //любой запрос post
  async postReq(request: Req): Promise<Error | string | any> {
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

  private EscResponse(response: ConnectorResponse, msgId: string): Error | string | undefined | any {

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


