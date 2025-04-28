import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  COMMENT_CALLS,
  Comment,
  CommentQueryParams,
  UpdateCommentDto,
} from './commentCalls';

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: COMMENT_CALLS.createComment.call,
    onSuccess: (newComment) => {
      // Invalidate all comment queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      
      // Optionally update the cache directly
      if (newComment.parentComment) {
        // Update parent comment's replies
        queryClient.setQueryData(
          COMMENT_CALLS.getCommentReplies.getKey(newComment.parentComment),
          (oldData: Comment[] = []) => [...oldData, newComment]
        );
      }
    }
  });
};

export const useComments = (params: CommentQueryParams = {}) => {
  return useQuery({
    queryKey: COMMENT_CALLS.getComments.getKey(params),
    queryFn: () => COMMENT_CALLS.getComments.call(params),
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    meta: {
      errorMessage: 'Failed to fetch comments'
    }
  });
};

export const useComment = (id?: string) => {
  return useQuery<Comment, Error>({
    queryKey: id ? COMMENT_CALLS.getComment.getKey(id) : ['comment', 'none'],
    queryFn: () => id ? COMMENT_CALLS.getComment.call(id) : Promise.reject('No ID provided'),
    enabled: !!id, // Only run query if ID is provided
    staleTime: 30 * 1000, // Consider fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 2, // Retry failed requests twice
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, { id: string; data: UpdateCommentDto }>({
    mutationFn: COMMENT_CALLS.updateComment.call,
    onSuccess: (data) => {
      // Update the comment in the cache
      queryClient.setQueryData(COMMENT_CALLS.getComment.getKey(data.id), data);
      // Also invalidate the comments list
      queryClient.invalidateQueries({ queryKey: ['comments', 'list'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, string>({
    mutationFn: COMMENT_CALLS.deleteComment.call,
    onSuccess: (_, id) => {
      // Invalidate specific comment and comments list
      queryClient.invalidateQueries({ queryKey: COMMENT_CALLS.getComment.getKey(id) });
      queryClient.invalidateQueries({ queryKey: ['comments', 'list'] });
    },
  });
};

export const useRestoreComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, string>({
    mutationFn: COMMENT_CALLS.restoreComment.call,
    onSuccess: (_, id) => {
      // Invalidate specific comment and comments list
      queryClient.invalidateQueries({ queryKey: COMMENT_CALLS.getComment.getKey(id) });
      queryClient.invalidateQueries({ queryKey: ['comments', 'list'] });
    },
  });
};

export const useCommentReplies = (id: string) => {
  // Add a timestamp to the query key to prevent caching issues
  const timestamp = Date.now();
  
  return useQuery<Comment[], Error>({
    queryKey: [...COMMENT_CALLS.getCommentReplies.getKey(id), timestamp],
    queryFn: () => COMMENT_CALLS.getCommentReplies.call(id),
    enabled: !!id && id.length > 0, // Only run query if ID is provided
    staleTime: 0, // Consider it stale immediately
    gcTime: 0, // Don't cache this query (formerly cacheTime)
    refetchOnMount: true, // Always refetch when component mounts
    retry: 3, // Increase retries for reliability
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    meta: {
      errorMessage: 'Failed to load replies'
    }
  });
};