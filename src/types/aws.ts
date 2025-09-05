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

export interface KynesisStream {
  DeviceName: string;
  StreamName: string;
  StreamARN: string;
  MediaType: string;
  KmsKeyId: string;
  Version: string;
  Status: string;
  CreationTime: string;
  DataRetentionInHours: number
}