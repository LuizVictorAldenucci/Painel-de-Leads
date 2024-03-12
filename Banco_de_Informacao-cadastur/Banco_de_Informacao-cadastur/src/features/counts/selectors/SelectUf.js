import Select from "react-select";
import { useGetLocOptionsQuery } from "../locOptionsApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import { changeUf, changeCidade, resetBairro, changeGroupby, selectOrigem, resetPageSize } from '../../queryParams/queryParamsSlice'
import { changeEstadosArray, changeCidadesArray, changeBairrosArray, changeisLoadingLocArray, selectIsLoadingLocArray, selectEstadosArray, changeFilteredResults, changeIsLocError } from "../../locationOptions/locationArraySlice";

const SelectUf = ({ customStyle }) => {
    const dispatch = useDispatch()

    const uf = useSelector(state => state.queryParams.uf)
    const origem = useSelector(selectOrigem)
    const estadosArray = useSelector(selectEstadosArray)

    const [skipFetch, setSkipFetch] = useState(true)
    const { data: estados,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetLocOptionsQuery({ groupby: 'uf', origem }, { skip: skipFetch })
    const [selectedUf, setSelectedUf] = useState('')

    useEffect(() => {
        if (!uf) {
            setSkipFetch(false)
        } else {
            setSkipFetch(true)
        }
    }, [])
    const ufOptions = useMemo(() => {
        if (estados) {
            return [{ value: '', label: 'Todos os estados' }]
                .concat(Object.values(estados)
                    .filter((estado) => !/\d/.test(estado.UF))
                    .map((estado) => {
                        return ({
                            value: estado.UF,
                            label: estado.UF
                        })
                    })
                    .sort((a, b) => a.label.localeCompare(b.label))
                )
        } else if (estadosArray) {
            return [{ value: '', label: 'Todos os estados' }]
                .concat(Object.values(estadosArray)
                    .map((estado) => {
                        return ({
                            value: estado.UF,
                            label: estado.UF
                        })
                    })
                    .sort((a, b) => a.label.localeCompare(b.label))
                )
        }
    }, [estados, estadosArray])

    useEffect(() => {
        if (estados && estados.length > 0) {

            const newEstadosData = estados.map(estado => {
                return {
                    ...estado,
                    type: 'estado'
                }
            })
            dispatch(changeEstadosArray(newEstadosData))
        }
    }, [estados])

    const handleUfChange = useCallback((e) => {
        setSelectedUf(e.value)
        dispatch(changeUf(e.value))
        dispatch(changeCidade(''))
        dispatch(resetBairro())
        dispatch(changeCidadesArray([]))
        dispatch(changeBairrosArray([]))
        dispatch(resetPageSize())
        dispatch(changeFilteredResults([]))
        if (e.value === "") {
            dispatch(changeGroupby('uf'))
        } else if (e.value !== "") {
            dispatch(changeGroupby('cidade'))
        }
    }, [])

    useEffect(() => {
        if (isLoading || isFetching) {
            dispatch(changeisLoadingLocArray(true))
        } else {
            dispatch(changeisLoadingLocArray(false))
        }
    }, [isLoading, isFetching])

    // const dispatchChangeIsLocError = useCallback(() => {
    //     dispatch(changeIsLocError(true));
    // }, [dispatch]);

    // useEffect(() => {
    //     let i = 0;
    //     while (i < 20) {
    //         if (isError) {
    //             dispatchChangeIsLocError();
    //             //  refetch();
    //             console.log('refetching');
    //         } else {
    //             dispatch(changeIsLocError(false));
    //             break;
    //         }
    //         i++;
    //     }
    // }, [isError, refetch]);

    return (

        <Select
            options={ufOptions}
            value={uf || ''}
            onChange={handleUfChange}
            placeholder={uf || "Selecione"}
            isLoading={isLoading}
            loadingMessage={() => 'Carregando estados...'}
            styles={customStyle}
        />

    )
}

export default SelectUf