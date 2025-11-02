import { Capacitor } from '@capacitor/core';

export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

export const isMobile = (): boolean => {
  return !isWeb();
};

export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};