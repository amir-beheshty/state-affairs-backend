export interface NewsQuery {
  state?: string;
  topic?: string;
  search?: string;
}

export interface News {
  title: string;
  summary: string;
  state: string;
  topic: string;
  source_url: string;
  published_at: string;
}

export interface NewsRow extends News {
  id: number;
}
