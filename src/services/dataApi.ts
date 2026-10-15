import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiConstants } from './constants/ApiConstants';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: ApiConstants.dataBaseUrl, responseHandler: 'text' }),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getManifestText: builder.query<string, void>({ query: () => ApiConstants.manifestPath }),
    getDatasetText: builder.query<string, string>({ query: (url) => url }),
  }),
});
