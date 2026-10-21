export interface AdminLoginPayload {
  email: string;
}

export interface AdminValidateOtpPayload {
  email: string;
  otp: string;
}

export interface AdminRoleResponse {
  id?: string;
  name?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role_id: string;
  role?: AdminRoleResponse | null;
  profile_picture?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminTokenData {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface AdminAuthResponseData {
  tokens: AdminTokenData;
  admin: AdminUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: unknown;
}
