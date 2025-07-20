/**
 * 表单验证工具类
 */
import { VALIDATION_CONFIG } from '@/constants/system.constant';

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns boolean
 */
export function validatePhone(phone: string): boolean {
  return VALIDATION_CONFIG.PHONE_PATTERN.test(phone);
}

/**
 * 验证订单号格式
 * @param orderNo 订单号
 * @returns boolean
 */
export function validateOrderNo(orderNo: string): boolean {
  const trimmed = orderNo.trim();
  return trimmed.length >= VALIDATION_CONFIG.ORDER_NO_MIN_LENGTH && 
         trimmed.length <= VALIDATION_CONFIG.ORDER_NO_MAX_LENGTH;
}

/**
 * 验证性格描述长度
 * @param description 性格描述
 * @returns boolean
 */
export function validatePersonalityDesc(description: string): boolean {
  const trimmed = description.trim();
  return trimmed.length >= VALIDATION_CONFIG.PERSONALITY_MIN_LENGTH && 
         trimmed.length <= VALIDATION_CONFIG.PERSONALITY_MAX_LENGTH;
}

/**
 * 验证文件大小
 * @param file 文件
 * @param maxSize 最大文件大小（字节）
 * @returns boolean
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * 验证文件类型
 * @param file 文件
 * @param allowedTypes 允许的文件类型
 * @returns boolean
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}