import { NIConnectionProperties, NiInputInterface } from "@networkinternational/ni-card-management-sdk";


const ROOT_URL = 'https://api.sit.corporate.un.infradev.w4.az.network.ae/api'
// isUAT
//   ? 'https://api-uat.network.global/sdk/v2'
//   : 'https://api.network.global/sdk/v2';
const BANK_CODE = '333';
const CARD_TYPE = 'EXID';

const connectionProperties = (token: string) => {
  console.log(ROOT_URL, "urll")
  return {
    rootUrl: ROOT_URL,
    token: token,
    extraHeaders: '{ "apiuat_za_network_global": "qWyQt3D44Upner1T" }',
  } as NIConnectionProperties;
};

export const TEST_INPUT = (token: string, CardId: string) => {
  return {
    bankCode: BANK_CODE,
    cardIdentifierId: CardId,
    cardIdentifierType: CARD_TYPE,
    connectionProperties: connectionProperties(token),
  } as NiInputInterface;
};