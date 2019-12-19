import React, {useState,useEffect} from "react"
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {useTheme} from "emotion-theming";

const options = [
    {value:'tag1',label:'Tag1',icon:'cccc'},
    {value:'tag2',label:'Tag2',icon:'cccc222'},
]

const customStyles = theme => {
    return {
        container: () => ({
            // none of react-select's styles are passed to <Control />
            width: '90%',
            position:'relative',
        }),
        control: () => ({
            backgroundColor:'transparent',
            color:theme.textColor,
            display:'flex',
            border:`1px solid ${theme.borderColor}`,
            borderRadius:15
        }),
        input: () =>({
            color:theme.textColor,
            fontSize:'1.3rem'
        }),
        multiValue: () =>({
            backgroundColor:theme.hoverColor,
            color:theme.textColor,
            fontSize:'1.5rem',
            display:'flex',
            margin:2,
            borderRadius:2,
            'div':{
                color:theme.textColor
            }
        }),
        placeholder: () =>({
            color:theme.textLightColor,
            fontSize:'1.3rem'
        }),
        menu: () => ({
            backgroundColor:theme.backgroundLightColor,
            color:theme.textColor,
            marginTop:15,
            borderRadius:15,
            boxShadow:'0px 2px 6px -4px black',
            fontSize:'1.5rem',
            fontWeight:500,
            overflow:'hidden'
        }),
        option: () => ({
            backgroundColor:'transparent',
            padding:'8px 10px',
            cursor:'pointer',
            '&:hover':{
                backgroundColor:theme.hoverColor
            }
        }),
    }
}

function transformTags(tags){
    let tagsWithAttrs = tags.map(tag=>{
        return {label:tag,value:tag,icon:''}
    })

    return tagsWithAttrs;
}

export function TagSelector({tags,setTags}){

    const theme = useTheme();

    function handleChange(values){
        props.setTags(values);
    }

    return (
        <Select
            styles={customStyles(theme)}
            options={options}
            closeMenuOnSelect={false}
            isMulti
            onChange={handleChange}
        />
    )
}

export function CreateableTagSelector(props){

    const theme = useTheme();

    function handleChange(values){
        props.setTags(values);
    }

    return (
        <CreatableSelect
            {...props}
            value={props.tags}
            styles={customStyles(theme)}
            options={options}
            closeMenuOnSelect={false}
            isMulti
            onChange={handleChange}
            menuIsOpen
            placeholder="Add or create your tags"
        />
    )
}

const customSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            { data.icon && <span className="input-select__icon">{ data.icon }</span> }
            <span>{ data.label }</span>
        </div>
    </div>
);