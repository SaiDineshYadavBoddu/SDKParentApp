import { NIConnectionProperties, NiInputInterface } from "@networkinternational/ni-card-management-sdk";
import { Logger } from "../utils/logger";

const generateHexString = (length: number) => {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getTraceparent = () => {
  const traceId = generateHexString(32);
  const spanId = generateHexString(16);
  return `00-${traceId}-${spanId}-01`;
};

const ROOT_URL = 'https://api.sit.corporate.un.infradev.w4.az.network.ae/api/mine/secured-cards'
const CARD_TYPE = 'EXID';

const connectionProperties = (token: string, actionToken?: string) => {
  const traceparent = getTraceparent();
  Logger.log('🚀 ~ NI SDK ROOT_URL:', ROOT_URL);
  Logger.log('🚀 ~ NI SDK traceparent:', traceparent);

  const headers: any = {
    "apiuat_za_network_global": "qWyQt3D44Upner1T",
    "traceparent": traceparent
  };

  if (actionToken) {
    headers["Action-Authorization"] = `Bearer ${actionToken}`;
  }

  return {
    rootUrl: ROOT_URL,
    token: token,
    extraHeaders: JSON.stringify(headers),
  } as NIConnectionProperties;
};

export const TEST_INPUT = (token: string, CardId: string, bankCode: string, actionToken?: string) => {
  Logger.log('🚀 ~ NI SDK bankCode:', bankCode);
  return {
    bankCode: bankCode,
    cardIdentifierId: CardId,
    cardIdentifierType: CARD_TYPE,
    connectionProperties: connectionProperties(token, actionToken),
  } as NiInputInterface;
};