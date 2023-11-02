import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Badge from "../component/common/atom/Badge";
import Textbox from "../component/common/atom/Textbox";
import DataGrid from "../component/common/DataGrid";
import SankeyChart from "../component/common/SankeyChart";
import machine from "../content/images/img-machine.jpg";

import ComponentAddModal from '../component/modals/ComponentAddModal';
import ProcessAddModal from '../component/modals/ProcessAddModal';
import ResourceAddModal from '../component/modals/ResourceAddModal';

import ComponentModifyModal from '../component/modals/ComponentModifyModal';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'

const Page200 = ({route}) => {
    const state = useLocation().state
    const [superTierList, setSuperTierList] = useState([]);
    const [componentList, setComponentList] = useState([]);
    const [resourceList, setResourceList] = useState([]);
    const [processList, setProcessList] = useState([]);
    const [componentCadidateList, setComponentCandidateList] = useState([]);
    const [resourceCadidateList, setResourceCandidateList] = useState([]);
    const [processCadidateList, setProcessCandidateList] = useState([]);
    const [modifyQnty, setModifyQnty] = useState(0);

    const navigate = useNavigate();
    sessionStorage.setItem("productId", state.id)

    useEffect(() => {
        if (state != null) {
            axios.post('/product/component/List', {
                id : state.id
                ,strPageNum : 0
                ,pageSize : 10
            })
            .then((response) => {
                setComponentList(response.data["rsltList"]);
            })
            .catch((error) => {
                console.log(error);
                setComponentList([]);
            });
    
            axios.post("/resource/ListByProduct", { 
                id : state.id
            })
            .then((response) => {
                setResourceList(response.data["rsltList"]);
            })
            .catch((error) => {
                console.log(error);
                setResourceList([]);
            });
    
            axios.post("/process/ListByProduct", { 
                id : state.id
            })
            .then((response) => {
                setProcessList(response.data["rsltList"]);
            })
            .catch((error) => {
                console.log(error);
                setProcessList([]);
            });

            axios.post("/company/superTierList", { 
                id : state.id
            })
            .then((response) => {
                setSuperTierList(response.data["rsltList"]);
            })
            .catch((error) => {
                console.log(error);
                setSuperTierList([]);
            });

            axios.post("/product/component/candid/list", { 
                id : state.id
            })
            .then((response) => {
                setComponentCandidateList(response.data["rsltList"]);
            })
            .catch((error) => {
                console.log(error);
                setComponentCandidateList([]);
            });

            axios.post("/resource/candidList", { 
                id : state.id
            })
            .then((response) => {
                setResourceCandidateList(response.data["rsltList"]);
            })
            .catch((error) => {
                console.log(error);
                setResourceCandidateList([]);
            });

            axios.post("/process/candidList", { 
                companyId: sessionStorage.getItem("companyId"),
                id : state.id
            })
            .then((response) => {
                setProcessCandidateList(response.data["rsltList"]);
            })
            .catch((error) => {
                console.log(error);
                setProcessCandidateList([]);
            });
        }
    }, []);



    const STRHeader = [
        { key: "no", name: "NO", width: 61, cellClass: "text-center", headerCellClass: "text-center" },
        { key: "buyer", name: "Buyer"},
        { key: "buyer_ID", name: "Buyer ID" },
        { key: "last_request", name: "Last request", cellClass: "text-center", headerCellClass: "text-center"  },
        { key: "TX_done", name: "TX done", cellClass: "text-center", headerCellClass: "text-center"  },
        { 
            key: "send", name: "Send", cellClass: "text-center", headerCellClass: "text-center",
            renderCell({ row }) {
                return <Badge value={row.send} isBoolean={true} text="Send" />;
            },
        },
    ];

    const STRRows = [
        // { no: 2, buyer: "알파에너지솔루션", buyer_ID: "ID#75AC872", last_request: "2023.08.15", TX_done: "NOT YET", send: false },
        // { no: 1, buyer: "미래베터리", buyer_ID: "ID#CK23541", last_request: "2023.07.12", TX_done: "DONE", send: false },
    ];

    for (var i=0; i<superTierList.length; i++) {
        STRRows.push(
            {
                no: i+1,
                buyer: superTierList[i].name,
                buyer_ID: "ID#75AC872",
                last_request: "2023-10-18",
                TX_done: "DONE", 
                send: false
            }
    )};

    if (STRRows.length > 0) {
        STRRows[0].TX_done = "NOT YET";
    }

    const STRTotalCount = STRRows.length;

    const PCHeader = [
        { key: "no", name: "NO", width: 61, cellClass: "text-center", headerCellClass: "text-center" },
        { key: "component", name: "Component" },
        { key: "component_ID", name: "Component ID" },
        { key: "supplier", name: "Supplier" },
        { key: "supplier_ID", name: "Supplier ID" },
        { key: "Qnty", name: "Qnty[unit/prd]", width: 100, cellClass: "text-right", headerCellClass: "text-right" },
        { key: "CO2EQ", name: "CO2EQ[kg/prd]", cellClass: "text-right", headerCellClass: "text-right" },
        { key: "last_update", name: "Last update", cellClass: "text-center", headerCellClass: "text-center"  },
        { 
            key: "update", name: "Update", cellClass: "text-center", headerCellClass: "text-center",
            renderCell({ row }) {
                const goContract = "/Contract?prvId=" + row.supplier_ID + "&prdName=" + row.component + "&prdId="+state.id;
                return <Badge value={row.update} isBoolean={true} text="Update" dest={goContract} navigateState={row.state} />;
            },
        },
        { 
            key: "modify", name: "", width: 100, cellClass: "text-left",
            renderCell({ row }) {
                return  <button className='block' onClick={() => {
                    document.getElementById("modifyType").innerHTML = "Component"
                    document.getElementById("modifyName").innerHTML = componentList[row.no-1].name
                    document.getElementById("modifyCompany").classList.remove("hidden")
                    document.getElementById("modifyCompanyName").classList.remove("hidden")
                    document.getElementById("modifyCompanyName").innerHTML = row.supplier
                    document.getElementById("modifyCo2eqValue").innerHTML = row.CO2EQ
                    document.getElementById("modifyQnty").classList.add("hidden")
                    document.getElementById("editButton").classList.add("hidden")
                    document.getElementById("qntyBold").classList.remove("hidden")
                    document.getElementById("qntyBold").value = componentList[row.no-1].qnty
                    document.getElementById("componentModifyModal").classList.remove("hidden");
                    sessionStorage.setItem("modifyId", componentList[row.no-1].id)
                }}>modify</button>
            }
        },
    ]

    const PCRows = []
    for (var i=0; i < componentList.length; i++) {
        PCRows.push(
            {
                no: i+1,
                component: componentList[i].name,
                component_ID: componentList[i].id,
                supplier: componentList[i].supplierName,
                supplier_ID: componentList[i].supplierId,
                Qnty: componentList[i].qnty + " " + componentList[i].unit,
                CO2EQ: componentList[i].co2eq,
                last_update: componentList[i].lastUpdate,
                update: componentList[i].updateYn === "1"? true : false,
                unit: componentList[i].unit
            }
        )
    }
    if (PCRows.length > 1) {
        //PCRows[1].last_update = "NOT YET"
        // PCRows[1].update = true
        //PCRows[1].click = "/Contract"
    }

    const PCTotalCount = PCRows.length;

    function goContract(valueProviderId, informationProviderId){
        console.log("valueProviderId :::" + valueProviderId);
        console.log("informationProviderId :::" + informationProviderId);
    }

    const PRHeader = [
        { key: "no", name: "NO", width: 61, cellClass: "text-center", headerCellClass: "text-center" },
        { key: "resource", name: "Resource" },
        { key: "Qnty", name: "Qnty[unit/prd]", cellClass: "text-right", headerCellClass: "text-right" },
        { key: "CO2EQ", name: "CO2EQ[kg/prd]", cellClass: "text-right", headerCellClass: "text-right" },
        { key: "last_update", name: "Last update", cellClass: "text-center", headerCellClass: "text-center"  },
        { 
            key: "update", name: "Update", cellClass: "text-center", headerCellClass: "text-center",
            renderCell({ row }) {
                return <Badge value={row.update} isBoolean={true} text="Update" dest="/Contract" navigateState={row.state}/>;
            },
        },
        { 
            key: "modify", name: "", width: 100, cellClass: "text-left",
            renderCell({ row }) {
                return  <button className='block' onClick={() => {
                    document.getElementById("modifyType").innerHTML = "Resource"
                    document.getElementById("modifyName").innerHTML = resourceList[row.no-1].name
                    document.getElementById("modifyCompany").classList.add("hidden")
                    document.getElementById("modifyCompanyName").classList.add("hidden")
                    document.getElementById("modifyCo2eqValue").innerHTML = row.CO2EQ
                    document.getElementById("modifyQnty").value = resourceList[row.no-1].qnty
                    document.getElementById("componentModifyModal").classList.remove("hidden");
                    sessionStorage.setItem("modifyId", resourceList[row.no-1].id)
                    document.getElementById("modifyQnty").classList.remove("hidden")
                    document.getElementById("editButton").classList.remove("hidden")
                    document.getElementById("qntyBold").classList.add("hidden")
                }}>modify</button>
            }
        },
    ]

    const PRRows = []

    for (var i=0; i < resourceList.length; i++) {
        PRRows.push(
            {
                no: i+1,
                resource: resourceList[i].name,
                Qnty: resourceList[i].qnty + " " + resourceList[i].unit,
                CO2EQ: resourceList[i].co2eq,
                last_update: resourceList[i].lastUpdate,
                update: false
            }
        )
    }

    const PRTotalCount = PRRows.length;

    const MPHeader = [
        { key: "no", name: "NO", width: 61, cellClass: "text-center", headerCellClass: "text-center" },
        { key: "process", name: "Process" },
        { key: "Qnty", name: "Qnty[unit/prd]", cellClass: "text-right", headerCellClass: "text-right" },
        { key: "CO2EQ", name: "CO2EQ[kg/prd]", cellClass: "text-right", headerCellClass: "text-right" },
        { key: "last_update", name: "Last update", cellClass: "text-center", headerCellClass: "text-center"  },
        { 
            key: "update", name: "Update", cellClass: "text-center", headerCellClass: "text-center",
            renderCell({ row }) {
                return <Badge value={row.update} isBoolean={true} text="Update" dest="/Contract" navigateState={row.state}/>;
            },
        },
        { 
            key: "modify", name: "", width: 100, cellClass: "text-left",
            renderCell({ row }) {
                return  <button className='block' onClick={() => {
                    document.getElementById("modifyType").innerHTML = "Process"
                    document.getElementById("modifyName").innerHTML = processList[row.no-1].name
                    document.getElementById("modifyCompany").classList.add("hidden")
                    document.getElementById("modifyCompanyName").classList.add("hidden")
                    document.getElementById("modifyCo2eqValue").innerHTML = row.CO2EQ
                    document.getElementById("modifyQnty").value = processList[row.no-1].qnty
                    document.getElementById("componentModifyModal").classList.remove("hidden");
                    sessionStorage.setItem("modifyId", processList[row.no-1].id)
                    document.getElementById("modifyQnty").classList.remove("hidden")
                    document.getElementById("editButton").classList.remove("hidden")
                    document.getElementById("qntyBold").classList.add("hidden")
                }}>modify</button>
            }
        },
    ]

    const MPRows = []

    for (var i=0; i < processList?.length; i++) {
        MPRows.push(
            {
                no: i+1,
                process: processList[i].name,
                unit: processList[i].unit,
                CO2EQ: processList[i].co2eq,
                Qnty: processList[i].qnty ,
                last_update: processList[i].lastUpdate,
                equipment: "sdfk",
                update: false,
                state : {}
            }
        )
    }

    const MPTotalCount = MPRows.length;

    const CCRows = []

    for (var i=0; i < componentCadidateList?.length; i++) {
        CCRows.push(
            {
                no: i+1,
                component: componentCadidateList[i].name,
                component_ID: componentCadidateList[i].id,
                supplier: componentCadidateList[i].supplierName,
                supplier_ID: "ID#30AB117",
                Qnty: componentCadidateList[i].qnty + " " + componentCadidateList[i].unit,
                CO2EQ: componentCadidateList[i].co2eq,
                last_update: componentCadidateList[i].lastUpdate,
                update: false
            }
        )
    }

    const CRRows = []

    for (var i=0; i < resourceCadidateList?.length; i++) {
        CRRows.push(
            {
                no: i+1,
                resource: resourceCadidateList[i].name,
                resource_ID: resourceCadidateList[i].id,
                CO2EQ: resourceCadidateList[i].co2eq,
                unit: resourceCadidateList[i].unit,
                last_update: resourceCadidateList[i].lastUpdate,
                update: false
            }
        )
    }

    const CPRows = []
    for (var i=0; i < processCadidateList?.length; i++) {
        CPRows.push(
            {
                no: i+1,
                process: processCadidateList[i].name,
                process_ID: processCadidateList[i].id,
                CO2EQ: processCadidateList[i].co2eq,
                unit: processCadidateList[i].unit,
                last_update: processCadidateList[i].lastUpdate,
                update: false
            }
        )
    }

    return (
        <>
            <div className="card h-[3.75rem] px-5 flex items-center cursor-pointer select-none" onClick={() => navigate('/')}>
                <i className="icon-chevron_left w-[2.125rem] h-[2.125rem] text-2xl flex items-center justify-center text-default cursor-pointer select-none mr-2"></i>
                <p className="text-base font-bold">Product</p>
            </div>
            <ComponentAddModal rows={CCRows} productId={state.id}></ComponentAddModal>
            <ProcessAddModal rows={CPRows} productId={state.id}></ProcessAddModal>
            <ResourceAddModal rows={CRRows} productId={state.id}></ResourceAddModal>
            <ComponentModifyModal></ComponentModifyModal>
            <div className="p-[1.875rem]">
                <div className="bg-white w-full h-[15.438rem] py-7 px-[1.875rem] mb-5 shadow-ix rounded flex justify-between">
                    <ul>
                        <li className="mb-2 pb-2 flex flex-col">
                            <span className="text-default text-sm mb-1 leading-none">Product</span>
                            <p className="text-text-dark text-xl font-extrabold leading-none">{state? state.name : ""}</p>
                        </li>
                        <li className="mb-2 flex flex-col">
                            <span className="text-default text-sm leading-none">Company</span>
                            <p className="text-text-default text-15 leading-6 h-6">{state? state.company : ""}</p>
                        </li>
                        <li className="mb-2 flex flex-col">
                            <span className="text-default text-sm leading-none">Product ID</span>
                            <p className="text-text-default text-15 leading-6 h-6">23459090</p>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-default text-sm leading-none">Last Update</span>
                            <p className="text-text-default text-15 leading-6 h-6">{state? state.lastUpdate : ""}</p>
                        </li>
                    </ul>
                    <div className="flex">
                        <div className="h-full px-10 min-w-[18.75rem] flex flex-col items-center justify-center border-l border-border-light">
                            <p className="text-primary font-bold text-xl leading-none mb-1">CO2eq</p>
                            <p className="text-text-dark text-[3.75rem] font-extrabold leading-none mb-1">{state? state.CO2EQ : ""}</p>
                            <p className="text-default text-xl">kg/ea</p>
                        </div>
                        <div className="h-full w-[18.75rem] flex flex-col items-center justify-center">
                            <img src={machine} alt="machine"/>
                        </div>
                    </div>
                </div>
                <div className="card h-[25rem] py-5 overflow-hidden mb-5">
                    <SankeyChart />
                </div>
                <div className="card h-auto mb-5">
                    <div className="h-11 p-4 flex items-center justify-between">
                        <p className="text-base font-bold text-text-dark pl-[0.875rem]">Super Tier Request</p>
                        <div>
                        </div>
                    </div>
                    <DataGrid header={STRHeader} rows={STRRows} totalCount={STRTotalCount} />
                </div>
                <div className="card h-auto mb-5">
                    <div className="p-4 flex items-center justify-between">
                        <p className="text-base font-bold text-text-dark pl-[0.875rem]">Product Component</p>
                        <div className='h-11 flex items-center justify-between'>
                            <button className='block' onClick={() => {
                                document.getElementById("componentAddModal").classList.remove("hidden");
                            }}>add component</button> 
                        </div>
                    </div>
                    <DataGrid header={PCHeader} rows={PCRows} totalCount={PCTotalCount} />
                </div>
                <div className="flex gap-5">
                    <div className="w-[calc(50%_-_0.625rem)]">
                        <div className="card h-auto">
                            <div className="p-4 flex items-center justify-between">
                                <p className="text-base font-bold text-text-dark pl-[0.875rem]">Product Resource</p>
                                <div className='h-11 flex items-center justify-between'>
                                    <button className='block' onClick={() => {
                                        document.getElementById("resourceAddModal").classList.remove("hidden");
                                    }}>add resource</button>
                                </div>
                            </div>
                            <DataGrid header={PRHeader} rows={PRRows} totalCount={PRTotalCount} />
                        </div>
                    </div>
                    <div className="w-[calc(50%_-_0.625rem)]">
                        <div className="card h-auto">
                            <div className="p-4 flex items-center justify-between">
                                <p className="text-base font-bold text-text-dark pl-[0.875rem]">Manufacturing Process</p>
                                <div className='h-11 flex items-center justify-between'>
                                    <button className='block' onClick={() => {
                                        document.getElementById("processAddModal").classList.remove("hidden");
                                    }}>add process</button>
                                </div>
                            </div>
                            <DataGrid header={MPHeader} rows={MPRows} totalCount={MPTotalCount} addElement={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page200;