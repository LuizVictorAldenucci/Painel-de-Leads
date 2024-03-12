import { useCallback, useEffect } from "react";

import SelectCidade from "./SelectCidade";
import SelectUf from "./SelectUf";
import SelectBairro from "./SelectBairro";
import SelectAssociados from "./SelectAssociados";
import SelectSouabrasel from "./SelectSouabrasel";
import { useDispatch, useSelector } from "react-redux";
import { changeGroupby, selectDarkMode, selectUf, selectCidade, selectBairro, resetOrigem } from "../../queryParams/queryParamsSlice";
import { resetBairro, resetPageSize } from "../../queryParams/queryParamsSlice";
import { changeBairrosArray, changeCidadesArray } from "../../locationOptions/locationArraySlice";
import { changeUf, changeCidade, changeAssociados, changeSouabrasel } from "../../queryParams/queryParamsSlice";
import SelectOrigem from "./SelectOrigem";


const Selectors = () => {
    const dispatch = useDispatch()
    const darkMode = useSelector(selectDarkMode)
    const uf = useSelector(selectUf)
    const cidade = useSelector(selectCidade)
    const bairro = useSelector(selectBairro)

    const customStyle = {
        control: (provided, state) => ({
            ...provided,
            background: state.isDisabled ? ((darkMode ? '#1F2937' : 'white')) : (darkMode ? '#111827' : 'white'), // Change the background color based on dark mode
            borderColor: (darkMode ? '#0EC6CB' : 'none'), // Change the border color based on dark mode
            '&:hover': {
                borderColor: (darkMode ? '#ffffff' : '#aaaaaa'), // Change the hover color based on dark mode
            },
            opacity: state.isDisabled ? (darkMode ? 0.3 : 0.6) : 1,
            minHeight: '38px',
            overflow: 'auto',
            width: 'auto',
            innerHeight: '38px',
            cursor: state.isDisabled ? 'not-allowed' : 'default',
        }),
        option: (provided, state) => ({
            ...provided,
            background: (state.isSelected ? (darkMode ? '#111827' : '#ffffff') : (darkMode ? '#111827' : '#ffffff')), // Change the selected option background color based on dark mode
            color: (state.isSelected ? (darkMode ? '#0EC6CB' : '#011559') : (darkMode ? '#ffffff' : '#333333')), // Change the selected option color based on dark mode
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: (state.isDisabled ? 'grey' : (darkMode ? '#0EC6CB' : '#011559')),
            fontSize: "15px",
        }),
        multiValue: (provided, state) => ({
            ...provided,
            background: darkMode ? '#242C41' : '#E0E2E6', // Change the background color based on dark mode
            color: darkMode ? '#B8BABE' : '#333333', // Change the font color based on dark mode
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
            color: darkMode ? '#B8BABE' : '#333333', // Change the font color based on dark mode
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            overflow: 'auto', // Make the selected options scrollable
            maxHeight: '36px', // Set a maximum height to limit the size

            '& div': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
        }),
        menuList: (base) => ({
            ...base,
            "::-webkit-scrollbar": {
                width: "4px",
                height: "0px",
            },
            "::-webkit-scrollbar-track": {
                background: darkMode ? '#111827' : 'white',

            },
            "::-webkit-scrollbar-thumb": {
                background: darkMode ? 'rgba(76, 208, 125, 0.6)' : 'rgba(4, 106, 56, 0.6)'
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: "#555"
            }
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            display: 'none', // Hide the default arrow
        }),

        indicatorSeparator: (provided, state) => ({
            ...provided,
            display: 'none', // Hide the vertical bar
        }),
    };

    const cleanFilters = useCallback(() => {
        dispatch(changeUf(''))
        dispatch(changeCidade(''))
        dispatch(changeGroupby('uf'))
        dispatch(resetBairro())
        dispatch(changeAssociados(''))
        dispatch(changeSouabrasel(''))
        dispatch(changeCidadesArray([]))
        dispatch(changeBairrosArray([]))
        dispatch(resetPageSize())
        dispatch(resetOrigem());
    }, [])

    useEffect(() => {
        dispatch(resetPageSize());
    }, [uf, cidade, bairro])

    return (
        <div className="flex flex-col justify-center align-center">
            <div className="flex flex-col md:flex-row md:flex-wrap  justify-between items-center mb-6 pt-4 ">
                <div className="w-full md:w-[calc(33%-15px)] mt-4 mr-2 ml-2 md:ml-0">
                    <h3 className={darkMode ? 'text-white' : 'text-azul_0'}>Estado</h3>
                    <SelectUf customStyle={customStyle} />
                </div>
                <div className="w-full md:w-[calc(33%-15px)] mt-4 mr-2 ml-2 md:ml-0">
                    <h3 className={darkMode ? 'text-white' : 'text-azul_0'}>Cidade</h3>
                    <SelectCidade customStyle={customStyle} />
                </div>
                <div className="w-full md:w-[calc(33%-15px)] mt-4 mr-2 ml-2 md:ml-0">
                    <h3 className={darkMode ? 'text-white' : 'text-azul_0'}>Bairros</h3>
                    <SelectBairro customStyle={customStyle} />
                </div>
                <div className="w-full md:w-[calc(33%-15px)] mt-4 mr-2 ml-2 md:ml-0">
                    <h3 className={darkMode ? 'text-white' : 'text-azul_0'}>Associados</h3>
                    <SelectAssociados customStyle={customStyle} />
                </div>
                <div className="w-full md:w-[calc(33%-15px)] mt-4 mr-2 ml-2 md:ml-0">
                    <h3 className={darkMode ? 'text-white' : 'text-azul_0'}>Sou Abrasel</h3>
                    <SelectSouabrasel customStyle={customStyle} />
                </div>
                <div className="w-full md:w-[calc(33%-15px)] mt-4 mr-2 ml-2 md:ml-0">
                    <h3 className={darkMode ? 'text-white' : 'text-azul_0'}>Origem dos dados</h3>
                    {/* <SelectOrigem customStyle={customStyle} /> */}
                    <SelectOrigem customStyle={customStyle} />
                </div>
            </div>
            <button className={`p-2 w-[200px] m-auto mt-2 rounded  transition-all duration-300 ${darkMode ? 'hover:bg-azul_3 bg-azul_4 text-black' : ' bg-azul_0 hover:bg-azul_3 text-white'} `} onClick={cleanFilters}>Limpar filtros</button>
        </div>
    )
}

export default Selectors