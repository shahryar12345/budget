import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Calculator16, Settings24, ChartBar16, TableSplit16, Purchase16, Help24, Search24, Favorite16, Map16, Task32, Logout32 } from '@carbon/icons-react';
import HALogo from '../assets/img/Harris-Affinity-White-Sm.png'
import LoadMasterData from "../../content-pages/MasterData/LoadMasterData";
import {
    HeaderContainer,
    Header,
    HeaderMenuButton,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink
} from 'carbon-components-react';
import { useHistory } from "react-router-dom";
import { getToken, removeToken } from "../../../helpers/utils";
import { allSideMenuItems } from "./allMenuItems";
import { useDispatch, useSelector } from "react-redux";
import { removeMasterData } from "../../../core/_actions/MasterDataActions";

const AppHeader = ({ user }) => {

    const history = useHistory();
    const userDetails = useSelector((state) => state.UserDetails);
	const dispatch = useDispatch(); // Use to update forecast Data related to Budget version , code , name

    let authData = getToken();
    authData = JSON.parse(authData);

    const onLogout = () => {
        dispatch(removeMasterData());
        removeToken();
        history.push({ pathname: '/signin' })
    }

    const isCurrentRouteActive = (currentRouteRelations) => {
        if (currentRouteRelations?.length && userDetails?.MenuItemsList?.length) {
            for (let ar of currentRouteRelations) {
                for (let arr of userDetails.MenuItemsList) {
                    if (ar == arr.value) {
                        return true
                    }
                }
            }
        }
        return false
    }

    const toRenderSideMenuItems = (onClickSideNavExpand) => {
        if (userDetails?.MenuItemsList?.length) {
            return allSideMenuItems.map(data => {
                if (isCurrentRouteActive([data.value])) {
                    return (<SideNavLink renderIcon={data.renderIcon} onClick={() => { history.push(data.path);onClickSideNavExpand() }}>
                        {data.name}
                    </SideNavLink>)

                }
            })
        }
        return ''

    }

    return (
        <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                <>
                    <Header aria-label="Harris Affinity" className="override">
                        <SkipToContent />
                        <HeaderMenuButton
                            aria-label="Open menu"
                            onClick={onClickSideNavExpand}
                            isActive={isSideNavExpanded}
                            isCollapsible
                        />

                        <HeaderName prefix="">
                            <img src={HALogo} alt="Harris Affinity Logo" width="110" height="36" />
                            <h3>Budgeting</h3>
                        </HeaderName>
                        <HeaderGlobalBar>

                            <HeaderGlobalAction aria-label="Search">
                                <Search24 />
                            </HeaderGlobalAction>
                            <HeaderGlobalAction aria-label="Search">
                                <NavLink className="header-link-button" element={Link} to="/AddSystemSettings" >
                                    <Settings24 aria-label="SystemSettings" className="iconColor" />
                                </NavLink>
                            </HeaderGlobalAction>
                            <HeaderGlobalAction aria-label="Search">
                                <Help24 />
                            </HeaderGlobalAction>

                            <div className="header-user-details">
                                <h6>{authData?.userProfile?.username}</h6>
                            </div>
                            <HeaderGlobalAction aria-label="Search" onClick={() => { onLogout() }}>
                                <Logout32 />
                            </HeaderGlobalAction>

                        </HeaderGlobalBar>
                        <SideNav
                            aria-label="Side navigation"
                            expanded={isSideNavExpanded}
                            isRail
                            className={isSideNavExpanded ? "" : "showExpandedSideBar"}
                        >
                            <SideNavItems>
                                <SideNavMenu renderIcon={Favorite16} title="Favorites">
                                    <SideNavMenuItem href="javascript:void(0)">Favorite Page 1</SideNavMenuItem>
                                </SideNavMenu>
                                {/*  */}
                                {/* {toRenderSideMenuItems(onClickSideNavExpand)} */}
                                {/* <SideNavLink renderIcon={ChartBar16} onClick={() => { history.push('/BudgetVersions') }}>
                                
                                */}


                                <SideNavLink renderIcon={ChartBar16} onClick={() => { history.push('/BudgetVersions') }}>
                                    Budget versions
                                </SideNavLink>
                                <SideNavLink renderIcon={Purchase16} onClick={() => { history.push('/Reports') }}>
                                    Reports
                                </SideNavLink>
                                <SideNavLink renderIcon={TableSplit16} href="#">
                                    Structure tables
                                </SideNavLink>
                                <SideNavLink renderIcon={Calculator16} onClick={() => { history.push('/FteDivisors') }}>
                                    FTE divisors
                                </SideNavLink>
                                <SideNavLink renderIcon={Calculator16} onClick={() => { history.push('/PayTypeDistribution') }}>
                                    Pay type distributions
                                </SideNavLink>
                                <SideNavLink renderIcon={Map16} onClick={() => { history.push('/Mapping') }}>
                                    Mappings
                                </SideNavLink>
                                <SideNavLink renderIcon={Task32} onClick={() => { history.push('/Backgroundjobs') }}>
                                    Background jobs
                                </SideNavLink>
                                <SideNavLink renderIcon={Task32} onClick={() => { history.push('/UserSetup') }}>
                                    User setup
                                </SideNavLink>
                                <SideNavLink renderIcon={Task32} onClick={() => { history.push('/RoleSetup') }}>
                                    Role setup
                                </SideNavLink>
                                {/*  */}

                                {/* <SideNavMenu renderIcon={Favorite16} title="Favorites">
                                    <SideNavMenuItem renderIcon={Task32} href="javascript:void(0)">Favorite Page 0</SideNavMenuItem>
                                    <div onClick={() => { history.push('/Mapping') }}><SideNavMenuItem href="javascript:void(0)" >Favorite Page 1</SideNavMenuItem></div>
                                    <SideNavMenuItem href="javascript:void(0)">Favorite Page 2</SideNavMenuItem>
                                    <SideNavMenuItem href="javascript:void(0)">Favorite Page 3</SideNavMenuItem>

                                </SideNavMenu> */}

                            </SideNavItems>
                        </SideNav>
                    </Header>
                    <LoadMasterData HeaderLoading='true' />
                </>
            )}
        />

    )
}

export default AppHeader;
