import React from 'react';
import {
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavLink,
  SideNavMenuItem
} from 'carbon-components-react/lib/components/UIShell';
import { Link } from 'react-router-dom';
import { Favorite32, Task32, ChartBar32, Collaborate32, User32, TableSplit32, Events32, DeliveryTruck32, ThumbsUp32, Purchase32, Screen32} from '@carbon/icons-react';


class HeaderSideNav extends React.Component {
  render() {

    const isSideNavExpanded = this.props.isSideNavExpanded;
    const NavLinks = this.props.NavLinks;

    return (
      <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
        <SideNavItems>
          {NavLinks.map((ALink) => {
            const components = {
              1: Favorite32,
              2: Task32,
              3: ChartBar32,
              4: Collaborate32,
              5: User32,
              6: TableSplit32,
              7: Events32,
              8: DeliveryTruck32,
              9: ThumbsUp32,
              10: Purchase32,
              11: Screen32
            };
            const SpecificStory = components[ALink.icon];
            const Fade16 = () => (
              <SpecificStory aria-label={ALink.title}/>
            );
            if (typeof ALink.subLinks != "undefined") {
              return (
                <SideNavMenu renderIcon={Fade16} title={ALink.title}>
                  {ALink.subLinks.map((sub) => {
                    return (
                      <SideNavMenuItem element={Link} to={sub.navPath}>
                        {sub.title}
                      </SideNavMenuItem>
                    );
                  })}
                </SideNavMenu>
              );
            } else return (
              <SideNavLink renderIcon={Fade16} element={Link} to={ALink.navPath}> {ALink.title}</SideNavLink>
              );
          })}
          
        </SideNavItems>
      </SideNav>
    )
  }
}

export default HeaderSideNav;

/*<SideNavMenu renderIcon={Fade16} title="Favorites">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Accounts Payable">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Budgeting">
            <SideNavMenuItem href="javascript:void(0)">
              Data sets
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Reports
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Employee manager">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Employee self-service">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="General ledger">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Human resources">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Materials management">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Online recruitment">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Payroll">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>
          <SideNavMenu renderIcon={Fade16} title="Systems management">
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem
              aria-current="page"
              href="javascript:void(0)"
            >
              Link
                  </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">
              Link
                  </SideNavMenuItem>
          </SideNavMenu>*/
