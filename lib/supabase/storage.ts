import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase Storage에 이미지 업로드
 */
export async function uploadImage(
  file: File,
  bucket: string = 'images',
  folder?: string
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  // 파일명 생성 (타임스탬프 + 원본 파일명)
  const timestamp = Date.now();
  const fileName = folder
    ? `${folder}/${timestamp}-${file.name}`
    : `${timestamp}-${file.name}`;

  // 파일 업로드
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  // 공개 URL 생성
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Supabase Storage에서 이미지 삭제
 */
export async function deleteImage(
  url: string,
  bucket: string = 'images'
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  // URL에서 파일 경로 추출
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`이미지 삭제 실패: ${error.message}`);
  }
}

