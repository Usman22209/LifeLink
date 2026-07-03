import { useEffect, useState } from "react";
import DeviceInfo from "react-native-device-info";

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    brand: "",
    model: "",
    systemName: "",
    systemVersion: "",
    appVersion: "",
    deviceId: "",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const brand = DeviceInfo.getBrand();
      const model = DeviceInfo.getModel();
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const appVersion = DeviceInfo.getVersion();
      const deviceId = DeviceInfo.getDeviceId();

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
