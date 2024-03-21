export type Message = {
  messageId: number;
  payload: string;
};

export type ResponseMessage = {
  responseMessage: string;
  responseTime: string;
};

export type MessageWithError = {
  messageId: number;
};
