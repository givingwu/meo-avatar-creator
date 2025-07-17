// API接口集成
const API_BASE_URL = '/openapi/manage';

export interface FileUploadResponse {
  code: number;
  message: string;
  data: {
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
  audioUrl?: string;
  avatarUrl?: string;
  originalPhotoUrl?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  requestId: string;
}

// 上传照片并生成2D头像
export async function uploadPhotoAndGenerateAvatar(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/custom-info/upload-photo`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('上传照片失败');
  }

  return response.json();
}

// 上传音频文件
export async function uploadAudio(file: Blob): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/custom-info/upload-audio`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('上传音频失败');
  }

  return response.json();
}

// 保存定制信息
export async function saveCustomInfo(customInfo: CustomInfoDTO): Promise<ApiResponse<boolean>> {
  const response = await fetch(`${API_BASE_URL}/custom-info/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customInfo),
  });

  if (!response.ok) {
    throw new Error('保存定制信息失败');
  }

  return response.json();
}

// 根据订单号查询定制信息
export async function getCustomInfo(orderNo: string): Promise<ApiResponse<CustomInfoDTO>> {
  const response = await fetch(`${API_BASE_URL}/custom-info/${orderNo}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('查询定制信息失败');
  }

  return response.json();
}