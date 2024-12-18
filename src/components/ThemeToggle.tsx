import { useEffect } from "react";
import ThemeIcon from "../icons/ThemeIcon";

function ThemeToggle(){
    const toggleTheme = ()=>{
        if(document.documentElement.classList.contains('dark')){
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme','light')
        }else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme','dark')
        }
    };
    useEffect(()=>{
        const storedTheme = localStorage.getItem('theme');
        if(storedTheme === 'dark'){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark')
        }
    },[])

    return (
        <button onClick={toggleTheme} className="p-2 border rounded">
            <ThemeIcon/>
        </button>
    )
}

export default ThemeToggle