import KnownHeadphone, { KnownHeadphoneFactory } from './models/known_headphone';

const writeBytes6and24 = {
  writeBytes: [0x06, 0x18],
  usagePage: 0,
  usage: 0,
  interfaceNum: 0x05,
  batteryPercentIdx: 2
};
const writeBytes6and18 = {
  writeBytes: [0x06, 0x12],
  usagePage: 0xff43,
  usage: 0x202,
  interfaceNum: 0x03,
  batteryPercentIdx: 3,
  chargingStatusIdx: 4
};
const writeBytes6and176 = {
  writeBytes: [0x00, 0xb0],
  usagePage: 0xffc0,
  usage: 0x1,
  interfaceNum: 3,
  batteryPercentIdx: 2,
  chargingStatusIdx: 3
};

const writeBytes6and176_chatmix = {
  writeBytes: [0x00, 0xb0],
  usagePage: 0xffc0,
  usage: 0x1,
  interfaceNum: 3,
  batteryPercentIdx: 2,
  chargingStatusIdx: 3,
  gameVolumeIdx: 4,
  chatVolumeIdx: 5
};


const list: KnownHeadphone[] = [
  KnownHeadphoneFactory({
    name: 'Arctis Pro Wireless',
    productId: KnownHeadphone.ArctisPro_Wireless_ProductID,
    writeBytes: [0x40, 0xaa],
    usagePage: 0,
    usage: 0,
    interfaceNum: 0,
    batteryPercentIdx: 0
  }),
  // Nova Pro Wireless: battery values 0-8 (mapped to 0-100% in 9 steps)
  // Base station labeled "Base Station (Nova Pro)" - compatible with Nova Pro Wireless headsets
  KnownHeadphoneFactory({
    name: 'Arctis Nova Pro Wireless',
    productId: KnownHeadphone.Arctis_Nova_Pro_Wireless_ProductID,
    writeBytes: [0x06, 0xb0],
    usagePage: 0xffc0,
    usage: 0x1,
    interfaceNum: 4,
    batteryPercentIdx: 6,       // headset battery (raw 0-8)
    batteryPercentIdx2: 7,      // hot-swap slot battery (raw 0-8)
    batteryPresentIdx2: 5,      // 1 = battery present, 0 = no battery
    chargingStatusIdx: 15,      // 1=disconnected, 2=charging, 4=wired+wireless, 8=discharging
    modelNumber: 'HS25TX',
    notes: 'Base station labeled "Base Station (Nova Pro)". Has USB 1 + USB 2 ports. Compatible with Nova Pro Wireless headsets.'
  }),
  // Nova Pro Wireless Xbox: same HID protocol, different port labels (XBOX + USB instead of USB 1 + USB 2)
  // Base station labeled "Arctis Nova Pro Wireless" - designed specifically for Xbox
  KnownHeadphoneFactory({
    name: 'Arctis Nova Pro Wireless Xbox',
    productId: KnownHeadphone.Arctis_Nova_Pro_Wireless_Xbox_ProductID,
    writeBytes: [0x06, 0xb0],
    usagePage: 0xffc0,
    usage: 0x1,
    interfaceNum: 4,
    batteryPercentIdx: 6,       // headset battery (raw 0-8)
    batteryPercentIdx2: 7,      // hot-swap slot battery (raw 0-8)
    batteryPresentIdx2: 5,      // 1 = battery present, 0 = no battery
    chargingStatusIdx: 15,      // 1=disconnected, 2=charging, 4=wired+wireless, 8=discharging
    modelNumber: 'HS25TXX',
    notes: 'Base station labeled "Arctis Nova Pro Wireless". Has XBOX + USB ports. Xbox port does not present as HID device to Mac/PC - must use USB port for battery monitoring.'
  }),
  // Nova Pro Wireless in bootloader mode - needs firmware update via SteelSeries GG
  // Device won't respond to battery commands in this state
  KnownHeadphoneFactory({
    name: 'Arctis Nova Pro Wireless (Bootloader Mode)',
    productId: KnownHeadphone.Arctis_Nova_Pro_Wireless_Bootloader_ProductID,
    writeBytes: [0x06, 0xb0],
    usagePage: 0,
    usage: 0,
    interfaceNum: 0,
    batteryPercentIdx: 0,
    notes: 'Device is in bootloader/firmware update mode. Launch SteelSeries GG to complete firmware update.'
  }),
  // Nova Elite: battery values are direct percentages (0-100%)
  // NOTE: idx5 does NOT indicate battery presence for Elite (always 1)
  // Battery presence is detected by idx7 > 0
  KnownHeadphoneFactory({
    name: 'Arctis Nova Elite',
    productId: KnownHeadphone.Arctis_Nova_Elite_ProductID,
    writeBytes: [0x06, 0xb0],
    usagePage: 0xffc0,
    usage: 0x1,
    interfaceNum: 3,
    batteryPercentIdx: 6,       // headset battery (direct 0-100%)
    batteryPercentIdx2: 7,      // base spare battery (direct 0-100%, 0 = empty or dead)
    // batteryPresentIdx2 not used for Elite - idx5 doesn't indicate battery presence
    chargingStatusIdx: 15       // 1=disconnected, 2=charging, 8=discharging
  }),

  KnownHeadphoneFactory({
    name: 'Arctis 7 2017',
    productId: KnownHeadphone.Arctis7_2017_ProductID,
    ...writeBytes6and24
  }),
  KnownHeadphoneFactory({
    name: 'Arctis 7 2019',
    productId: KnownHeadphone.Arctis7_2019_ProductID,
    ...writeBytes6and24
  }),
  KnownHeadphoneFactory({
    name: 'Arctis Pro 2019',
    productId: KnownHeadphone.ArctisPro_2019_ProductID,
    ...writeBytes6and24
  }),
  KnownHeadphoneFactory({
    name: 'Arctis Pro GameDac',
    productId: KnownHeadphone.ArctisPro_GameDac_ProductID,
    ...writeBytes6and24
  }),

  KnownHeadphoneFactory({
    name: 'Arctis 9',
    productId: KnownHeadphone.Arctis9_ProductID,
    writeBytes: [0x0, 0x20],
    usagePage: 0,
    usage: 0,
    interfaceNum: 0,
    batteryPercentIdx: 3,
    chargingStatusIdx: 4
  }),

  KnownHeadphoneFactory({
    name: 'Arctis 1 Wireless',
    productId: KnownHeadphone.Arctis1W_ProductID,
    ...writeBytes6and18
  }),
  KnownHeadphoneFactory({
    name: 'Arctis 1 Xbox',
    productId: KnownHeadphone.Arctis1X_ProductID,
    ...writeBytes6and18
  }),
  KnownHeadphoneFactory({
    name: 'Arctis 7X',
    productId: KnownHeadphone.Arctis7X_ProductID,
    ...writeBytes6and18,
    micStatusIdx: 5
  }),
  KnownHeadphoneFactory({
    name: 'Arctis 7P',
    productId: KnownHeadphone.Arctis7P_ProductID,
    ...writeBytes6and18
  }),

  KnownHeadphoneFactory({
    name: 'Arctis 7 Plus',
    productId: KnownHeadphone.Arctis7_Plus_ProductID,
    ...writeBytes6and176
  }),
  KnownHeadphoneFactory({
    name: 'Arctis 7P Plus',
    productId: KnownHeadphone.Arctis7P_Plus_ProductID,
    ...writeBytes6and176
  }),
  KnownHeadphoneFactory({
    name: 'Arctis 7X Plus',
    productId: KnownHeadphone.Arctis7X_Plus_ProductID,
    ...writeBytes6and176
  }),
  KnownHeadphoneFactory({
    name: 'Arctis 7 Destiny Plus',
    productId: KnownHeadphone.Arctis7_Plus_Destiny_ProductID,
    ...writeBytes6and176
  }),

  KnownHeadphoneFactory({
    name: 'Arctis Nova 7',
    productId: KnownHeadphone.ArctisNova7_ProductID,
    ...writeBytes6and176_chatmix
  }),
  KnownHeadphoneFactory({
    name: 'Arctis Nova 7X',
    productId: KnownHeadphone.ArctisNova7X_ProductID,
    ...writeBytes6and176
  }),
  KnownHeadphoneFactory({
    name: 'Arctis Nova 7P',
    productId: KnownHeadphone.ArctisNova7P_ProductID,
    ...writeBytes6and176
  }),
  KnownHeadphoneFactory({
    name: 'Arctis Nova 7X V2',
    productId: KnownHeadphone.ArctisNova7X_V2_ProductID,
    ...writeBytes6and176
  }),
  KnownHeadphoneFactory({
    name: 'Arctis Nova 7 Diablo IV',
    productId: KnownHeadphone.ArctisNova7_Diablo_IV_ProductID,
    ...writeBytes6and176
  })
];

export default list;
