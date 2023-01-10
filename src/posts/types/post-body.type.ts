export type PostBodyType = {
  id: string;
  text?: string;
  fontSize?: number;
  textBold?: boolean;
  textItalic?: boolean;
  textAlign?: 'left' | 'center' | 'right' | 'full';
  textColor?: string;
  textBackground?: string;
  url?: string;
  size?: 'small' | 'medium' | 'high';
  listType?: 'numbered' | 'marked';
  listItems?: string[];
};
