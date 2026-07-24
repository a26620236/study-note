/**
 * 根據傳入的 bucket name 與 image path，組出 Google Cloud Storage 圖片 URL
 *
 * @param bucketName - GCS bucket 名稱（呼叫端自行讀取 env var 後傳入）
 * @param imagePath - 圖片路徑（相對於 bucket 根目錄）
 * @returns 完整的圖片 URL
 *
 * @example
 *
 * const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
 * getStorageImageUrl(bucketName, 'images/authorization/billing/azure/azure_1_1.png');
 * 'https://storage.googleapis.com/lumiture-frontend-dev/images/authorization/billing/azure/azure_1_1.png'
 */
export function getStorageImageUrl(bucketName: string, imagePath: string): string {
  return `https://storage.googleapis.com/${bucketName}/${imagePath}`;
}
