interface SimpleHeadphone {
  batteryPercent: number | undefined;
  batteryPercent2: number | undefined;
  hasBattery2: boolean | undefined; // true if base station has a battery present
  modelName: string;
  modelNumber: string | undefined;  // Hardware model number (e.g., HS25TX, HS25TXX)
  notes: string | undefined;        // Additional notes about the device
  vendorId: number;
  productId: number;
  isMuted: boolean | undefined;
  isConnected: boolean | undefined;
  isCharging: boolean | undefined;
  isDischarging: boolean | undefined;
  gameVolume: number | undefined;
  chatVolume: number | undefined;
  path: string | undefined;
  interfaceNum: number;
  usagePage: number;
  usage: number;
}

export default SimpleHeadphone;
