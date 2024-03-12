import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'

const staggeredBaseQuery = retry(fetchBaseQuery({
    baseUrl: 'https://ec252.abrasel.com.br:8443/api/leads/v1',
    // baseUrl: 'https://vouchers-leads.gustavo-h-marti.repl.co/api/leads/v1',
}), {
    maxRetries: 5,
})

export const apiSlice = createApi({
    baseQuery: staggeredBaseQuery,
    tagTypes: ['Counts', 'LocOptions', 'Estabs'],
    endpoints: builder => ({})
})