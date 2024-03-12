import Select, { components } from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { changeOrigem, changeOrigens, resetOrigem, selectOrigem } from '../../queryParams/queryParamsSlice'

const SelectOrigem = ({ customStyle }) => {
    const dispatch = useDispatch()
    const origens = useSelector(selectOrigem)

    const NoOptionsMessage = props => {
        return (
            <components.NoOptionsMessage {...props}>
                <span className="custom-css-class">Sem opções</span>
            </components.NoOptionsMessage>
        );
    };

    const origemOptions = [
        { value: 'cadastur', label: 'Cadastur', key: 'cadastur' },
        // { value: '', label: 'Ticket', key: 'ticket' },
        // { value: '', label: 'Alelo', key: 'alelo' },
        // { value: '', label: 'Sodexo', key: 'sodexo' },
        // { value: '', label: 'Ben Visa Vale', key: 'benvisavale' }
        // { value: 'ticket', label: 'Ticket', key: 'ticket' },
        // { value: 'alelo', label: 'Alelo', key: 'alelo' },
        // { value: 'sodexo', label: 'Sodexo', key: 'sodexo' },
        // { value: 'benvisavale', label: 'Ben Visa Vale', key: 'benvisavale' }
    ]

    const handleOrigemChange = useCallback((e) => {
        if ((e && e.length === 0) || e.slice(-1)[0].value === '') {
            dispatch(resetOrigem());
            return;
        }
        dispatch(changeOrigens(e));

    }, []);

    return (
        <Select
            options={origemOptions}
            value={origens.map((origem) => {
                return {
                    value: origem.value,
                    label: origem.label,
                    key: origem.value
                }
            })}
            onChange={handleOrigemChange}
            placeholder={"Selecione"}
            isMulti={true}
            isClearable={true}
            styles={customStyle}
            components={{ NoOptionsMessage }}
        // isDisabled={true}
        />
    )
}

export default SelectOrigem