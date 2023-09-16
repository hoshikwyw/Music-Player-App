import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shazamApi = createApi({
  reducerPath: "shazamApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://shazam.p.rapidapi.com/",
    prepareHeaders: (headers) => {
        headers.set('X-RapidAPI-Key', '569e84436amshf9e2b2888bc499ep10c414jsne17550357488');
        return headers;
    }
 }),
 endpoints: (builder) => ({
    getChartTracks: builder.query({
        query: () => 'charts/track',
        
    })
 })
});

export const {useGetChartTracksQuery} = shazamApi ;
