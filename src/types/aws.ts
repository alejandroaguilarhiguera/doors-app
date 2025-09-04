export interface Thing {
    thingName: string;
    thingArn: string;
    attributes: { [key: string]: string | number };
    version:number;
}
export interface Code {
  id: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadGenerateCode {
  message: string;
  code: Code;
}