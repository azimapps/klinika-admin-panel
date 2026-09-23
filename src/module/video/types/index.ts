// ----------------------------------------------------------------------

export interface IVideo {
  id: number;
  video_id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  subtitle_uz: string;
  subtitle_ru: string;
  subtitle_en: string;
  duration: string;
  thumbnail: string | null;
  order: number;
  is_active: boolean;
}

export type IVideoCreateRequest = {
  video_id: string;
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  subtitle_uz?: string;
  subtitle_ru?: string;
  subtitle_en?: string;
  duration?: string;
  order?: number;
  is_active?: boolean;
};

export type IVideoUpdateRequest = Partial<IVideoCreateRequest>;
