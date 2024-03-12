
import { RiTwitterLine } from "react-icons/ri";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineLinkedin, AiOutlineYoutube } from "react-icons/ai";
import imgFooter from '../img_Estudio/4.png';
import { useSelector } from "react-redux";
import { selectDarkMode } from "../features/queryParams/queryParamsSlice";

const Footer = () => {
    // const { darkMode } = useContext(DataContext);
    const darkMode = useSelector(selectDarkMode)

    return (
        <footer className={`${darkMode ? 'border-azul_4 border-t-2 bg-gray-900' : 'bg-black'} flex flex-col h-[240px] sm:h-56 justify-between w-full absolute`}>
            <div className="overflow-hidden flex sm:flex-row flex-col justify-around items-center align-middle h-full">
                <div className="overflow-hidden h-100px">
                    {/* <a
                        href="https://abrasel.com.br/"
                        aria-label="Visit our page"
                        target="_blank" rel="noreferrer"
                        className="overflow-hidden"
                    > */}
                    <img className="w-[190px] h-auto" src={imgFooter} alt="Logo da Abrasel Nacional" />
                    {/* </a> */}
                </div>
                <div className="social-icons flex flex-row justify-center items-center">
                    <ul className="flex flex-row text-white self-center">
                        <li><a aria-label="Visit our Instagram page" target="_blank" rel="noreferrer" href="https://www.instagram.com/abrasel_/?hl=pt"><AiOutlineInstagram className="text-2xl mx-1 text-white" /></a></li>
                        <li><a aria-label="Visit our Twitter page" target="_blank" rel="noreferrer" href="https://twitter.com/abraselbrasil?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"><RiTwitterLine className="text-2xl mx-1 text-white" /></a></li>
                        <li><a aria-label="Visit our Linkedin page" target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/abrasel/?originalSubdomain=br"><AiOutlineLinkedin className="text-2xl mx-1 text-white" /></a></li>
                        <li><a aria-label="Visit our Facebook page" target="_blank" rel="noreferrer" href="https://www.facebook.com/abraselssp/"><AiOutlineFacebook className="text-2xl mx-1 text-white" /></a></li>
                        <li><a aria-label="Visit our Youtube page" target="_blank" rel="noreferrer" href="https://www.youtube.com/channel/UCT58ptJHV0XCO8JjbFodEpQ"><AiOutlineYoutube className="text-2xl mx-1 text-white" /></a></li>
                    </ul>
                </div>
            </div>
            <div className="bg-grey text-white bottom-0 ">
                <p className="text-sm text-center mt-[30px]">Abrasel &copy; 2023 - Todos os direitos reservados</p>
            </div>
        </footer >
    );
};

export default Footer;