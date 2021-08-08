import React from "react";
import { useState } from "react";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { Checkmark16 } from "@carbon/icons-react";
import FullScreenModal from "../budget-versions-modal/full-screen-modal";
import { useEffect } from "react";

const CustomDataTableOverflowMenu = ({
    row,
    type,
    budgetVersionType,
    setConfirmationModalState,
    handleSubmit,
    inDelete,
    bvScenarioType,
    isSubAccOption
}) => {
    const [overFlowItems, setOverFlowItems] = useState(GetOverFlowMenuItems(inDelete, bvScenarioType, isSubAccOption));

    const handleClick = (item, e) => {
        if (item.hasModalConfirmation) {
            setConfirmationModalState({ open: true, ...item, selectedRow: row })
        } else {
            handleSubmit(item.id, row);
        }
    }
    const handleMenuClick = (e) => {
        e.target.focus();
        e.preventDefault();
    }

    return <><OverflowMenu
        ariaLabel="Menu"
        direction="bottom"
        iconDescription=""
        flipped
        id="custom-datatable-overflow-menu"
        onClick={handleMenuClick}
        selectorPrimaryFocus="">
        {overFlowItems.map(item =>
            <OverflowMenuItem
                key={item.id}
                isDelete={false}
                hasDivider={true}
                onClick={(e) => handleClick(item, e)}
                itemText={<OverflowItemContent item={item} />}
            />)
        }
    </OverflowMenu>
    </>
}

const GetOverFlowMenuItems = (inDelete, bvScenarioType, isSubAccOption) => {
    const arr = [
        {
            id: 'openAppliedCalculation',
            text: 'Open applied calculations',
            val: true
        },
        {
            id: 'removeRationRate',
            text: 'Remove ratio and retain current value',
            hasModalConfirmation: true,
            modalHeader: 'Remove Ratio Rate confirmation',
            primaryButtonText: 'Remove Ratio Rate',
            modalContentText: <p className='custom-datatable-modal-content'>Are you sure you want to remove Ratio Rate?</p>,
            val: true
        },
        {
            text: 'Delete row',
            id: 'deleteRow',
            hasModalConfirmation: true,
            modalHeader: 'Delete confirmation',
            primaryButtonText: 'Delete',
            modalContentText: <p className='custom-datatable-modal-content' >Are you sure you want to delete the selected item? <br /> <br /> You cannot recover a deleted item. </p>,
            val: [inDelete]
        },
        {
            text: 'Open subaccount',
            id: 'openSubAccount',
            val: (isSubAccOption && (bvScenarioType === 'genralLedger' || bvScenarioType === 'statistics')) ? true : false
        }
    ]
    return arr.filter(data => data.val)
}

const OverflowItemContent = ({ item }) => {
    return <div class="custom-datatable-overflow-menu-item" >
        <span className="icon-container"> {item.checked ? <Checkmark16 /> : ''}</span>
        {item.text}</div>
}

export default CustomDataTableOverflowMenu;
