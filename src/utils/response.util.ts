/**
 * API响应处理工具类
 */
import type { ApiResponse } from '@/types/common.type';

const SUCCESS_CODE = 0;

/**
 * 检查响应是否成功
 * @param response API响应
 * @returns boolean
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.code === SUCCESS_CODE;
}

/**
 * 从响应中提取错误消息
 * @param response API响应
 * @returns string
 */
export function extractErrorMessage<T>(response: ApiResponse<T>): string {
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