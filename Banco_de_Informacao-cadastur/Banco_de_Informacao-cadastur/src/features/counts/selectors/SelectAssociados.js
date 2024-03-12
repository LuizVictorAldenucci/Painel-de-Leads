import { selectAssociados } from "../../queryParams/queryParamsSlice";
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { changeAssociados } from "../../queryParams/queryParamsSlice";
import { useEffect, useState } from "react";

const SelectAssociados = ({ customStyle }) => {
    const dispatch = useDispatch()
    const associados = useSelector(selectAssociados)
    const [associadosLabel, setAssociadosLabel] = useState('')

    const associadosOptions = [
        { value: '', label: 'Todos' },
        { value: 'ATIVO', label: 'Ativo' },
        { value: 'INATIVO', label: 'Inativo' },
        { value: '0', label: 'Não associados' }
    ]

    const handleAssociadosClick = (e) => {
        dispatch(changeAssociados(e.value))
        setAssociadosLabel(e.label)
    }

    useEffect(() => {
        if (associados === '') {
            setAssociadosLabel('')
        }
    }, [associados])

    return (
        <Select
            options={associadosOptions}
            value={associados || ''}
            onChange={handleAssociadosClick}
            placeholder={associadosLabel || "Selecione"}
            styles={customStyle}
        />)
}

export default SelectAssociados