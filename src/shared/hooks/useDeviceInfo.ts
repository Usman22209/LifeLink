
import { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    brand: '',
    model: '',
    systemName: '',
    systemVersion: '',
    appVersion: '',
    deviceId: '',
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const brand = DeviceInfo.getBrand();
      const model = await DeviceInfo.getModel();
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = await DeviceInfo.getSystemVersion();
      const appVersion = await DeviceInfo.getVersion();
      const deviceId = await DeviceInfo.getDeviceId();

      setDeviceInfo({
        brand,
        model,
        systemName,
        systemVersion,
        appVersion,
        deviceId,
      });
    };

    fetchInfo();
  }, []);

  return deviceInfo;
};
