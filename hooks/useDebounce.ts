import { useEffect, useState } from "react"


// When the user types in the search input, it updates the state (value) immediately on every keystroke.
// Without debouncing, this would trigger any dependent logic (like filtering search results) with every single keystroke, which can be inefficient.
// useDebounce delays updating the debounced value (debounceValue) until the user has stopped typing for a set amount of time (delay, which defaults to 500ms).

export const useDebounce = <T>(value:T,delay:number=500):T=>{ 

    const [debounceValue,setDebounceValue]=useState<T>(value)

    useEffect(()=>{
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, delay);

        //cleaning the function to clear the timeout on component unmount
        return ()=>{
            clearTimeout(handler)
        }

    },[value,delay])

    return debounceValue

}