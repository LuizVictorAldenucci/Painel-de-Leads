import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const countsAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.TOTAL.localeCompare(b.TOTAL)
})

const initialState = countsAdapter.getInitialState()

export const countsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCounts: builder.query({
            query: (params) => {
                const { uf, cidade, bairro, souabrasel, associados, groupby, origem } = params;
                const queryObject = {};
                const origensValue = origem.map(origem => origem.value)
                if (uf !== '') queryObject.uf = uf;
                if (cidade !== '') queryObject.cidade = cidade;
                if (Array.isArray(bairro) && bairro.length > 0) queryObject.bairro = [bairro];
                if (souabrasel !== '') queryObject.souabrasel = souabrasel;
                if (associados !== '') queryObject.associados = associados;
                // if (origem !== '') queryObject.origem = origem;
                if (Array.isArray(origem) && origem.length > 0) queryObject.origem = [origensValue];
                if (groupby !== '') queryObject.groupby = groupby;
                return {
                    url: '/estabelecimentos/counts',
                    params: queryObject,
                }
            },
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Count', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Count', id }))
                    ]
                } else return [{ type: 'Count', id: 'LIST' }]
            },
            cacheOptions: {
                ttl: 3 * 60 * 1000,
            },
            keepUnusedDataFor: 240
        })
    }),
})

export const {
    useGetCountsQuery,
    useLazyGetCountsQuery
} = countsApiSlice

// returns the query result object
export const selectCountsResult = countsApiSlice.endpoints.getCounts.select()

// creates memoized selector
const selectCountsData = createSelector(
    selectCountsResult,
    countsResult => countsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCounts
    // Pass in a selector that returns the counts slice of state
} = countsAdapter.getSelectors(state => selectCountsData(state) ?? initialState)

