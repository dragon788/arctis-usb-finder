import SimpleHeadphone from '../../interfaces/simple_headphone';
import SpecificBuilder from '../../interfaces/specific_builder';
import KnownHeadphone from '../../models/known_headphone';
import { calculateBattery } from '../../utils/battery_helpers';

// Arctis Nova Pro Wireless (ProductID 0x12E0)
//
// HID Report format (command [0x06, 0xb0], 64 bytes):
//   idx 0:  Report ID (0x06)
//   idx 1:  Command echo (0xb0)
//   idx 4:  Connection type (1 = wireless connected)
//   idx 5:  Battery 2 present flag (Nova Pro hot-swap battery slot)
//   idx 6:  Headset battery — raw value 0-8
//   idx 7:  Base/spare battery — raw value 0-8
//   idx 8:  Unknown (observed: 1 when connected)
//   idx 11: Unknown (observed: 10)
//   idx 14: Unknown (observed: 8, possibly max battery scale)
//   idx 15: Charging status (1 = not connected, 2 = charging, 4 = wired+wireless, 8 = discharging)
//
// Battery resolution: ONLY 9 discrete levels (0-8 mapped to 0-100%).
// Mapped values: 0%, 12%, 25%, 37%, 50%, 62%, 75%, 87%, 100%
// This is a firmware limitation — confirmed by probing all available HID commands
// (0xb0, 0xb5, 0xb7, 0x12, 0x20) across both usagePage interfaces (0xffc0, 0xff00).
// No finer-grained battery data is available from this device.
export default class ArctisNovaProWirelessBuilder implements SpecificBuilder {
  execute(report: number[], knownHeadphone: KnownHeadphone): SimpleHeadphone {
    if (report.length === 0) {
      return { isConnected: false } as SimpleHeadphone;
    }

    // Headset battery uses mapped 0-8 range
    let batteryPercent: number | undefined = calculateBattery(report[knownHeadphone.batteryPercentIdx], 0, 8);
    let batteryPercent2: number | undefined;
    let hasBattery2: boolean | undefined;

    // Read battery2 percentage (0-8 range mapped to 0-100)
    if (knownHeadphone.batteryPercentIdx2 !== undefined) {
      const rawBattery2 = report[knownHeadphone.batteryPercentIdx2];
      // Battery is present if raw value > 0 (charging/charged battery)
      // Index 5 presence detection doesn't work reliably for Nova Pro
      if (rawBattery2 > 0) {
        hasBattery2 = true;
        batteryPercent2 = calculateBattery(rawBattery2, 0, 8);
      }
    }

    let isConnected = false;
    let isCharging: boolean | undefined;
    let isDischarging: boolean | undefined;

    if (knownHeadphone.chargingStatusIdx) {
      switch (report[knownHeadphone.chargingStatusIdx]) {
        case 1:
          // Not wirelessly connected - base station can't read headset battery via USB charge cable
          // Clear batteryPercent since it's always 0 (unknown) in this state
          isConnected = false;
          isCharging = undefined;
          isDischarging = undefined;
          batteryPercent = undefined;
          break;
        case 2:
        case 4: // wired charging while wirelessly connected
          isConnected = true;
          isCharging = true;
          isDischarging = false;
          break;
        case 8:
          isConnected = true;
          isCharging = false;
          isDischarging = true;
          break;
      }
    }

    return { batteryPercent, batteryPercent2, hasBattery2, isConnected, isCharging, isDischarging } as SimpleHeadphone;
  }
}
