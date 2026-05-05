import apiClient from "../client";

export interface Tag {
  _id: string;
  name: string;
  description?: string;
}

export const getTags = async (): Promise<Tag[]> => {
  const { data } = await apiClient.get<Tag[] | { data: Tag[] }>("/api/tag/getTags");

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray((data as { data?: Tag[] })?.data)) {
    return (data as { data: Tag[] }).data;
  }

  return [];
};
