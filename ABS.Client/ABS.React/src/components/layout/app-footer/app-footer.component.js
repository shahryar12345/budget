import React, { Component } from 'react';
import { NavLink, Link, Router, BrowserRouter } from 'react-router-dom';

const AppFooter = () => {
    return (
        <div className="bx--text app-footer">
            <BrowserRouter>                
                Copyright &copy; {(new Date().getFullYear())} Picis Clinical Solutions, Inc. All rights reserved. &nbsp;
                {/* Copyright © 2021 Picis Clinical Solutions, Inc. All rights reserved. */}
                {/* <NavLink element={Link} to="/PrivacyPolicy" lable="">Privacy Policy</NavLink>   &#8226; &nbsp;
                <NavLink element={Link} to="/TermOfUse" lable="">Term of Use</NavLink>&nbsp;&#8226; &nbsp;
                <NavLink element={Link} to="/Disclaimer" lable="">Disclaimer</NavLink> */}
            </BrowserRouter>
            {/* <p>{window._env_.ENVIRONMENT_NAME}-{window._env_.VERSION}</p> */}
        </div>
    );
}


export default AppFooter;