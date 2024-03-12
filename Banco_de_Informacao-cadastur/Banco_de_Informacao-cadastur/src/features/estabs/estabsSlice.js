import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const estabsAdapter = createEntityAdapter({})

const initialState = estabsAdapter.getInitialState()

export const estabsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEstabs: builder.query({
            query: (params) => {
                const { uf, cidade, bairro, souabrasel, associados, pageSize, origem } = params;
                const queryObject = {};

                const origensValue = origem.map(origem => origem.value)

                if (uf && uf !== "") queryObject.uf = uf;
                if (cidade !== "") queryObject.cidade = cidade;
                if (Array.isArray(bairro) && bairro.length > 0) queryObject.bairro = bairro;
                if (souabrasel !== "") queryObject.souabrasel = souabrasel;
                if (associados !== "") queryObject.associados = associados;
                if (Array.isArray(origem) && origem.length > 0) queryObject.origem = [origensValue];
                // if (origem !== '') queryObject.origem = origem;
                if (pageSize != 0) queryObject.pageSize = pageSize
                queryObject.orderby = 'bairro'

                return {
                    url: '/estabelecimentos',
                    params: queryObject
                }
            },
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'Estab', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'Estab', id }))
            //         ]
            //     } else return [{ type: 'Estab', id: 'LIST' }]
            // },
            cacheOptions: {
                ttl: 3 * 60 * 1000,
            },
            keepUnusedDataFor: 120
        }),
    }),
})

export const {
    useGetEstabsQuery
} = estabsApiSlice

// returns the query result object
export const selectEstabsResult = estabsApiSlice.endpoints.getEstabs.select()

// creates memoized selector
const selectEstabsData = createSelector(
    selectEstabsResult,
    estabsResult => estabsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllEstabs,
    selectById: selectEstabById,
    selectIds: selectEstabIds
    // Pass in a selector that returns the estabs slice of state
} = estabsAdapter.getSelectors(state => selectEstabsData(state) ?? initialState)