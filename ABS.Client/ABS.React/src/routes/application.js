import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, useHistory } from 'react-router-dom'
import AddSystemSettings from '../components/content-pages/SystemSettings/AddSystemSettings';
import Disclaimer from '../components/content-pages/Disclaimer';
import BudgetVersions from '../components/content-pages/BudgetVersions';
import BudgetVersionForm from '../components/content-pages/BudgetVersions/budget-version-form';
import RenameBudgetVersions from '../components/content-pages/BudgetVersions/RenameBudgetVersions';
import Forecast from '../components/content-pages/Forecast';
import FteDivisors from '../components/content-pages/FteDivisors';
import Mapping from '../components/content-pages/Mapping';
import Inflation from '../components/content-pages/Inflation';
import Raises from '../components/content-pages/Raises/raises';
import PayTypeDistribution from '../components/content-pages/PayTypeDistribution';
import PayTypeDistributionForm from '../components/content-pages/PayTypeDistribution/pay-type-distribution-form';
import ManualWageRate from '../components/content-pages/ManualWageRate';
import AppHeader from '../components/layout/AppHeader/app-header.component';
import { Content, InlineLoading } from 'carbon-components-react';
import AppFooter from '../components/layout/app-footer/app-footer.component';
import SystemSettings from '../components/content-pages/SystemSettings';
import Backgroundjob from '../components/content-pages/BackgroundJob';
import UserSetup from '../components/content-pages/Admin/UserSetup/userSetup';
import RoleSetup from '../components/content-pages/Admin/RoleSetup';
import Reports from '../components/content-pages/Reports';
import { getToken, removeToken } from '../helpers/utils';
import { getUserDetails } from '../services/user-setup-service';
import { saveUserDetails } from '../core/_actions/UserDetailsActions';
import { useDispatch } from "react-redux";
//import {  } from "module";
import { allRoutes } from './allRoutes';
import { ENV } from '../components';
import ReportForm from '../components/content-pages/Reports/report-form';

const Application = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const [state, setState] = useState({ isLoading: true, menuItems: [] });
    const userDetails = useSelector((state) => state.UserDetails);

    useEffect(() => {
        // window.addEventListener('unload', (event) => {
        //     event.preventDefault();
        //     removeToken();
        // });

        if (ENV !== 'DEMO') {
            let authData = getToken();
            authData = JSON.parse(authData);
            if (authData?.token && authData?.userProfile) {
                toGetUserDetails(authData?.userProfile?.userProfileID)
                setState({ ...state, isLoading: false })
            }
            else {
                history.push({ pathname: "/signin" });
            }
        }
        else {
            dispatch(saveUserDetails([]))
            setState({ ...state, isLoading: false })
        }
    }, [])

    const toGetUserDetails = async (id) => {
        await getUserDetails(id).then((res) => {
            dispatch(saveUserDetails(res))
        })
    }

    const isCurrentRouteActive = (currentRouteRelations) => {
        if (Array.isArray(currentRouteRelations) && currentRouteRelations.length && userDetails.MenuItemsList.length) {
            for (let ar of currentRouteRelations) {
                for (let arr of userDetails.MenuItemsList) {
                    if (ar == arr.value) {
                        return true
                    }
                }
            }
        }
        else {
            if (userDetails.actionsPermissionBasedRoutes.length) {
                for (let ar of userDetails.actionsPermissionBasedRoutes) {
                    if (currentRouteRelations === ar?.path && ar?.value) {
                        return true
                    }
                }
            }
            return false
        }
    }

    const renderActiveRoutes = () => {
        if (userDetails?.MenuItemsList?.length) {
            return allRoutes.map(data => {
                if (isCurrentRouteActive(data.value)) {
                    return <Route path={data.path} component={data.component}></Route>
                }
            })
        }
        return ''

    }
    const { isLoading } = state;
    return (
        <div>
            { isLoading ? <InlineLoading /> : <>
                <AppHeader />
                <Content className="br--row page-content">
                    <Switch>
                    <Route path="/systemSettings" component={SystemSettings}></Route>
                    <Route path="/AddSystemSettings" component={AddSystemSettings}></Route>
                    <Route path="/Disclaimer" component={Disclaimer}></Route>
                    <Route path="/BudgetVersions" component={BudgetVersions}></Route>
                    <Route path="/BudgetVersion/:id" component={BudgetVersionForm}></Route>
                    <Route path="/AddBudgetVersions" component={BudgetVersionForm}></Route>
                    <Route path="/RenameBudgetVersions" component={RenameBudgetVersions}></Route>
                    <Route path="/Forecast/:id" component={Forecast}></Route>
                    <Route path="/FteDivisors" component={FteDivisors}></Route>
                    <Route path="/Mapping" component={Mapping}></Route>
                    <Route path="/Inflation/:id" component={Inflation}></Route>
                    <Route path="/Raises/:id" component={Raises}></Route>
                    <Route path="/PayTypeDistribution" component={PayTypeDistribution}></Route>
                    <Route path="/AddPayTypeDistribution" component={PayTypeDistributionForm}></Route>
                    <Route path="/EditPayTypeDistribution/:id" component={PayTypeDistributionForm}></Route>
                    <Route path="/ManualWageRate/:id" component={ManualWageRate}></Route>
                    <Route path="/Backgroundjobs" component={Backgroundjob}></Route>
                    <Route path="/UserSetup" component={UserSetup}></Route>
                    <Route path="/RoleSetup" component={RoleSetup}></Route>
                    <Route path="/Reports" component={Reports}></Route> 
                    <Route path="/AddReport" component={ReportForm}></Route> 
                    <Route path="/Report/:id" component={ReportForm}></Route> 

                        {/* {renderActiveRoutes()} */}
                    </Switch>
                </Content>
                <AppFooter />
            </>}
        </div>
    )
}

export default Application;