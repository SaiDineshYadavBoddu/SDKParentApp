import { backendApi } from "../api.config";
import { API_ENDPOINTS } from "../endpoint.const";

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface UpdateCommentBody {
  body: string;
}

export const userApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => ({
        url: API_ENDPOINTS.GET_POSTS,
        method: "GET",
      }),
    }),
    viewPostComments: builder.query<Comment[], { postId: number }>({
      query: ({ postId }) => ({
        url: `${API_ENDPOINTS.VIEW_POST}${postId}/comments`,
        method: "GET",
      }),
    }),
    updatePostComment: builder.mutation<
      Comment,
      { commentId: number; body: UpdateCommentBody }
    >({
      query: ({ commentId, body }) => ({
        url: `${API_ENDPOINTS.COMMENT_POST}${commentId}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useViewPostCommentsQuery,
  useUpdatePostCommentMutation,
} = userApi;

