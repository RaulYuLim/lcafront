import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../component/common/PageTitle";
import ProcessForm from "../userForm/ProcessForm";
import "../userCss/userCss.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProcessRegister = () => {
    const [codeList, setCodeList] = useState([]);

    const navigate = useNavigate();

    const submit = values => {
        console.log("submit" , values);

        axios.post('/process/insert', {
            name : values["process name"]
            , co2eq : values["co2eq"]
            , companyId : sessionStorage.getItem("companyId")
            ,updateRequested : 'N'
            , createdId : sessionStorage.getItem("memberId")
            , modifiedId : sessionStorage.getItem("memberId")
        })
        .then((response) => {
            if(response.data["rsltCode"] === "F")
                alert(response.data["rsltMsg"]);
            else if(response.data["rsltCode"] === "S")
                alert(response.data["rsltMsg"]);
            navigate("/")
        })
        .catch((error) => {
            alert("등록실패")
        });
    };

    function goProduct(){
        document.location.href = "/dxai/" + sessionStorage.getItem("companyId");
    }
    
    const { state, handleChange, handleSubmit } = ProcessForm(submit);
    return (
        <>
            <PageTitle />
            <div className="p-[1.875rem]">
                <div className="bg-white ">
                    <ul>
                        <li className="mb-2 pb-2 flex flex-col">
                            <p className="text-text-dark text-xl font-extrabold leading-none">Process Info Register</p>
                        </li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                <div className="card h-auto mb-5">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <ProcessInput
                                state={state}
                                handleChange={handleChange}
                                name="process name"
                                label="process Name"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <ProcessInput
                                    state={state}
                                    handleChange={handleChange}
                                    name="co2eq"
                                    label="CO2EQ"
                                    type="text"
                            />
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className='flex form-actions'>
                            <button type="submit" className="submit-btn">Register</button>&nbsp;<button onClick={() => {goProduct()}} className="submit-btn">Cancle</button>
                        </div>
                    </div>
                </div>
                </form>
            </div>
        </>
    );
};

export default ProcessRegister;

const ProcessInput = ({ name , label, state, handleChange}) => {
    return(
        <label>
            {label}
            <input 
                type={name}
                placeholder={name}
                name={name}
                value={state.input[name]}
                onChange={handleChange}
            />
            <span>{state.validationErrs[name]}</span>
        </label>
    )
}