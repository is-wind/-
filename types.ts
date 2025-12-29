
export interface SlideData {
  id: number;
  title?: string;
  content: string[];
  type?: 'title' | 'program' | 'game' | 'credits' | 'qa';
  audioUrl?: string;
  audioStartOffset?: number;
}
