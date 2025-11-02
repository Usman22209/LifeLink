const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");
const { withSentryConfig } = require("@sentry/react-native/metro");

const projectRoot = __dirname;
const srcRoot = path.join(projectRoot, "src");

const defaultConfig = getDefaultConfig(__dirname);

// ✅ Extend the asset resolver to include `.tflite`
const assetExts = defaultConfig.resolver.assetExts
  ? defaultConfig.resolver.assetExts.filter(ext => ext !== "svg").concat(["tflite"])
  : ["tflite"];

const sourceExts = defaultConfig.resolver.sourceExts || [];

const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts, // ✅ Add .tflite here, exclude SVG
    sourceExts: [...sourceExts, "svg"], // Keep SVG + JS/TS
    extraNodeModules: {
      "@assets": path.join(srcRoot, "assets"),
      "@theme": path.join(srcRoot, "shared", "theme"),
      "@components": path.join(srcRoot, "shared", "components"),
      "@hooks": path.join(srcRoot, "shared", "hooks"),
      "@utils": path.join(srcRoot, "shared", "utils"),
      "@screens": path.join(srcRoot, "screens"),
      "@services": path.join(srcRoot, "shared", "services"),
      "@config": path.join(srcRoot, "shared", "config"),
      "@shared": path.join(srcRoot, "shared"),
      "@navigation": path.join(srcRoot, "navigation"),
      "@store": path.join(srcRoot, "store"),
      "@providers": path.join(srcRoot, "shared", "providers"),
    },
  },
  watchFolders: [srcRoot],
};

// Merge with default config and wrap with Sentry
const mergedConfig = mergeConfig(defaultConfig, config);
module.exports = withSentryConfig(mergedConfig);