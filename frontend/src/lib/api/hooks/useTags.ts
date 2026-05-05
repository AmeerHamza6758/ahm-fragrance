import { useQuery } from "@tanstack/react-query";
import { getTags } from "../endpoints/tags";

const TAGS_KEY = "tags";

export const useTags = () => {
  return useQuery({
    queryKey: [TAGS_KEY],
    queryFn: getTags,
    staleTime: 5 * 60 * 1000,
  });
};
