import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Badge from "../component/common/atom/Badge";
import Textbox from "../component/common/atom/Textbox";
import DataGrid from "../component/common/DataGrid";
import BetaElectronics from "../content/images/logo-beta_electronics.svg"
import DeltaPro from "../content/images/logo-deltapro.svg";

import React, { useEffect, useRef, useState } from 'react';

import axios from 'axios'

const Contract = () => {
    const [contract, setContract] = useState([]);
    const [valueProvider, setValueProvider] = useState([]);
    const [infoProvider, setInfoProvider] = useState([]);
    const [signing, setSigning] = useState("");
    const [end, setEnd] = useState("");
    const [paymentTerms, setPaymentTerms] = useState([]);
    const [dataTransScope, setDataTransScope] = useState("");
    const [dataTransHistory, setDataTransHistory] = useState([]);

    const [searchParams, setSearchParams]=useSearchParams();
    console.log(searchParams.get("prvId"));

    const {state} = useLocation();

    useEffect(() => {
        axios.post("/contract/list", {
            informationProviderId : sessionStorage.getItem("companyId")
            ,valueProviderId : searchParams.get("prvId")
        })
        .then((response) => {
            setContract(response.data.rsltList[0]);
            setSigning(response.data.rsltList[0].signingDate.substring(0, 10).replaceAll('-', '.'));
            setEnd(response.data.rsltList[0].endDate.substring(0, 10).replaceAll('-', '.'));
            setDataTransScope(response.data.rsltList[0].dataTransactionScope)
            setPaymentTerms(response.data.rsltList[0].paymentTerms.split("\n"))
        })
        .catch((error) => {
            console.log(error);
        })

        axios.post("/contract/dataHistoryList", {
            informationProviderId : sessionStorage.getItem("companyId")
            ,valueProviderId : searchParams.get("prvId")
        })
        .then((response) => {
            setDataTransHistory(response.data.rsltList)
        })
    }, []);

    const navigate = useNavigate();
    const gridHeader = [
        { key: "no", name: "NO", width: 61, cellClass: "text-center", headerCellClass: "text-center" },
        { key: "process_ID", name: "Process ID" },
        { key: "date", name: "Date", width: 140, cellClass: "text-center", headerCellClass: "text-center" },
    ]

    const rows = [
        // { no: 8, process_ID: "Payment for renewed data done. (100 USD for 100,000 calls)", date: "2023.08.31"},
        // { no: 7, process_ID: "CO2EQ aggregation completed and transferred.", date: "2023.08.24"},
        // { no: 6, process_ID: "CO2EQ aggregation started by DelaPro.", date: "2023.08.22"},
        // { no: 5, process_ID: "CO2EQ requested by BETA electronics.", date: "2023.08.22"},
        // { no: 4, process_ID: "Payment for renewed data done. (50 USD for 50,000 calls)", date: "2023.01.31"},
        // { no: 3, process_ID: "CO2EQ aggregation completed and transferred.", date: "2023.01.12"},
        // { no: 2, process_ID: "CO2EQ aggregation started by DelaPro.", date: "2023.01.11"},
        // { no: 1, process_ID: "CO2EQ requested by BETA electronics.", date: "2023.01.11"},
    ]

    if(dataTransHistory !== null){
        for (var i=0; i < dataTransHistory.length; i++) {
            rows.push({
                no: i+1,
                process_ID: dataTransHistory[i].content,
                date: dataTransHistory[i]
            })
        }
    }

    const dataScopeList = dataTransScope.split("\n");
    const scopeRenderList = []
    for (var i = 0; i < dataScopeList.length; i++) {
        scopeRenderList.push(<li className="[&:not(:last-child)]:mb-2"><span className="font-bold">{dataScopeList[i].split(":")[0]}</span>:{dataScopeList[i].split(":")[1]}</li>)
    }

    const paymentRenderList = []
    for (var i = 0; i < paymentTerms.length; i++) {
        if (i === 0) {
            paymentRenderList.push(<span>{paymentTerms[i]}</span>)
        } else {
            paymentRenderList.push(<span className="mt-2">{paymentTerms[i]}</span>)
        }
    }

    const totalCount = rows.length;

    function goContract(){
        if(window.confirm("계약진행하시겠습니까?")){
            axios.post('/contract/insert', {
                informationProviderId : sessionStorage.getItem("companyId")
                ,valueProviderId : searchParams.get("prvId")
                ,dataTransactionScope : "Test Contract"
                ,dataTransactionCost : "1 Year 10,000USD"
            })
            .then((response) => {
                //console.log(response);

                if(response.data["rsltCode"] == "S"){
                    document.location.href = "/dxai/"+sessionStorage.getItem("companyId");
                    //navigate('/dxai/ProductDetail');
                }else{
                    alert("계약진행실패" + response.data["rsltMsg"]);
                }
            })
            .catch((error) => {
                alert("계약진행실패" + error)
            });
        }
    }
    return (
        <>
            <div className="card h-[3.75rem] px-5 flex items-center select-none cursor-pointer" onClick={() => navigate('/ProductDetail', {state: {id: sessionStorage.getItem("productId")}})}>
                <i className="icon-chevron_left w-[2.125rem] h-[2.125rem] text-2xl flex items-center justify-center text-default cursor-pointer select-none mr-2"></i>
                <p className="text-base font-bold">{searchParams.get("prdName")}</p>
            </div>
            <div className="p-[1.875rem]">
                <div className="flex items-center mb-5">
                    <div className="card h-[15.5rem] w-[calc(50%_-_9.375rem)] px-[1.875rem] py-7 flex justify-between">
                        <div>
                            <div className="mb-2 pb-[0.625rem]">
                                <Badge text="Me" mode="primary"/>
                            </div>
                            <ul>
                                <li className="mb-2 pb-2 flex flex-col">
                                    <span className="text-default text-sm mb-1 leading-none">Company</span>
                                    {/* <p className="text-text-dark text-xl font-extrabold leading-none">베타전자</p> */}
                                    <p className="text-text-dark text-xl font-extrabold leading-none">{contract.valueProviderName}</p>
                                </li>
                                <li className="mb-2 flex flex-col">
                                    <span className="text-default text-sm leading-none">Web Site</span>
                                    {/* <p className="text-text-default text-15 leading-6">www.beta_electronics.com</p> */}
                                    <p className="text-text-default text-15 leading-6">{contract.valueProviderWebsite}</p>
                                </li>
                                <li className="flex flex-col">
                                    <span className="text-default text-sm leading-none">Tier ID</span>
                                    <p className="text-text-default text-15 leading-6">ID#34EF56A</p>
                                </li>
                            </ul>
                        </div>
                        <div className="w-60 h-full pl-[1.875rem] flex items-center justify-center border-l border-border-light">
                            <img src={BetaElectronics} alt="beta electronics" className="w-[9.375rem]"/>
                        </div>
                    </div>
                    <div className="w-[18.75rem] px-10 flex items-center justify-center">
                        <i className="icon-arrow_move_left text-[4.375rem] w-[4.375rem] h-[4.375rem] inline-block text-primary"></i>
                        <button className='block' onClick={() => {
                                goContract()
                            }}>Contract</button> 
                    </div>
                    <div className="card h-[15.5rem] w-[calc(50%_-_9.375rem)] px-[1.875rem] py-7 flex justify-between">
                        <div>
                            <div className="mb-2 pb-[0.625rem]">
                                <Badge text="Sub Tier" mode="dark"/>
                            </div>
                            <ul>
                                <li className="mb-2 pb-2 flex flex-col"> 
                                    <span className="text-default text-sm mb-1 leading-none">Company</span>
                                    {/* <p className="text-text-dark text-xl font-extrabold leading-none">Delta Pro</p> */}
                                    <p className="text-text-dark text-xl font-extrabold leading-none">{contract.informationProviderName}</p>
                                </li>
                                <li className="mb-2 flex flex-col">
                                    <span className="text-default text-sm leading-none">Web Site</span>
                                    {/* <p className="text-text-default text-15 leading-6">www.delta_pro.com</p> */}
                                    <p className="text-text-default text-15 leading-6">{contract.informationProviderWebsite}</p>
                                </li>
                                <li className="flex flex-col">
                                    <span className="text-default text-sm leading-none">Tier ID</span>
                                    <p className="text-text-default text-15 leading-6">ID#QR372AFK</p>
                                </li>
                            </ul>
                        </div>
                        <div className="w-60 h-full pl-[1.875rem] flex items-center justify-center border-l border-border-light">
                            <img src={DeltaPro} alt="delta pro" className="w-[9.375rem]"/>
                        </div>
                    </div>
                </div>
                <div className="card mb-5">
                    <div className="p-4 flex items-center justify-between">
                        <p className="text-base font-bold text-text-dark pl-[0.875rem]">Data Transaction History</p>
                        <div>
                            <Textbox isSearchbox={true} placeholder="search"/>
                        </div>
                    </div>
                    <DataGrid header={gridHeader} rows={rows} totalCount={totalCount} />
                </div>
                <div className="card">
                    <div className="p-4 h-[4.75rem] w-full flex items-center border-b border-border-light">
                        <p className="text-text-dark text-base font-bold pl-[0.875rem]">Contract Information</p>
                    </div>
                    <div className="py-5 px-[1.875rem]">
                        <div className="pb-5 flex items-center border-b border-border-light">
                            <div className="w-[3.75rem] h-[3.75rem] rounded-full bg-primary mr-4">
                                <i className="icon-file_certificate text-white text-[1.875rem] p-[0.938rem]"></i>
                            </div>
                            <p className="text-base text-text-dark font-bold leading-none">Electronic Data Capture <br/>Contract</p>
                        </div>
                        <ul className="py-10 border-b border-border-light">
                            <li className="border-b border-border-light">
                                <div className="w-full pb-7 flex items-center">
                                    <p className="w-60 pr-5 text-text-dark text-base font-bold leading-none">Contract Signing Date</p>
                                    {/* <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none">2021.11.05</p> */}
                                    <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none">{signing}</p>
                                </div>
                                <div className="w-full pb-7 flex items-center">
                                    <p className="w-60 pr-5 text-text-dark text-base font-bold leading-none">Contract End Date</p>
                                    {/* <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none">2025.11.04</p> */}
                                    <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none">{end}</p> 
                                </div>
                            </li>
                            <li className="py-7 border-b border-border-light">
                                <div className="flex">
                                    <p className="w-60 pr-5 text-text-dark text-base font-bold leading-none">Data Transaction Scope</p>
                                    <ul className="list-decimal pl-4 text-text-default text-base">
                                        {/* <li className="[&:not(:last-child)]:mb-2"><span className="font-bold">CO2Eq</span>: CO2 footprint equivalent emitted per one product.</li>
                                        <li className="[&:not(:last-child)]:mb-2"><span className="font-bold">BOM</span>: Bill of Materials, listing the type and the number of all parts included in one product</li>
                                        <li className="[&:not(:last-child)]:mb-2"><span className="font-bold">Routing Data</span>: describing the processes and the resources needed to complete one product.</li> */}
                                        {scopeRenderList}
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <div className="w-full pt-7 flex items-center">
                                    <p className="w-60 pr-5 text-text-dark text-base font-bold leading-none">Data Transaction Cost</p>
                                    {/* <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none">100 USD / 100,000 Calls</p> */}
                                    <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none">{contract.dataTransactionCost}</p>
                                </div>
                                <div className="w-full pt-7 flex">
                                    <p className="w-60 pr-5 text-text-dark text-base font-bold leading-none">Payment Terms</p>
                                    {/* <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none flex flex-col"><span>USD or equivalent tokens</span><span className="mt-2">On end date of every month</span></p> */}
                                    <p className="w-[calc(100%_-_15rem)] text-text-default text-base leading-none flex flex-col">{paymentRenderList}</p>
                                </div>
                            </li>
                        </ul>
                        <div className="flex items-center justify-end pt-[1.875rem]">
                            <div className="w-[12.5rem] h-20 flex items-center justify-center mr-2">
                                <img src={BetaElectronics} alt="beta electronics" className="w-[9.375rem]"/>
                            </div>
                            <div className="w-[12.5rem] h-20 flex items-center justify-center">
                                <img src={DeltaPro} alt="delta pro" className="w-[9.375rem]"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Contract;