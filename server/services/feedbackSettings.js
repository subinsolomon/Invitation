import prisma from '../config/database.js';

const FEEDBACK_SETTING_KEY = 'feedback_enabled';

export const isFeedbackEnabled = async () => {
  const setting = await prisma.appSetting.findUnique({
    where: { key: FEEDBACK_SETTING_KEY },
  });

  return setting ? setting.value === 'true' : true;
};

export const updateFeedbackEnabled = async (enabled) => {
  await prisma.appSetting.upsert({
    where: { key: FEEDBACK_SETTING_KEY },
    create: { key: FEEDBACK_SETTING_KEY, value: String(enabled) },
    update: { value: String(enabled) },
  });

  return enabled;
};