/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { logger } from "@utils/logger";

if (__DEV__) {
  console.log = logger.debug;
  console.warn = logger.warn;
  console.error = logger.error;
  console.info = logger.info;
  console.data = logger.data;
}

AppRegistry.registerComponent(appName, () => App);
