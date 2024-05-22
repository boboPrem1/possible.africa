import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const token = import.meta.env.VITE_BACKEND_TOKEN;
const api_key = import.meta.env.VITE_POSSIBLE_API_KEY;
const baseUrl = import.meta.env.VITE_API_URL_BASE;

const baseQueryArgs = { limit: 10, page: 1, fields: [], eq: [] };
function queryTransformer(query, resource) {
  let baseQueryString = "/" + resource;
  const { limit, page, fields = ["alo", "ala"], eq } = query;
  baseQueryString += `?page=${page}&limit=${limit}`;
  if (fields.length) {
    baseQueryString += `&select=${fields.forEach((item) => item + ",")}`;
  }
  if (eq.length) {
    eq.forEach((item) => {
      baseQueryString += `&${item.field}=${item.value}`;
    });
  }
  return baseQueryString;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set("authorization", `ApiKey ${api_key}`);
      headers.set("content-type", "application/json");
      headers.set("Access-Control-Allow-Origin", "*");
      return headers;
    },
  }),
  tagTypes: ["Organisations"],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getPostCategories: builder.query({
      query: (queryArgs = baseQueryArgs) =>
        queryTransformer(queryArgs, "post_categories"),
    }),
    getPosts: builder.query({
      query: (queryArgs = baseQueryArgs) => {
        return queryTransformer(queryArgs, "posts");
      },
      transformResponse: (res) => {
        // res = [...res.fr, ...res.eng];
        // console.log(res);
        return res.sort((a, b) => b.id - a.id);
      },
      providesTags: ["Posts"],
    }),
    getAirtableFrPosts: builder.query({
      query: (queryArgs = baseQueryArgs) => {
        return queryTransformer(queryArgs, "airtable_posts/fr");
      },
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Posts"],
    }),
    getAirtableEngPosts: builder.query({
      query: (queryArgs = baseQueryArgs) => {
        return queryTransformer(queryArgs, "airtable_posts/eng");
      },
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Posts"],
    }),
    getAirtableAllPosts: builder.query({
      query: (queryArgs = baseQueryArgs) => {
        return "airtable_posts/all";
      },
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Posts"],
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: "/posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Posts"],
    }),
    getAirtableOrganisations: builder.query({
      query: (queryArgs = baseQueryArgs) => {
        return queryTransformer(queryArgs, "airtable_organisations");
      },
      // transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Organisations"],
    }),

    getOrganisations: builder.query({
      query: (queryArgs = baseQueryArgs) => {
        return queryTransformer(queryArgs, "organisations");
      },
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Organisations"],
    }),

    getOrganisation: builder.query({
      query: (organisationId) => `/organisations/${organisationId}`,
    }),

    addOrganisation: builder.mutation({
      query: (post) => ({
        url: "/organisations",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Organisations"],
    }),
    updateOrganisation: builder.mutation({
      query: (post) => ({
        url: `/organisations/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Organisations"],
    }),
    deleteOrganisation: builder.mutation({
      query: ({ id }) => ({
        url: `/organisations/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Organisations"],
    }),

    searchAll: builder.query({
      query: (query, pageNumber) => `search?q=${query.q}&page=${pageNumber}`,
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
    }),

    getJobs: builder.query({
      query: () => "/jobs",
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Jobs"],
    }),
    addJob: builder.mutation({
      query: (post) => ({
        url: "/jobs",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Jobs"],
    }),
    updateJob: builder.mutation({
      query: (post) => ({
        url: `/jobs/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Jobs"],
    }),
    deleteJob: builder.mutation({
      query: ({ id }) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Jobs"],
    }),
    getJob: builder.query({
      query: (jobId) => `/jobs/${jobId}`,
    }),

    getEvents: builder.query({
      query: () => "/events",
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Agenda"],
    }),
    addEvent: builder.mutation({
      query: (post) => ({
        url: "/events",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Agenda"],
    }),
    updateEvent: builder.mutation({
      query: (post) => ({
        url: `/events/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Agenda"],
    }),
    deleteEvent: builder.mutation({
      query: ({ id }) => ({
        url: `/events/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Agenda"],
    }),
    getEvent: builder.query({
      query: (eventId) => `/events/${eventId}`,
    }),

    getOpportunities: builder.query({
      query: () => "/opportunities",
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Opportunités"],
    }),
    addOpportunity: builder.mutation({
      query: (post) => ({
        url: "/opportunities",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Opportunités"],
    }),
    updateOpportunity: builder.mutation({
      query: (post) => ({
        url: `/opportunities/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Opportunités"],
    }),
    deleteOpportunity: builder.mutation({
      query: ({ id }) => ({
        url: `/opportunities/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Opportunités"],
    }),
    getOpportunity: builder.query({
      query: (opportunityId) => `/opportunities/${opportunityId}`,
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetAirtableAllPostsQuery,
  useGetAirtableEngPostsQuery,
  useGetAirtableFrPostsQuery,
  useAddPostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetOrganisationQuery,
  useSearchAllQuery,
  useGetOrganisationsQuery,
  useGetAirtableOrganisationsQuery,
  useAddOrganisationMutation,
  useDeleteOrganisationMutation,
  useUpdateOrganisationMutation,
  useGetPostCategoriesQuery,
  useGetJobsQuery,
  useGetJobQuery,
  useAddJobMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
  useGetEventsQuery,
  useGetEventQuery,
  useAddEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
  useGetOpportunitiesQuery,
  useGetOpportunityQuery,
  useAddOpportunityMutation,
  useDeleteOpportunityMutation,
  useUpdateOpportunityMutation,
} = apiSlice;
