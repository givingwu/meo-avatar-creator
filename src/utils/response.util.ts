/**
 * API响应处理工具类
 */
import { RESPONSE_CODE } from '@/constants/system.constant';
import type { BaseResponse } from '@/types/common.type';

/**
 * 检查响应是否成功
 * @param response API响应
 * @returns boolean
 */
export function isSuccessResponse<T>(response: BaseResponse<T>): boolean {
  return response.code === RESPONSE_CODE.SUCCESS;
}

/**
 * 从响应中提取错误消息
 * @param response API响应
 * @returns string
 */
export function extractErrorMessage<T>(response: BaseResponse<T>): string {
  return response.message || '未知错误';
}

/**
 * 格式化错误消息
 * @param error 错误对象
 * @returns string
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '操作失败，请重试';
}