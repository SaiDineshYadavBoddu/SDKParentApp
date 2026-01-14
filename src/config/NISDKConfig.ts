import { languageType, NICardAttributes, NICardDetailsTextPositioning, NIConnectionProperties, NIDisplayAttributes, NIFontLabelPair, NiInputInterface, NILabels, NILanguageEnum, NIThemeEnum, themeType } from "@networkinternational/ni-card-management-sdk";
import { ImageURISource } from "react-native";

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

const textPositioning: NICardDetailsTextPositioning = {
  leftAlignment: 0.05,
  cardNumberGroupTopAlignment: 0.4,
  dateCvvGroupTopAlignment: 0.6,
  cardHolderNameGroupTopAlignment: 0.8,
};

const fonts: NIFontLabelPair[] = [
  /// Card Details
  {
    font: { name: 'Helvetica', size: 14 },
    label: NILabels.cardNumberLabel,
  },
  {
    font: { name: 'Helvetica', size: 14 },
    label: NILabels.cardNumberValueLabel,
  },
  {
    font: { name: 'Helvetica', size: 14 },
    label: NILabels.expiryDateLabel,
  },
  {
    font: { name: 'Helvetica', size: 14 },
    label: NILabels.expiryDateValueLabel,
  },
  { font: { name: 'Helvetica', size: 14 }, label: NILabels.cvvLabel },
  { font: { name: 'Helvetica', size: 14 }, label: NILabels.cvvValueLabel },
  {
    font: { name: 'Helvetica', size: 14 },
    label: NILabels.cardholderNameLabel,
  },
  /// Set PIN
  {
    font: { name: 'Helvetica', size: 14 },
    label: NILabels.setPinDescriptionLabel,
  },
  /// Change PIN
  {
    font: { name: 'Helvetica', size: 14 },
    label: NILabels.changePinDescriptionLabel,
  },
  /// View PIN
  {
    font: { name: 'Helvetica', size: 18 },
    label: NILabels.viewPinDescriptionLabel,
  },
  {
    font: { name: 'Helvetica', size: 18 },
    label: NILabels.viewPinCountDownDescription,
  },
  { font: { name: 'Helvetica', size: 18 }, label: NILabels.pinDigitLabel },
];

const ROOT_URL = 'https://api.sit.corporate.un.infradev.w4.az.network.ae/api/mine/'
// isUAT
//   ? 'https://api-uat.network.global/sdk/v2'
//   : 'https://api.network.global/sdk/v2';
const BANK_CODE = '333';
const CARD_TYPE = 'EXID';

const connectionProperties = (token: string) => {
  return {
    rootUrl: ROOT_URL,
    token: token,
    extraHeaders: JSON.stringify({
      "apiuat_za_network_global": "qWyQt3D44Upner1T",
      "traceparent": getTraceparent()
    }),
  } as NIConnectionProperties;
};

export const TEST_VIEW_CARD = (
  token: string,
  CardId: string,
): NiInputInterface => {
  const backgroundImage: ImageURISource = require('../assets/images/cardbackground.png')
  const cardAttributes: NICardAttributes = {
    shouldHide: true,
    backgroundImage: backgroundImage,
    textPositioning: textPositioning,
  };
  const displayAttributes: NIDisplayAttributes = {
    theme: NIThemeEnum.light as themeType,
    language: NILanguageEnum.english as languageType,
    fonts: fonts,
    cardAttributes: cardAttributes,
  };
  return {
    bankCode: BANK_CODE,
    cardIdentifierId: CardId,
    cardIdentifierType: CARD_TYPE,
    connectionProperties: connectionProperties(token),
    displayAttributes: displayAttributes,
    timer: 5,
  };
};

export const TEST_INPUT = (token: string, CardId: string) => {
  return {
    bankCode: BANK_CODE,
    cardIdentifierId: CardId,
    cardIdentifierType: CARD_TYPE,
    connectionProperties: connectionProperties(token),
    timer: 5,
  } as NiInputInterface;
};