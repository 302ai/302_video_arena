export interface MediaItemType {
  id: string;
  title: string;
  desc?: string;
  url?: string;
  base64?: string;
  tag?: string;
  historyId?: string;
  status: "pending" | "processing" | "success" | "failed";
  taskId?: string;
  inputType?: "video" | "image" | "text";
  imageUrl?: string;
  endImageUrl?: string;
  videoUrl?: string;
  createdAt?: string | number;
  updatedAt?: string | number;
  model?: string;
  prompt?: string;
}

export interface BaseProps {
  className?: string;
}

export interface ActionProps {
  onDelete?: (item: MediaItemType) => void;
  onDownload?: (item: MediaItemType) => void;
}

export interface GalleryProps extends ActionProps {
  mediaItems: MediaItemType[];
  title: string;
  description: string;
  insertAtStart?: boolean;
  emptyStateMessage?: string;
}

export interface VideoGalleryProps extends ActionProps {
  videoItems: MediaItemType[];
  title: string;
  description: string;
  insertAtStart?: boolean;
  emptyStateMessage?: string;
}

export interface MediaItemProps extends BaseProps, ActionProps {
  item: MediaItemType;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  showActions?: boolean;
  showTag?: boolean;
}

export interface VideoItemProps {
  item: MediaItemType;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDelete?: (item: MediaItemType) => void;
  onDownload?: (item: MediaItemType) => void;
  onShowDetails?: (item: MediaItemType) => void;
  showActions?: boolean;
  showTag?: boolean;
  showStatus?: boolean;
}

export interface GalleryModalProps extends ActionProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[];
  showDelete?: boolean;
}
