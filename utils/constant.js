export const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? (IS_IPHONE_X ? 44 : 20) : StatusBar.currentHeight;
