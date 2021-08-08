import { Add20, Information20, Subtract20 } from '@carbon/icons-react';
import { Button, Checkbox, InlineLoading, TextInput, TooltipIcon } from 'carbon-components-react';
import React, { createRef, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSubAccounts } from '../../../services/budget-version-service';
import { formatValue, parseNumber } from '../../../services/format-service';
import FullScreenModal from '../../shared/budget-versions-modal/full-screen-modal';

const signleRow = {
    accName: "",
    total: null,
    july: null,
    august: null,
    september: null,
    october: null,
    november: null,
    december: null,
    january: null,
    february: null,
    march: null,
    april: null,
    may: null,
    june: null,
    totalError: false,
    julyError: false,
    augustError: false,
    septemberError: false,
    octoberError: false,
    novemberError: false,
    decemberError: false,
    januaryError: false,
    februaryError: false,
    marchError: false,
    aprilError: false,
    mayError: false,
    juneError: false,
    islock: false,
    accNameError: false,
    modalTitle: "",
    modalContentTitle: "",

}

const initialState = {
    rows: [],
    autoCalculate: true,
    isCalculationDone: false,
    isLoading: true,
    isEdit: false
}

const errorText = "Out of balance"

const SubAccountModals = ({
    isSubAccountModalOpen,
    selectedRowForSubAccounts,
    closeSubAccountsModal,
    onSubAccountSubmit
}) => {

    const [state, setState] = useState({ ...initialState });

    const formatParameters = useSelector(state => {

        const decimalFormats = state.MasterData.ItemDecimalPlaces || [];
        let decimalSetting;
        decimalSetting = state.systemSettings.decimalPlacesAmounts || 'itemDecimalPlaces-2';
        const groupingFormat = state.systemSettings.xc_Commas?.toLowerCase() === 'true' ?? false;

        // Get the format string, and strip off the first token to obtain the number of decimals
        let fractionDigits = decimalFormats.find(({ itemTypeCode }) => itemTypeCode === decimalSetting)?.itemTypeValue ?? 2;

        let signType;
        let negativeCellValueClass;
        switch (state.systemSettings.rd_negativeValues) {
            case 'withSign':
                negativeCellValueClass = 'statistics-table-cell-black-value';
                signType = 'standard';
                break;
            case 'redSign':
                negativeCellValueClass = 'statistics-table-cell-red-value';
                signType = 'standard';
                break;
            case 'withBracket':
                negativeCellValueClass = 'statistics-table-cell-black-value';
                signType = 'accounting';
                break;
            case 'redBracket':
                negativeCellValueClass = 'statistics-table-cell-red-value';
                signType = 'accounting';
                break;
            default:
                negativeCellValueClass = 'statistics-table-cell-black-value';
                signType = 'standard';
                break;
        }

        return {
            minimumFractionDigits: fractionDigits,
            useGrouping: groupingFormat,
            negativeCellValueClass: negativeCellValueClass,
        }
    });

    useEffect(() => {
        toRunOnFirstLoadData();
    }, [selectedRowForSubAccounts]);

    const toRunOnFirstLoadData = async () => {
        if (isSubAccountModalOpen) {
            {
                let modalTitle, modalContentTitle;
                if (selectedRowForSubAccounts) {
                    const {
                        scenariotype,
                        glaccountcode,
                        glaccountname,
                        entitycode,
                        entityname,
                        departmentcode,
                        departmentname,
                        statisticscode,
                        statisticsname,
                        july,
                        august,
                        september,
                        october,
                        november,
                        december,
                        january,
                        february,
                        march,
                        april,
                        may,
                        june,
                        dataid
                    } = selectedRowForSubAccounts
                    if (scenariotype === "General Ledger") {
                        modalTitle = `${glaccountcode} ${glaccountname}`
                    }
                    else if (scenariotype === "Statistic") {
                        modalTitle = `${statisticscode} ${statisticsname}`
                    }
                    modalContentTitle = `${entitycode} ${entityname} - ${departmentcode} ${departmentname}`
                    setState({
                        ...state,
                        modalTitle,
                        modalContentTitle,
                        isLoading: true
                    })

                    try {
                        await toGetSubAccount(dataid, scenariotype)
                            .then(res => {
                                if (res?.data?.length) {
                                    setState({
                                        ...state,
                                        rows: [
                                            { ...res.data.find(data => (data.isParent)) },
                                            ...res.data.filter(data => (data.isSubAccount)),
                                            { ...res.data.find(data => (data.isReconcile)) },
                                        ],
                                        modalTitle,
                                        modalContentTitle,
                                        isLoading: false,
                                        isEdit: true
                                    })

                                }
                                else {
                                    const parentRow = {
                                        accName: modalTitle,
                                        total: (july + august + september + october + november + december + january + february + march + april + may + june),
                                        july,
                                        august,
                                        september,
                                        october,
                                        november,
                                        december,
                                        january,
                                        february,
                                        march,
                                        april,
                                        may,
                                        june,
                                        totalError: false,
                                        julyError: false,
                                        augustError: false,
                                        septemberError: false,
                                        octoberError: false,
                                        novemberError: false,
                                        decemberError: false,
                                        januaryError: false,
                                        februaryError: false,
                                        marchError: false,
                                        aprilError: false,
                                        mayError: false,
                                        juneError: false,
                                        islock: true,
                                    }

                                    const lastRow = {
                                        accName: "Reconciliation with parent data table row",
                                        total: (july + august + september + october + november + december + january + february + march + april + may + june),
                                        july,
                                        august,
                                        september,
                                        october,
                                        november,
                                        december,
                                        january,
                                        february,
                                        march,
                                        april,
                                        may,
                                        june,
                                        islock: true,
                                    }
                                    setState({
                                        ...state,
                                        rows: [
                                            { id: Math.floor(Math.random() * 1000), ...parentRow },
                                            { id: Math.floor(Math.random() * 1000), ...signleRow },
                                            { id: Math.floor(Math.random() * 1000), ...signleRow },
                                            { id: Math.floor(Math.random() * 1000), ...signleRow },
                                            { id: Math.floor(Math.random() * 1000), ...lastRow },
                                        ],
                                        modalTitle,
                                        modalContentTitle,
                                        isLoading: false
                                    })

                                }
                            })
                            .catch(err => console.log(err))
                    }
                    catch (err) {
                        console.log(err)
                    }
                }
            }
        }
    }

    const toGetSubAccount = (BudgetVersionRowID, scenariotype) => {
        return new Promise((resolve, reject) => {
            getSubAccounts({ BudgetVersionRowID, BVType: scenariotype === "General Ledger" ? "GL" : "ST", })
                .then(res => {
                    return resolve(res)
                })
                .catch(err => { return reject(err) })
        })
    }

    const handleAddSubtractSubaccounts = (method, index) => {
        const arr = [...state.rows];
        if (method == 'sub') {
            arr.splice(index, 1)
        }
        else if (method == 'add') {
            arr.splice(index + 1, 0, { ...signleRow, id: Math.floor(Math.random() * 1000) })
        }
        setState({
            ...state,
            rows: calculateSubAccounts([...arr])
        })
    }

    const handleTextChange = (e, index) => {
        const arr = [...state.rows];
        if (index < state.rows.length) {
            if (arr[index]) {
                arr[index] = { ...arr[index], [e.target.id]: e.target.value }
            }
        }
        setState({ ...state, rows: calculateSubAccounts([...arr]) });
    }

    const handleNumberChangeWithCalculation = (e, index, rowType, fieldType) => {
        const arr = [...state.rows];
        if (index < state.rows.length) {
            if (arr[index]) {
                const parentRowWithoutUpdate = { ...arr[0] }
                if (Number((e.target.value)) === 0)
                    arr[index] = { ...arr[index], [e.target.id]: Number(e.target.value) }
                else {
                    const val = e.target.value.replace(/^0+/, '')
                    arr[index] = { ...arr[index], [e.target.id]: Number((val)) }
                }
                if (fieldType === "total") {
                    arr[index] = spreadTotalValueAcrossMonthsBasedOnParent(parentRowWithoutUpdate, arr[index])
                }
                if (rowType === "parentRow") {
                    for (let i = 1; i < (arr.length - 1); i++) {
                        if (!arr[i].islock) {
                            arr[i] = spreadTotalValueAcrossMonthsBasedOnParent(arr[0], { ...arr[i], total: arr[0].total * (arr[i].total / parentRowWithoutUpdate.total) })
                        }
                    }
                }
                if (!arr[index].islock && state.autoCalculate) {
                    setState({ ...state, rows: calculateSubAccounts([...arr]) })
                }
                else setState({ ...state, rows: [...arr], isCalculationDone: false });
            }
        }
    }

    const spreadTotalValueAcrossMonthsBasedOnParent = (parentRow, subRow) => {
        if (parentRow && subRow) {
            if (parentRow.total > 0) {
                subRow = {
                    ...subRow,
                    july: subRow.total * (parentRow.july / parentRow.total),
                    august: subRow.total * (parentRow.august / parentRow.total),
                    september: subRow.total * (parentRow.september / parentRow.total),
                    october: subRow.total * (parentRow.october / parentRow.total),
                    november: subRow.total * (parentRow.november / parentRow.total),
                    december: subRow.total * (parentRow.december / parentRow.total),
                    january: subRow.total * (parentRow.january / parentRow.total),
                    february: subRow.total * (parentRow.february / parentRow.total),
                    march: subRow.total * (parentRow.march / parentRow.total),
                    april: subRow.total * (parentRow.april / parentRow.total),
                    may: subRow.total * (parentRow.may / parentRow.total),
                    june: subRow.total * (parentRow.june / parentRow.total),
                }
            }
            else {
                const divideEquallyPer = ((100 / 12) / 100);
                subRow = {
                    ...subRow,
                    july: subRow.total * (divideEquallyPer),
                    august: subRow.total * divideEquallyPer,
                    september: subRow.total * divideEquallyPer,
                    october: subRow.total * divideEquallyPer,
                    november: subRow.total * divideEquallyPer,
                    december: subRow.total * divideEquallyPer,
                    january: subRow.total * divideEquallyPer,
                    february: subRow.total * divideEquallyPer,
                    march: subRow.total * divideEquallyPer,
                    april: subRow.total * divideEquallyPer,
                    may: subRow.total * divideEquallyPer,
                    june: subRow.total * divideEquallyPer,
                }
            }
        }
        return subRow

    }

    const calculateSubAccounts = (arr) => {
        let total = 0;
        let july = 0;
        let august = 0;
        let september = 0;
        let october = 0;
        let november = 0;
        let december = 0;
        let january = 0;
        let february = 0;
        let march = 0;
        let april = 0;
        let may = 0;
        let june = 0;
        let totalError = false;
        let julyError = false;
        let augustError = false;
        let septemberError = false;
        let octoberError = false;
        let novemberError = false;
        let decemberError = false;
        let januaryError = false;
        let februaryError = false;
        let marchError = false;
        let aprilError = false;
        let mayError = false;
        let juneError = false;
        let accNameError = false;
        let obj = {}


        for (let i = 1; i < (arr.length - 1); i++) {
            obj = { ...arr[i] }
            total += obj.total ? obj.total : 0;
            july += obj.july ? obj.july : 0;
            august += obj.august ? obj.august : 0;
            september += obj.september ? obj.september : 0;
            october += obj.october ? obj.october : 0;
            november += obj.november ? obj.november : 0;
            december += obj.december ? obj.december : 0;
            january += obj.january ? obj.january : 0;
            february += obj.february ? obj.february : 0;
            march += obj.march ? obj.march : 0;
            april += obj.april ? obj.april : 0;
            may += obj.may ? obj.may : 0;
            june += obj.june ? obj.june : 0;
        }

        obj = { ...arr[0] };
        total = obj.total ? obj.total - total : 0;
        july = obj.july ? obj.july - july : 0;
        august = obj.august ? obj.august - august : 0;
        september = obj.september ? obj.september - september : 0;
        october = obj.october ? obj.october - october : 0;
        november = obj.november ? obj.november - november : 0;
        december = obj.december ? obj.december - december : 0;
        january = obj.january ? obj.january - january : 0;
        february = obj.february ? obj.february - february : 0;
        march = obj.march ? obj.march - march : 0;
        april = obj.april ? obj.april - april : 0;
        may = obj.may ? obj.may - may : 0;
        june = obj.june ? obj.june - june : 0;

        obj = { ...arr[arr.length - 1] };

        obj = { ...obj, total, july, august, september, october, november, december, january, february, march, april, may, june };

        arr[arr.length - 1] = { ...obj };

        const reconcileRow = { ...obj };
        for (let i = 0; i < (arr.length - 1); i++) {
            obj = { ...arr[i] }
            if (!obj.accName && obj.total > 0) accNameError = true
            else accNameError = false

            if (reconcileRow.total < 0 && obj.total > 0) totalError = true
            else totalError = false;

            if (reconcileRow.july < 0 && obj.july > 0) julyError = true
            else julyError = false;

            if (reconcileRow.august < 0 && obj.august > 0) augustError = true
            else augustError = false;

            if (reconcileRow.september < 0 && obj.september > 0) septemberError = true
            else septemberError = false;

            if (reconcileRow.october < 0 && obj.october > 0) octoberError = true
            else octoberError = false;

            if (reconcileRow.november < 0 && obj.november > 0) novemberError = true
            else novemberError = false;

            if (reconcileRow.december < 0 && obj.december > 0) decemberError = true
            else decemberError = false;

            if (reconcileRow.january < 0 && obj.january > 0) januaryError = true
            else januaryError = false;

            if (reconcileRow.february < 0 && obj.february > 0) februaryError = true
            else februaryError = false;

            if (reconcileRow.march < 0 && obj.march > 0) marchError = true
            else marchError = false;

            if (reconcileRow.april < 0 && obj.april > 0) aprilError = true
            else aprilError = false;

            if (reconcileRow.may < 0 && obj.may > 0) mayError = true
            else mayError = false;

            if (reconcileRow.june < 0 && obj.june > 0) juneError = true
            else juneError = false;

            if (obj.total < (obj.july + obj.august + obj.september + obj.october + obj.november + obj.december + obj.january + obj.february + obj.march + obj.april + obj.may + obj.june)) {
                totalError = true;
                if (obj.july > 0) julyError = true;
                if (obj.august > 0) augustError = true;
                if (obj.september > 0) septemberError = true;
                if (obj.october > 0) octoberError = true;
                if (obj.november > 0) novemberError = true;
                if (obj.december > 0) decemberError = true;
                if (obj.january > 0) januaryError = true;
                if (obj.february > 0) februaryError = true;
                if (obj.march > 0) marchError = true;
                if (obj.april > 0) aprilError = true;
                if (obj.may > 0) mayError = true;
                if (obj.june > 0) juneError = true;
            }

            arr[i] = { ...arr[i], totalError, julyError, augustError, septemberError, octoberError, novemberError, decemberError, januaryError, februaryError, marchError, aprilError, mayError, juneError, accNameError }
        }


        return arr;
    }

    const toHandleislock = (bool, index) => {
        const arr = [...state.rows];
        if (index < state.rows.length) {
            if (arr[index]) {
                arr[index] = { ...arr[index], islock: bool }
            }
        }
        setState({ ...state, rows: [...arr] });
    }
    const toHandleAutoCalculate = (bool) => {
        setState({
            ...state,
            autoCalculate: bool,
        })
    }
    const validate = () => {
        const {
            rows,
            isCalculationDone,
            autoCalculate
        } = state;
        if (rows.length) {
            const reconcileRow = { ...rows[rows.length - 1] }
            if (reconcileRow) {
                const {
                    total,
                    july,
                    august,
                    september,
                    october,
                    november,
                    december,
                    january,
                    february,
                    march,
                    april,
                    may,
                    june
                } = reconcileRow;
                if (rows[1]?.accName && (rows[1]?.total > 0) && (isCalculationDone || autoCalculate) && total >= 0 && july >= 0 && august >= 0 && september >= 0 && october >= 0 && november >= 0 && december >= 0 && january >= 0 && february >= 0 && march >= 0 && april >= 0 && may >= 0 && june >= 0) {
                    for (let i = 0; i < rows.length - 1; i++) {
                        if (rows[i].totalError || rows[i].accNameError) return true
                    }
                    return false;
                }
            }
        }
        return true
    }


    const onSubmit = () => {
        let { rows } = state;
        rows = rows.filter((data) => data.accName);
        const modifiedRow = []
        if (rows.length) {
            rows.forEach((data, index) => {
                if (data.accName) {
                    modifiedRow.push({
                        subAccName: data.accName,
                        total: data.total,
                        july: data.july,
                        august: data.august,
                        september: data.september,
                        october: data.october,
                        november: data.november,
                        december: data.december,
                        january: data.january,
                        february: data.february,
                        march: data.march,
                        april: data.april,
                        may: data.may,
                        june: data.june,
                        islock: data.islock,
                        isParentRow: (index === 0) ? true : false,
                        isSubAccRow: ((index !== 0) && (index !== (rows.length - 1))) ? true : false,
                        isReconcilRow: (index === (rows.length - 1)) ? true : false
                    })
                }
            })
        }

        const obj = {
            bvRowId: selectedRowForSubAccounts?.dataid,
            rows: [...modifiedRow],
            scenariotype: selectedRowForSubAccounts?.scenariotype === "General Ledger" ? "GL" : "ST"
        }
        onSubAccountSubmit(obj, state.isEdit)
        // console.log({ obj })
    }

    const toReturnSubAccounts = (subaccounts) => {
        if (subaccounts.length) {
            return subaccounts.map((data, index) => {
                const {
                    id,
                    total,
                    accName,
                    july,
                    august,
                    september,
                    october,
                    november,
                    december,
                    january,
                    february,
                    march,
                    april,
                    may,
                    june,
                    totalError,
                    julyError,
                    augustError,
                    septemberError,
                    octoberError,
                    novemberError,
                    decemberError,
                    januaryError,
                    februaryError,
                    marchError,
                    aprilError,
                    mayError,
                    juneError,
                    islock,
                    accNameError
                } = data;
                if (index !== (subaccounts.length - 1)) {
                    return (
                        <>
                            {index === 0 ? <div class="bx--row">
                                <div class="bx--col-lg-12">
                                    <p>Data row: {state.modalContentTitle}</p>
                                </div>
                            </div> : ""}
                            <div class="bx--row modal-form" key={id}>
                                <div class={`bx--col-lg-3 ${index === 0 ? "padding-1-point-5rem" : ""} `}>
                                    {index !== 0 ? <> <TooltipIcon
                                        direction="top"
                                        tooltipText="Add a subaccount row below."
                                        align="start"
                                    >
                                        <Add20
                                            onClick={(e) => {
                                                handleAddSubtractSubaccounts("add", index)
                                            }}
                                        ></Add20>
                                    </TooltipIcon>
                                        {subaccounts.length > 3 ? <TooltipIcon
                                            direction="top"
                                            tooltipText="Remove the subaccount row below."
                                            align="start"
                                        >
                                            <Subtract20
                                                onClick={(e) => {
                                                    handleAddSubtractSubaccounts("sub", index)
                                                }}
                                            ></Subtract20>
                                        </TooltipIcon> : ""}
                                    </> : ""
                                    } <TextInput
                                        id={"accName"}
                                        type={"text"}
                                        labelText={index === 0 ? "Parent data table row" : "Name"}
                                        value={accName}
                                        invalid={accNameError}
                                        invalidText={"required"}
                                        disabled={index === 0 ? true : islock}
                                        onChange={(e) => {
                                            handleTextChange(e, index)
                                        }}
                                    />
                                </div>
                                <div class="bx--col-lg-2 padding-1-point-5rem">
                                    <TextInput
                                        id={"total"}
                                        type={"number"}
                                        labelText="Total"
                                        invalid={totalError}
                                        placeholder={"0"}
                                        invalidText={errorText}
                                        value={total}
                                        disabled={islock}
                                        onChange={(e) => {
                                            handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "total")
                                        }}
                                    />
                                </div>
                                <div class="bx--col-lg-1 padding-3-point-5rem">
                                    <Checkbox
                                        id={`AutoUpdateCheckBox-0000${id}`}
                                        labelText={
                                            <>Lock
                                        <TooltipIcon
                                                    direction="top"
                                                    tooltipText="Prevent changes to this row's values when other values change. You can still directly edit this row's values."
                                                    align="start"
                                                >
                                                    <Information20 className="fte-inline-tooltip-icon" />
                                                </TooltipIcon>
                                            </>
                                        }
                                        checked={islock}
                                        onClick={(e) => {
                                            toHandleislock(!islock, index)
                                        }}
                                    />

                                </div>
                                <div class="bx--col-lg-1">

                                </div>
                                <div class="bx--col-lg-5 padding-1-point-5rem">
                                    <div class="bx--row custom-width-95rem">
                                        <div class="bx--col-lg-1">
                                            <TextInput
                                                id={`july`}
                                                type={"number"}
                                                labelText="Jul (optional)"
                                                value={july}
                                                placeholder={"0"}
                                                invalid={julyError}
                                                invalidText={errorText}
                                                disabled={islock}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "july")
                                                }}
                                            />
                                        </div>
                                        <div class="bx--col-lg-1">
                                            <TextInput
                                                id={`august`}
                                                type={"number"}
                                                labelText="Aug (optional)"
                                                placeholder={"0"}
                                                value={august}
                                                invalid={augustError}
                                                invalidText={errorText}
                                                disabled={islock}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "august")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={`september`}
                                                type={"number"}
                                                labelText="Sep (optional)"
                                                placeholder={"0"}
                                                value={september}
                                                invalid={septemberError}
                                                invalidText={errorText}
                                                disabled={islock}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "september")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={"october"}
                                                type={"number"}
                                                labelText="Oct (optional)"
                                                placeholder={"0"}
                                                value={october}
                                                invalid={octoberError}
                                                invalidText={errorText}
                                                disabled={islock}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "october")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={'november'}
                                                type={"number"}
                                                labelText="Nov (optional)"
                                                placeholder={"0"}
                                                value={november}
                                                invalid={novemberError}
                                                invalidText={errorText}
                                                disabled={islock}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "november")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={'december'}
                                                type={"number"}
                                                placeholder={"0"}
                                                value={december}
                                                invalid={decemberError}
                                                labelText="Dec (optional)"
                                                disabled={islock}
                                                invalidText={errorText}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "december")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={'january'}
                                                type={"number"}
                                                placeholder={"0"}
                                                value={january}
                                                invalid={januaryError}
                                                labelText="Jan (optional)"
                                                disabled={islock}
                                                invalidText={errorText}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "january")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={"february"}
                                                type={"number"}
                                                placeholder={"0"}
                                                value={february}
                                                invalid={februaryError}
                                                labelText="Feb (optional)"
                                                disabled={islock}
                                                invalidText={errorText}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "february")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={"march"}
                                                type={"number"}
                                                placeholder={"0"}
                                                value={march}
                                                invalid={marchError}
                                                labelText="Mar (optional)"
                                                disabled={islock}
                                                invalidText={errorText}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "march")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={"april"}
                                                type={"number"}
                                                placeholder={"0"}
                                                value={april}
                                                placeholder={"0"}
                                                invalid={aprilError}
                                                labelText="Apr (optional)"
                                                disabled={islock}
                                                invalidText={errorText}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "april")
                                                }}
                                            />
                                        </div><div class="bx--col-lg-1">
                                            <TextInput
                                                id={"may"}
                                                type={"number"}
                                                placeholder={"0"}
                                                value={may}
                                                invalid={mayError}
                                                labelText="May (optional)"
                                                disabled={islock}
                                                invalidText={errorText}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "may")
                                                }}
                                            />
                                        </div>
                                        <div class="bx--col-lg-1">
                                            <TextInput
                                                id={"june"}
                                                type={"number"}
                                                placeholder={"0"}
                                                value={june}
                                                invalid={juneError}
                                                labelText="Jun (optional)"
                                                disabled={islock}
                                                invalidText={errorText}
                                                onChange={(e) => {
                                                    handleNumberChangeWithCalculation(e, index, index === 0 ? "parentRow" : "subAccRow", "june")
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {index === 0 ?
                                <div class="bx--row">
                                    <div class="bx--col-lg-12">
                                        <Checkbox
                                            id={`AutoUpdateCheckBox-0000${"row.id"}`}
                                            labelText={
                                                "Automatically calculate"
                                            }
                                            checked={state.autoCalculate}
                                            onClick={(e) => {
                                                toHandleAutoCalculate(!state.autoCalculate)
                                            }}
                                        />
                                    </div>
                                </div> : ""
                            }
                        </>
                    )
                }
                else if (index === (subaccounts.length - 1)) {
                    return (
                        <div class="bx--row padding-3-point-5rem">
                            <div class="bx--col-lg-3">
                                <p className="bold-text">Reconciliation with parent data table row</p>
                            </div>
                            <div class="bx--col-lg-2">
                                <p className="bold-text">{formatReconciliationValue(total)}</p>
                            </div>
                            <div class="bx--col-lg-1">
                            </div>
                            <div class="bx--col-lg-1">
                            </div>
                            <div class="bx--col-lg-5">
                                <div class="bx--row custom-width-95rem">
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(july)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(august)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(september)}</p>

                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(october)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(november)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(december)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(january)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(february)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(march)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(april)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(may)}</p>
                                    </div>
                                    <div class="bx--col-lg-1">
                                        <p className="bold-text text-centre">{formatReconciliationValue(june)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            })
        }
        return ""
    }

    const formatReconciliationValue = (value) => {
        // format the cell value according to the supplied format parameters
        const formattedValue = formatValue(value, 'number', 'en-US', formatParameters);
        // get display class
        const cellValueClass = parseNumber(value) < 0 ? formatParameters.negativeCellValueClass : 'statistics-table-cell-black-value';

        return <span className={cellValueClass}>{formattedValue}</span>;
    }


    // console.log(state)
    const { isLoading, rows } = state;
    return (<>
        <FullScreenModal
            open={isSubAccountModalOpen}
            hasScrollingContent={true}
            iconDescription="Close"
            modalAriaLabel={"ssstitle"}
            modalHeading={`${state.modalTitle} subaccounts`}
            onRequestClose={(e) => { closeSubAccountsModal() }}
            onRequestSubmit={() => { onSubmit() }}
            onSecondarySubmit={() => { closeSubAccountsModal() }}
            passiveModal={false}
            primaryButtonDisabled={validate()}
            primaryButtonText="Show in Table"
            secondaryButtonText="Cancel"
            size='lg'
        >
            <> {
                isLoading ? <InlineLoading /> :

                    <div class="bx--grid">
                        {toReturnSubAccounts(rows)}
                        <div class="bx--row">
                            <div class="bx--col-lg-12">
                                <Button
                                    id="spread_click"
                                    kind="primary"
                                    type="button"
                                    disabled={state.autoCalculate}
                                    onClick={(e) => {
                                        setState({ ...state, rows: calculateSubAccounts([...state.rows]), isCalculationDone: true })
                                    }}
                                >
                                    Calculate
                    </Button>
                            </div>
                        </div>

                    </div>
            }
            </>
        </FullScreenModal>
    </>)
}


export default SubAccountModals;





