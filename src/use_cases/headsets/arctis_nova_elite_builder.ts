import SimpleHeadphone from '../../interfaces/simple_headphone';
import SpecificBuilder from '../../interfaces/specific_builder';
import KnownHeadphone from '../../models/known_headphone';

// Arctis Nova Elite (ProductID 0x2244)
//
// HID Report format (command [0x06, 0xb0], 64 bytes):
//   idx 0:  Report ID (0x01 for Elite, differs from Nova Pro's 0x06)
//   idx 1:  Command echo (0xb0)
//   idx 4:  Connection type (4 = wireless connected)
//   idx 5:  Unknown (always 1, does NOT indicate battery presence - tested with 0-3 USB connections)
//   idx 6:  Headset battery — direct percentage 0-100%
//   idx 7:  Base/spare battery — direct percentage 0-100% (0 = no battery OR dead battery)
//   idx 8:  Headset charge status (8 = discharging)
//   idx 10: Unknown (always 2)
//   idx 15: Charging status (1 = not connected, 2 = charging, 8 = discharging)
//   idx 16: Unknown (observed value: 3)
//
// Battery resolution: Both headset and base report DIRECT percentages (0-100),
// confirmed by observing non-12.5%-increment values (e.g. 55%, 79%, 82%).
// This is higher precision than the Nova Pro Wireless which uses 0-8 steps.
//
// NOTE: idx5 does NOT indicate battery presence for Elite (unlike Nova Pro).
// Battery presence is detected by idx7 > 0. A battery at exactly 0% is
// indistinguishable from an empty slot at the HID level - the dead battery
// detection in arctis-monitor handles this by tracking stuck 0-1% values.
export default class ArctisNovaEliteBuilder implements SpecificBuilder {
  execute(report: number[], knownHeadphone: KnownHeadphone): SimpleHeadphone {
    if (report.length === 0) {
      return { isConnected: false } as SimpleHeadphone;
    }

    // Nova Elite reports battery as direct percentage (0-100)
    let batteryPercent: number | undefined = report[knownHeadphone.batteryPercentIdx];
    let batteryPercent2: number | undefined;
    let hasBattery2: boolean | undefined;

    // Read battery2 percentage (direct 0-100 value)
    // Elite always has a battery slot, so always report the value.
    // If idx7 == 0, it could be either:
    //   - Empty slot (no battery inserted)
    //   - Dead battery at 0% (stuck, not charging)
    // The dead battery detection in arctis-monitor tracks values stuck at 0-1%
    // over multiple poll cycles to distinguish dead batteries from empty slots.
    if (knownHeadphone.batteryPercentIdx2 !== undefined) {
      const rawBattery2 = report[knownHeadphone.batteryPercentIdx2];
      // Battery is present if value > 0, but always report the value
      // so dead battery detection can track 0% batteries
      hasBattery2 = rawBattery2 > 0;
      batteryPercent2 = rawBattery2;
    }

    let isConnected = false;
    let isCharging: boolean | undefined;
    let isDischarging: boolean | undefined;

    if (knownHeadphone.chargingStatusIdx) {
      switch (report[knownHeadphone.chargingStatusIdx]) {
        case 1:
          isConnected = false;
          isCharging = undefined;
          isDischarging = undefined;
          batteryPercent = undefined;
          break;
        case 2:
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
