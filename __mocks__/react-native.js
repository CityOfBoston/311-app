// @flow

const reactNative = require('react-native');

jest.mock('Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
  };
});

// eslint-disable-next-line no-undef
module.exports = reactNative;
