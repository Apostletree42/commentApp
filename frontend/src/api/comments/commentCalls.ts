import axiosInstance from '../config/axiosInstance';
import { User } from '../auth/authCalls';

export interface Comment {
  id: string;
  content: string;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
  author: User;
  replies?: Comment[];
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentQueryParams {
  limit?: number;
  page?: number;
  depth?: number;
  repliesPerLevel?: number;
}

export interface CommentResponse {
  comments: Comment[];
  total: number;
  hasMoreReplies: Record<string, number>;
}

export const COMMENT_CALLS = {
  createComment: {
    getKey: () => ['comments', 'create'],
    call: async (data: CreateCommentDto): Promise<Comment> => {
      console.log('Creating comment:', data);
      const response = await axiosInstance.post<Comment>('/comments', data);
      console.log('Created comment response:', response.data);
      return response.data;
    },
  },

  getComments: {
    getKey: (params: CommentQueryParams = {}) => ['comments', 'list', params],
    call: async (params: CommentQueryParams = {}): Promise<CommentResponse> => {
      // console.log('Fetching comments with params:', params);
      const response = await axiosInstance.get<CommentResponse>('/comments', {
        params,
      });
      // console.log(`Received ${response.data.comments.length} comments`);
      return response.data;
    },
  },

  getComment: {
    getKey: (id: string) => ['comments', id],
    call: async (id: string): Promise<Comment> => {
      // console.log(`Fetching comment with ID: ${id}`);
      const response = await axiosInstance.get<Comment>(`/comments/${id}`);
      // console.log('Fetched comment:', response.data);
      return response.data;
    },
  },

  updateComment: {
    getKey: (id: string) => ['comments', id, 'update'],
    call: async ({ id, data }: { id: string; data: UpdateCommentDto }): Promise<Comment> => {
      // console.log(`Updating comment ${id}:`, data);
      const response = await axiosInstance.patch<Comment>(`/comments/${id}`, data);
      // console.log('Updated comment:', response.data);
      return response.data;
    },
  },

  deleteComment: {
    getKey: (id: string) => ['comments', id, 'delete'],
    call: async (id: string): Promise<Comment> => {
      // console.log(`Deleting comment ${id}`);
      const response = await axiosInstance.delete<Comment>(`/comments/${id}`);
      // console.log('Deleted comment response:', response.data);
      return response.data;
    },
  },

  restoreComment: {
    getKey: (id: string) => ['comments', id, 'restore'],
    call: async (id: string): Promise<Comment> => {
      // console.log(`Restoring comment ${id}`);
      const response = await axiosInstance.post<Comment>(`/comments/${id}/restore`);
      // console.log('Restored comment response:', response.data);
      return response.data;
    },
  },

  getCommentReplies: {
    getKey: (id: string) => ['comments', id, 'replies'],
    call: async (id: string): Promise<Comment[]> => {
      if (!id) {
        // console.log('Cannot fetch replies: no comment ID provided');
        return [];
      }
      
      try {
        // console.log(`Fetching replies for comment: ${id}`);
        
        // Add parameters to prevent caching and request full tree
        const timestamp = new Date().getTime();
        const response = await axiosInstance.get<Comment[]>(
          `/comments/${id}/replies?fullTree=true&t=${timestamp}`
        );
        
        // console.log(`Received ${response.data?.length || 0} replies from server for comment ${id}`);
        
        // Safety check
        if (!response.data || !Array.isArray(response.data)) {
          // console.error('Invalid response format for replies:', response);
          return [];
        }
  
        // Fetch any missing comments (convert IDs to full comment objects)
        const completeReplies = await fetchMissingComments(response.data);
        
        // console.log(`Fully loaded ${completeReplies.length} replies with all nested comments`);
        
        return completeReplies;
      } catch (error) {
        console.error(`Error fetching replies for comment ${id}:`, error);
        throw error;
      }
    },
  }
};

const fetchMissingComments = async (comments: (Comment | string)[]): Promise<Comment[]> => {
  const result: Comment[] = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (typeof comment === 'string') {
      try {
        console.log(`Fetching missing comment with ID: ${comment}`);
        const response = await axiosInstance.get<Comment>(`/comments/${comment}`);
        const fetchedComment = response.data;
        if (fetchedComment.replies && fetchedComment.replies.length > 0) {
          fetchedComment.replies = await fetchMissingComments(fetchedComment.replies);
        }
        
        result.push(fetchedComment);
      } catch (error) {
        console.error(`Failed to fetch comment with ID ${comment}:`, error);
        result.push({
          id: comment,
          content: 'Failed to load content',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
          author: {
            id: 'unknown',
            username: 'Unknown user',
            createdAt: new Date().toISOString()
          }
        });
      }
    } else {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = await fetchMissingComments(comment.replies);
      }
      
      result.push(comment);
    }
  }
  
  return result;
};