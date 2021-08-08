import React, { Component } from 'react';

import { NavLink , Link , Router , BrowserRouter} from 'react-router-dom';
// import PrivacyPolicy from '../PrivacyPolicy'
// import TermOfUse from '../TermofUse'
// import Disclaimer from '../Disclaimer'
// import { copyright20 } from '@carbon/icons-react';
class PageFooter extends Component {
    render() {
        return (
            <div className="bx--text">
                {/* BrowserRouter added here , because while mounting for unit test , PageFooter thorugh error due to Navlink Used without BrowserRouter Parent - SS */}
                <BrowserRouter>
                Copyright &copy; 2020 Picis Clinical Solutions, Inc and 2020 Quadra Med Affinity Corporation. All rights reserved. &nbsp;
                <NavLink element={Link}  to="/PrivacyPolicy" lable="">Privacy Policy</NavLink>   &#8226; &nbsp;
                <NavLink element={Link} to="/TermOfUse" lable="">Term of Use</NavLink>&nbsp;&#8226; &nbsp;
                <NavLink element={Link} to="/Disclaimer" lable="">Disclaimer</NavLink>
                </BrowserRouter>
            </div>
        );
    }
}

export default PageFooter;