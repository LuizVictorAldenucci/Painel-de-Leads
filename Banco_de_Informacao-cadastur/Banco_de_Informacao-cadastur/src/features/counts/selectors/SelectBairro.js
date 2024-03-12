import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useCallback, useMemo } from "react";
import { selectUf, selectCidade, selectBairro, selectOrigem, changeBairros, resetBairro } from "../../queryParams/queryParamsSlice";
import { changeBairrosArray, changeisLoadingLocArray, selectBairrosArray, selectIsLoadingLocArray } from "../../locationOptions/locationArraySlice";
import { useGetLocOptionsQuery } from "../locOptionsApiSlice";
import { v4 as uuidv4 } from 'uuid';

const SelectBairro = ({ customStyle }) => {
    const dispatch = useDispatch()

    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const bairros = useSelector(selectBairro)
    const origem = useSelector(selectOrigem)
    const [skipFetch, setSkipFetch] = useState(true)
    const { data: bairrosData,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetLocOptionsQuery({ uf, cidade, groupby: 'bairro', origem }, { skip: skipFetch })

    useEffect(() => {
        if (uf && cidade) {
            setSkipFetch(false)
        } else {
            setSkipFetch(true)
        }
    }, [uf, cidade])

    const bairroOptions = useMemo(() => {
        if (bairrosData) {
            return [{ value: "", label: 'Todos os bairros' }]
                .concat(Object.values(bairrosData)
                    .map((bairro) => {
                        return ({
                            value: bairro.BAIRRO,
                            label: bairro.BAIRRO,
                            key: uuidv4(),
                        })
                    })
                    .sort((a, b) => (a.label || '').localeCompare(b.label || ''))
                )
        } else { return null }
    }, [bairrosData])

    useEffect(() => {

        if (bairrosData && bairrosData.length > 0) {
            const newBairrosData = bairrosData.map(bairro => {
                return {
                    ...bairro,
                    type: 'bairro'
                }
            })
            dispatch(changeBairrosArray(newBairrosData))
        }
    }, [bairrosData])

    const handleBairroChange = useCallback((e) => {
        if ((e && e.length === 0) || e.slice(-1)[0].value === '') {
            dispatch(resetBairro());
            return;
        }

        const selectedBairros = e.map(obj => obj.value)
        dispatch(changeBairros(selectedBairros));
    }, []);

    useEffect(() => {
        if (isLoading || isFetching) {
            dispatch(changeisLoadingLocArray(true))
        } else {
            dispatch(changeisLoadingLocArray(false))
        }
    }, [isLoading, isFetching])

    return (
        <Select
            options={bairroOptions}
            isLoading={isLoading || isFetching}
            value={bairros.map((bairro) => {
                return {
                    value: bairro,
                    label: bairro
                }
            })}
            onChange={handleBairroChange}
            isError={isError && error}
            placeholder={"Selecione"}
            isMulti={true}
            loadingMessage={() => 'Carregando bairros...'}
            isDisabled={cidade === '' || uf === '' || isLoading || isFetching}
            isClearable={true}
            styles={customStyle}
        />
    )
}

export default SelectBairro