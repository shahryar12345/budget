import axios from "axios";
import { Button, InlineNotification, TextInput } from "carbon-components-react";
import React, { useEffect, useState, createRef, useRef, useLayoutEffect } from "react";
import { makeApiRequest } from "../../../services/api";
import { useHistory } from 'react-router-dom';
import './login.scss'
import getURL from "../../../services/api/apiList";
import { setToken } from "../../../helpers/utils";
const Login = ({ }) => {

    const initialState = {
        username: 'efadmin',
        password: 'password',
        showNotification: false,
        notificationText: "",
        notificationType: 'success'
    }

    const [state, setState] = useState(initialState);
    const history = useHistory();

    const handleChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target;
        setState({ ...state, [id]: value })
    }

    const onSubmit = async () => {
        const obj = {
            "username": state.username,
            "password": state.password,
            "clientID": "ReactClient",
            "clientSecret": "ReactClientSecret",
            "apiResource": "LDAP"
        }

        await makeApiRequest('post', getURL("SIGNIN"), obj)
            .then(res => {
                if (res.status === 200 && res.data.status !== "Authentication failed") {
                    setToken(res?.data);
                    history.push({ pathname: "/BudgetVersions" });
                    console.log(res)
                }
                else {
                    setState({
                        ...state,
                        showNotification: true,
                        notificationText: "Invalid username/password.",
                        notificationType: "error"
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            {/* {state.showNotification ?
                <InlineNotification
                    title={state.notificationText}
                    kind={state.notificationType}
                    lowContrast='true'
                    notificationType='inline'
                    onCloseButtonClick={() => {
                        setState({
                            ...state, showNotification: false,
                        })
                    }}
                    className='add-budgetversion-notification'
                    iconDescription="Close Notification"
                />
                : ""} */}
            <div className="wrapper fadeInDown">
                <div id="formContent">
                    <h2 className="active"> Sign In </h2>

                    <div className="fadeIn first">
                    </div>

                    <TextInput
                        id="username"
                        type="text"
                        className="textBox"
                        // labelText="Username"
                        onChange={handleChange}
                        invalid={false}
                        invalidText={"state.formErrors.codeError"}
                        value={state.username}
                        disabled={false}
                        maxLength={15}
                    />
                    <TextInput
                        id="password"
                        type="password"
                        // labelText="Password"
                        className="textBox"
                        onChange={handleChange}
                        invalid={false}
                        invalidText={"state.formErrors.codeError"}
                        value={state.password}
                        disabled={false}
                        maxLength={15}
                    />
                    {state.showNotification ?
                        <InlineNotification
                            title={state.notificationText}
                            kind={state.notificationType}
                            lowContrast='true'
                            notificationType='inline'
                            onCloseButtonClick={() => {
                                setState({
                                    ...state, showNotification: false,
                                })
                            }}
                            className='add-budgetversion-notification'
                            iconDescription="Close Notification"
                        />
                        : ""}

                    <br />
                    <Button
                        className="bx--btn--tertiary marginTop-20"
                        type="submit"
                        onClick={onSubmit}
                        disabled={!state.username && !state.password}>
                        Signin
                    </Button>
                    {/* <input type="submit" className="fadeIn fourth" value="Log In" /> */}

                    {/* <div id="formFooter">
                        <a className="underlineHover" href="#">Forgot Password?</a>
                    </div> */}

                </div>
            </div>
        </>
    )
}

export default Login;