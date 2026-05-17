import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { WordsResponse, WordItem } from '../types';

export const useWords = () => {
  return useQuery<WordsResponse>({
    queryKey: ['words'],
    queryFn: async () => {
      const response = await apiClient.get<WordsResponse>('/words');
      return response.data;
    },
  });
};

interface UpdateWordPayload {
  wordId: number;
  isLearned?: boolean;
  customHebrewTranslation?: string | null;
}

export const useUpdateWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wordId, ...data }: UpdateWordPayload) => {
      const response = await apiClient.put<Partial<WordItem>>(`/words/${wordId}`, data);
      return response.data;
    },
    onMutate: async ({ wordId, isLearned, customHebrewTranslation }) => {
      await queryClient.cancelQueries({ queryKey: ['words'] });
      const prev = queryClient.getQueryData<WordsResponse>(['words']);

      if (prev) {
        queryClient.setQueryData<WordsResponse>(['words'], {
          ...prev,
          words: prev.words.map((w) =>
            w.wordId === wordId
              ? {
                  ...w,
                  ...(isLearned !== undefined && { isLearned }),
                  ...(customHebrewTranslation !== undefined && {
                    hebrewTranslation: customHebrewTranslation ?? w.originalHebrewTranslation,
                    hasCustomTranslation: customHebrewTranslation !== null,
                  }),
                }
              : w
          ),
        });
      }

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['words'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
    },
  });
};
