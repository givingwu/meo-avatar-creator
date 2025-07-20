/**
 * 系统常量配置
 */

// API 相关常量
export const API_CONFIG = {
  BASE_URL: 'https://api.wwwfuture.gd.cn/openapi/manage',
  TIMEOUT: 10000,
} as const;

// 文件上传相关常量
export const FILE_CONFIG = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_AUDIO_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  SUPPORTED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/m4a'],
} as const;

// 表单验证相关常量
export const VALIDATION_CONFIG = {
  ORDER_NO_MIN_LENGTH: 6,
  ORDER_NO_MAX_LENGTH: 20,
  PHONE_PATTERN: /^1[3-9]\d{9}$/,
  PERSONALITY_MIN_LENGTH: 10,
  PERSONALITY_MAX_LENGTH: 200,
} as const;

// 应用状态常量
export const APP_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
} as const;

// 步骤状态常量
export const STEP_STATUS = {
  PENDING: 'pending',
  CURRENT: 'current',
  COMPLETED: 'completed',
} as const;

// 响应状态码
export const RESPONSE_CODE = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;