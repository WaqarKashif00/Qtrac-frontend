
export class BaseMockLogic {
    executeMethod(obj: any, method: any, body: any): any {
        return  obj[method](body);
      }
}
