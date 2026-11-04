import prisma from '../config/database.js';

const FEEDBACK_SETTING_KEY = 'feedback_enabled';
const RSVP_SETTING_KEY = 'rsvp_enabled';
const MEMORY_SHARING_SETTING_KEY = 'memory_sharing_enabled';
const WEDDING_PHASE_SETTING_KEY = 'wedding_phase';

const isSettingEnabled = async (key) => {
  const setting = await prisma.appSetting.findUnique({
    where: { key },
  });

  return setting ? setting.value === 'true' : true;
};

const updateSetting = async (key, enabled) => {
  await prisma.appSetting.upsert({
    where: { key },
    create: { key, value: String(enabled) },
    update: { value: String(enabled) },
  });

  return enabled;
};

export const isFeedbackEnabled = () => isSettingEnabled(FEEDBACK_SETTING_KEY);
export const updateFeedbackEnabled = (enabled) => updateSetting(FEEDBACK_SETTING_KEY, enabled);
export const isRSVPEnabled = () => isSettingEnabled(RSVP_SETTING_KEY);
export const updateRSVPEnabled = (enabled) => updateSetting(RSVP_SETTING_KEY, enabled);
export const isMemorySharingEnabled = () => isSettingEnabled(MEMORY_SHARING_SETTING_KEY);
export const updateMemorySharingEnabled = (enabled) => updateSetting(MEMORY_SHARING_SETTING_KEY, enabled);

export const getWeddingPhase = async () => {
  const setting = await prisma.appSetting.findUnique({
    where: { key: WEDDING_PHASE_SETTING_KEY },
  });

  return setting?.value === 'after' ? 'after' : 'before';
};

export const updateWeddingPhase = async (phase) => {
  await prisma.appSetting.upsert({
    where: { key: WEDDING_PHASE_SETTING_KEY },
    create: { key: WEDDING_PHASE_SETTING_KEY, value: phase },
    update: { value: phase },
  });

  return phase;
};