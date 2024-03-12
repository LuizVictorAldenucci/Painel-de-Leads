import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const locOptionsAdapter = createEntityAdapter({})

const initialState = locOptionsAdapter.getInitialState()

export const locOptionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLocOptions: builder.query({
            query: (params) => {
                const { uf, cidade, bairro, groupby, origem } = params;
                const queryObject = {};
                const origensValue = origem.map(origem => origem.value)

                if (Array.isArray(origem) && origem.length > 0) queryObject.origem = [origensValue];

                if (uf !== '') {
                    queryObject.uf = uf
                    if (cidade !== '') {
                        queryObject.cidade = cidade
                        if (Array.isArray(bairro) && bairro.length > 0) {
                            queryObject.bairro = [bairro]
                        }
                    }
                }
                if (groupby !== '') queryObject.groupby = groupby;

                return {
                    url: '/estabelecimentos/counts',
                    params: queryObject,
                }
            },
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'LocOptions', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'LocOptions', id }))
            //         ]
            //     } else return [{ type: 'LocOptions', id: 'LIST' }]
            // },
            cacheOptions: {
                // Cache duration in milliseconds (3 minutes)
                ttl: 3 * 60 * 1000,
            },
            keepUnusedDataFor: 240
        }),
    }),
})

export const {
    useGetLocOptionsQuery
} = locOptionsApiSlice

export const selectLocOptionsResult = locOptionsApiSlice.endpoints.getLocOptions.select()

const selectLocOptionsData = createSelector(
    selectLocOptionsResult,
    locOptionsResult => locOptionsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllLocOptions,
    selectById: selectLocOptionById,
    selectIds: selectLocOptionIds
    // Pass in a selector that returns the locOptions slice of state
} = locOptionsAdapter.getSelectors(state => selectLocOptionsData(state) ?? initialState)