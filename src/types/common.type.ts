/**
 * 通用类型定义
 */

// 基础响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
  requestId: string;
}

// 分页参数类型
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应类型
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 表单基础状态类型
export interface FormState {
  loading: boolean;
  submitting: boolean;
  errors: Record<string, string>;
}

// 文件上传状态类型
export interface UploadState {
  uploading: boolean;
  progress: number;
  error?: string;
}

// 组件基础属性类型
export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}

// 步骤状态类型
export type StepStatus = 'pending' | 'current' | 'completed';

// 应用状态类型
export type AppStatus = 'loading' | 'success' | 'error' | 'idle';