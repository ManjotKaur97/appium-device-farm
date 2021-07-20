import Devices, {
  listAllDevices,
  findUserSpecifiesDevices,
} from '../../src/Devices';

describe('Devices', () => {
  const deviceMock = [
    {
      busy: true,
      state: 'device',
      udid: 'emulator-5555',
      platform: 'android',
    },
    {
      busy: false,
      state: 'device',
      udid: 'emulator-5554',
      platform: 'android',
    },
    {
      busy: false,
      state: 'device',
      udid: 'emulator-5556',
      platform: 'android',
    },
    {
      name: 'iPad Air',
      udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888',
      state: 'Shutdown',
      sdk: '13.5',
      platform: 'ios',
      busy: true,
      realDevice: false,
    },
    {
      name: 'iPad Air (3rd generation)',
      udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
      state: 'Shutdown',
      sdk: '13.5',
      platform: 'ios',
      busy: false,
      realDevice: false,
    },
  ];

  it('Get Free device for iOS Platform', async () => {
    const devices = new Devices(deviceMock);

    const freeDevice = await devices.getFreeDevice('ios');

    expect(freeDevice).toStrictEqual({
      name: 'iPad Air (3rd generation)',
      udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
      state: 'Shutdown',
      sdk: '13.5',
      platform: 'ios',
      busy: false,
      realDevice: false,
    });
  });

  it('Get Free device for android Platform', async () => {
    const devices = new Devices(deviceMock);

    const freeDevice = await devices.getFreeDevice('android');

    expect(freeDevice).toStrictEqual({
      busy: false,
      state: 'device',
      udid: 'emulator-5554',
      platform: 'android',
    });
  });

  it('Block device should set busy state to true', async () => {
    const devices = new Devices(deviceMock);

    const freeDevice = await devices.getFreeDevice('android');
    await devices.blockDevice(freeDevice);
    const deviceList = await listAllDevices().find(
      (device) => freeDevice.udid === device.udid
    );

    expect(deviceList).toStrictEqual({
      busy: true,
      state: 'device',
      udid: 'emulator-5554',
      platform: 'android',
    });
  });

  it('UnBlock device should set busy state to false', async () => {
    const devices = new Devices(deviceMock);
    const blockedDevice = deviceMock.find((device) => device.busy === true);

    const unblockedDevice = await devices.unblockDevice(blockedDevice);

    expect(unblockedDevice).toStrictEqual({
      busy: false,
      state: 'device',
      udid: 'emulator-5555',
      platform: 'android',
    });
  });

  it('Filter only user specified devices', async () => {
    const userSpecifiedUDIDS = [
      'emulator-5556',
      '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888',
    ];

    const filteredDevices = findUserSpecifiesDevices(
      userSpecifiedUDIDS,
      deviceMock
    );

    expect(filteredDevices).toStrictEqual([
      {
        busy: false,
        state: 'device',
        udid: 'emulator-5556',
        platform: 'android',
      },
      {
        name: 'iPad Air',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        busy: true,
        realDevice: false,
      },
    ]);
  });
});