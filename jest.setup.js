jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    TouchableHighlight: View,
    TouchableNativeFeedback: View,
    TouchableOpacity: View,
    TouchableWithoutFeedback: View,
    Directions: {},
    PanGestureHandler: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: require('react-native').FlatList,
    gestureHandlerRootHOC: jest.fn((Component) => Component),
  };
});

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

jest.mock('react-native-screens', () => {
  const View = require('react-native').View;
  return {
    enableScreens: jest.fn(),
    Screen: View,
    ScreenContainer: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    ScreenStackHeaderBackButtonImage: View,
    ScreenStackHeaderCenterView: View,
    ScreenStackHeaderLeftView: View,
    ScreenStackHeaderRightView: View,
    ScreenStackHeaderSearchBarView: View,
    SearchBar: View,
    FullWindowOverlay: View,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const View = require('react-native').View;
  return {
    SafeAreaProvider: View,
    SafeAreaView: View,
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 375, height: 812 })),
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn().mockResolvedValue(undefined),
    registerPlaybackService: jest.fn(),
    addEventListener: jest.fn(),
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    reset: jest.fn().mockResolvedValue(undefined),
    add: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn().mockResolvedValue({ isInternetReachable: true }),
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [
    { languageCode: 'en', countryCode: 'US', languageTag: 'en-US', isRTL: false },
  ]),
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/path',
  downloadFile: jest.fn(),
  exists: jest.fn().mockResolvedValue(false),
  stat: jest.fn(),
  unlink: jest.fn(),
  mkdir: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock('react-native-video', () => 'Video');

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native-elements', () => {
  const View = require('react-native').View;
  return {
    SearchBar: View,
    Button: View,
  };
});

jest.mock('react-native-progress-circle', () => 'ProgressCircle');
