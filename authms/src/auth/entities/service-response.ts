export interface ServiceResponse<T> {
  success: boolean;
  reason?: string;
  data?: T;
}

export function ok<T>(data: T): ServiceResponse<T> {
  return { success: true, data };
}

export function err<T>(reason: string): ServiceResponse<T> {
  return { success: false, reason };
}
