import React, { useState, useEffect } from 'react';
import '../CSS/dropdown.css';

function Dropdown(props) {
    useEffect(() => {
        setOptions(props.options) //> I'm dispatching an action here.
    }, [props.options])

    const [options, setOptions] = useState([]);
    const [hovered, setHover] = useState(false);
    const [mainValue, setMainValue] = useState(props.default);

    let menuOptions=[];
    for(const value of options){
        menuOptions.push(<p key={value} onClick={()=>changeValue(value)} className={"item"}>{value}</p>)
    }
    
    const changeValue=(value)=>{
        setMainValue(value);
        props.dropDownValueChanged(value);
    }

    return (
        <div className={"dropdownContainer"}  onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >
            <div className={"dropdown"}>
                <p key={mainValue} className={"value"}>{mainValue}</p>
            </div>
            {hovered && (
                <div className={"subMenu"}>
                    {menuOptions}
                </div>
            )}
        </div>

    )
}
export default Dropdown;