import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeDarkMode, selectDarkMode } from '../features/queryParams/queryParamsSlice';

const Header = () => {
    const dispatch = useDispatch()
    const darkMode = useSelector(selectDarkMode);

    const toggleDarkMode = useCallback(() => {
        if (!darkMode) {
            dispatch(changeDarkMode(true))
        } else {
            dispatch(changeDarkMode(false))
        }
    }, [darkMode])


    return (
        // <header className={`${darkMode ? 'bg-azul_4 text-gray-900' : 'bg-azul_0 text-white'} w-full top-0 flex justify-around items-center p-4 h-18`}>
        <header className={`${darkMode ? ' text-azul_4 bg-gray-900 ' : 'text-azul_0 bg-gray-100 '}  w-full top-0 flex justify-around items-center px-4 py-2 flex-col md:flex-row`}>
            <div className="flex items-center justify-center flex-grow md:pl-8">
                <h1 className="text-5xl text-center pl-8 ">Base de Contatos</h1>
            </div>
            <label title="Trocar modo de visualização claro/escuro" className="flex flex-col items-center cursor-pointer pr-4 pt-2">
                <input className="hidden" type="checkbox" id="toggle" onChange={toggleDarkMode} checked={darkMode} />
                <span className={`${darkMode ? 'bg-gray-700' : 'bg-white'} toggle-wrapper relative h-5 w-8 rounded-full flex items-center justify-center transition-all ease-in-out delay-150`}>
                    <span className={`selector absolute w-3 h-3 rounded-full transition-transform duration-300 left-1 ${!darkMode ? 'translate-x-full bg-azul_0 ' : 'bg-azul_4'}`}></span>
                </span>
                <p className="ml-3 p-1 text-sm">Dark / Light </p>
            </label>
        </header>
    )
}

export default Header;