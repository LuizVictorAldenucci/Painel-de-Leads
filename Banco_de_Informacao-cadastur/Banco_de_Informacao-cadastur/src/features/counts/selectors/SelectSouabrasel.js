import { selectSouabrasel } from "../../queryParams/queryParamsSlice";
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { changeSouabrasel } from "../../queryParams/queryParamsSlice";
import { useEffect, useState } from "react";

const SelectSouabrasel = ({ customStyle }) => {
    const dispatch = useDispatch()
    const souabrasel = useSelector(selectSouabrasel)
    const [souabraselLabel, setSouabraselLabel] = useState('')

    const souabraselOptions = [
        { value: '', label: 'Todos' },
        { value: 'ATIVO', label: 'Ativo' },
        { value: 'CANCELADO', label: 'Cancelado' },
        { value: 'INATIVO', label: 'Inativo' },
        { value: '0', label: 'Não possui Sou Abrasel' }
    ]

    const handleSouabraselClick = (e) => {
        dispatch(changeSouabrasel(e.value))
        setSouabraselLabel(e.label)
    }

    useEffect(() => {
        if (souabrasel === '') {
            setSouabraselLabel('')
        }
    }, [souabrasel])

    return (
        <Select
            options={souabraselOptions}
            value={souabrasel || ''}
            onChange={handleSouabraselClick}
            placeholder={souabraselLabel || "Selecione"}
            styles={customStyle}
        />)
}

export default SelectSouabrasel