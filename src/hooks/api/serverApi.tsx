import axios from 'axios';

export const testServerConnectionApi = (host: string, port: string): Promise<any> => {
  const request = {
    url: port ? `${host}:${port}/WebService/WebService.asmx/TestServer` : host,
    method: 'get',
    timeout: 1000
  };
  return axios(request);
};
