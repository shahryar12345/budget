import React, {useState,  useEffect} from 'react'

function SpreadMethods() {
    const [ count , setCount] = useState(0)

    useEffect(() => {
        
        return () => {
            console.log('use effect inside spread methods ')
        };
    })

    return (
        <div>
            
        </div>
    )
}

export default SpreadMethods
