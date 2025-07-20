/**
 * 定制信息相关API服务
 */
import { API_CONFIG } from '@/constants/system.constant';
import type { BaseResponse } from '@/types/common.type';

export interface FileUploadResponse {
  code: number;
  message: string;
  data: {
    orderNo: string;
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
  requestId: string;
}

export interface CustomInfoDTO {
  orderNo: string;
  userName?: string;
  phone?: string;
  address?: string;
  personalityDesc: string;
  audioUrl: string; // 必需字段
  avatarUrl?: string;
  originalPhotoUrl?: string;
}

export interface ApiResponse<T> extends BaseResponse<T> {}

const { BASE_URL } = API_CONFIG;

/**
 * 上传照片并生成2D头像
 * @param file 上传的图片文件
 * @param orderNo 订单号
 * @returns Promise<FileUploadResponse>
 */
export async function uploadPhotoAndGenerateAvatar(file: File, orderNo: string): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/custom-info/upload-photo?orderNo=${encodeURIComponent(orderNo)}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('上传照片失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload photo error:', error);
    throw error;
  }
}

/**
 * 上传音频文件
 * @param file 音频文件blob
 * @param orderNo 订单号
 * @returns Promise<FileUploadResponse>
 */
export async function uploadAudio(file: Blob, orderNo: string): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/custom-info/upload-audio?orderNo=${encodeURIComponent(orderNo)}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('上传音频失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload audio error:', error);
    throw error;
  }
}

/**
 * 保存定制信息
 * @param customInfo 定制信息对象
 * @returns Promise<ApiResponse<boolean>>
 */
export async function saveCustomInfo(customInfo: CustomInfoDTO): Promise<ApiResponse<boolean>> {
  try {
    const response = await fetch(`${BASE_URL}/custom-info/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customInfo),
    });

    if (!response.ok) {
      throw new Error('保存定制信息失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Save custom info error:', error);
    throw error;
  }
}

/**
 * 根据订单号查询定制信息
 * @param orderNo 订单号
 * @returns Promise<ApiResponse<CustomInfoDTO>>
 */
export async function getCustomInfo(orderNo: string): Promise<ApiResponse<CustomInfoDTO>> {
  try {
    const response = await fetch(`${BASE_URL}/custom-info/${orderNo}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('查询定制信息失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Get custom info error:', error);
    throw error;
  }
}