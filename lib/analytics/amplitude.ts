"use client";

import { init, track } from "@amplitude/analytics-browser";

type AmplitudeEventProperties = Record<string, string | number | boolean | null | undefined>;

let isInitialized = false;

const getApiKey = (): string | undefined => process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

const canUseDom = (): boolean => typeof window !== "undefined";

export const initializeAmplitude = (): void => {
  if (isInitialized || !canUseDom()) {
    return;
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    return;
  }

  init(apiKey, undefined, {
    defaultTracking: {
      attribution: true,
      pageViews: false,
      sessions: true
    }
  });

  isInitialized = true;
};

export const trackAmplitudeEvent = (
  eventName: string,
  eventProperties?: AmplitudeEventProperties
): void => {
  if (!canUseDom()) {
    return;
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    return;
  }

  if (!isInitialized) {
    initializeAmplitude();
  }

  track(eventName, eventProperties);
};
