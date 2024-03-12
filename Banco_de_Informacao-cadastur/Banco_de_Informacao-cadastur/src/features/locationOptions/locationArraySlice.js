import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    estadosArray: [],
    cidadesArray: [],
    bairrosArray: [],
    isLoadingLocArray: true,
    filteredResults: [],
    isLocError: false
}

const locationArraySlice = createSlice({
    name: 'locationArray',
    initialState,
    reducers: {
        changeEstadosArray: (state, action) => {
            state.estadosArray = action.payload
        },
        changeCidadesArray: (state, action) => {
            state.cidadesArray = action.payload
        },
        changeBairrosArray: (state, action) => {
            state.bairrosArray = action.payload
        },
        changeisLoadingLocArray: (state, action) => {
            state.isLoadingLocArray = action.payload
        },
        changeFilteredResults: (state, action) => {
            state.filteredResults = action.payload
        },
        resetFilteredResults: (state, action) => {
            state.filteredResults = []
        },
        changeIsLocError: (state, action) => {
            state.isLocError = action.payload
        },
    },
})

export const selectAllLocationArray = (state) => state.locationArray;
export const selectEstadosArray = (state) => state.locationArray.estadosArray;
export const selectCidadesArray = (state) => state.locationArray.cidadesArray;
export const selectBairrosArray = (state) => state.locationArray.bairrosArray;
export const selectIsLoadingLocArray = (state) => state.locationArray.isLoadingLocArray;
export const selectFilteredResults = (state) => state.locationArray.filteredResults;
export const selectIsLocError = (state) => state.locationArray.isLocError;

export const { changeEstadosArray, changeCidadesArray, changeBairrosArray, changeisLoadingLocArray, changeFilteredResults, resetFilteredResults, changeIsLocError } = locationArraySlice.actions

export default locationArraySlice.reducer