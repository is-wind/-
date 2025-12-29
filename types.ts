
export interface SlideData {
  id: number;
  title?: string;
  content: string[];
  type?: 'title' | 'program' | 'game' | 'credits' | 'qa';
}
