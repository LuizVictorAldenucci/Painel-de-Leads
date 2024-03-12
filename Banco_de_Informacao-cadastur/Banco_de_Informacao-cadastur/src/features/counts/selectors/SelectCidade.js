import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { selectUf, selectCidade, selectOrigem, resetPageSize } from "../../queryParams/queryParamsSlice";
import { useCallback, useMemo } from "react";
import { changeCidade, resetBairro, changeGroupby } from '../../queryParams/queryParamsSlice'
import { changeCidadesArray, changeBairrosArray, changeisLoadingLocArray, changeFilteredResults } from "../../locationOptions/locationArraySlice";
import { useGetLocOptionsQuery } from "../locOptionsApiSlice";

const SelectCidade = ({ customStyle }) => {
    const dispatch = useDispatch()

    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const origem = useSelector(selectOrigem)
    const [selectedCidade, setSelectedCidade] = useState('')
    const [skipFetch, setSkipFetch] = useState(true)
    const { data: cidades,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetLocOptionsQuery({ uf, groupby: 'cidade', origem: origem }, { skip: skipFetch })

    useEffect(() => {
        if (uf) {
            setSkipFetch(false)
        } else {
            setSkipFetch(true)
        }
    }, [uf])

    const cidadeOptions = useMemo(() => {
        if (cidades) {
            return [{ value: '', label: 'Todas as cidades' }]
                .concat(Object.values(cidades)
                    .map((cidade) => {
                        return ({
                            value: cidade.CIDADE,
                            label: cidade.CIDADE
                        })
                    })
                    .sort((a, b) => a.label.localeCompare(b.label))
                )
        }
    }, [cidades])

    useEffect(() => {
        if (cidades && cidades.length > 0) {

            const newCidadesData = cidades.map(cidade => {
                return {
                    ...cidade,
                    type: 'cidade'
                }
            })
            dispatch(changeCidadesArray(newCidadesData))
        }
    }, [cidades])

    const handleCidadeChange = useCallback((e) => {
        setSelectedCidade(e.value)
        dispatch(changeCidade(e.value))
        dispatch(resetBairro())
        dispatch(changeGroupby('bairro'))
        dispatch(changeBairrosArray([]))
        dispatch(resetPageSize())
        dispatch(changeFilteredResults([]))
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
    //             refetch();
    //             console.log('refetching');
    //         } else {
    //             dispatch(changeIsLocError(false));
    //             break;
    //         }
    //         i++;
    //     }
    // }, [dispatchChangeIsLocError, isError, refetch]);

    return (
        <Select
            options={cidadeOptions}
            value={selectedCidade || ''}
            onChange={handleCidadeChange}
            placeholder={cidade || "Selecione"}
            isLoading={isLoading || isFetching}
            loadingMessage={() => 'Carregando cidades...'}
            isDisabled={uf === '' || isLoading || isFetching}
            styles={customStyle}
        />
    )
}

export default SelectCidade