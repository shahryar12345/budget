import React, { Component } from 'react';
import { Button, loginui, TextInput,Checkbox, Form, FormGroup } from 'carbon-components-react';
import { Redirect } from 'react-router';

import axios from 'axios';
import getURL from '../../../../services/api/apiList' ;

var url = getURL('Authentication');
const TextInputProps = {
	className: 'bx--text__input',
	id: 'xInputUsername',

	placeholder: 'Please enter username'
};
const checkboxEvents = {
	className: 'bx--checkbox-wrapper',
	labelText: 'Use SSO'
};
const checkboxRememberME = {
	id: 'xchkboxRememberME',
	className: 'bx--checkbox-wrapper',
	labelText: 'Remember Me'
};
const SubmitbuttonEvents = {
	// className: 'bx--btn bx--btn--primary',
};

const PasswordProps = {
	id: 'xInputPassword',
	className: 'bx--text__input'
	//  labelText="Password",
	// placeholder="Please Enter Password"
};
const formGroupProps = {
	id: 'xformGroup',
	legendText: 'User SignIn'
	// labelText="Password",
	// placeholder="Please Enter Password"
};

const UIStyles = {
	margin: 150
};

class UserLogin extends Component {
	state = {
		userAuthenticationStatus: false,
		access_token: null,
		token_type: null,
		scope: null,
		expires_in: null
	};

	handleChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
		console.log(this.state)
	};
	handleSubmit = (e) => {
		e.preventDefault();
	//	console.log(this.state);
	//	console.log(url);
		axios.get(url).then((res) => {
			const arrayList = res.data;
			// console.log(res);
			// this.setState({ arrayList });
			//  console.log(arrayList);
			//this.context.history.push('/header');
			this.setState(this.state == null ? null : arrayList);
			if (this.state.access_token === null) {
				this.setState({ userAuthenticationStatus: false });
				
			} else {
				this.setState({ userAuthenticationStatus: true });
				console.log(this.props);
				this.props.history.push ('/TemplateHeader')
			}

			//console.log(this.state);
		});
	};

	render() {
		return (
			<div className="bx--snippet">
				<div className="bx--fieldset">
					<Form {...formGroupProps} onSubmit={this.handleSubmit}>
						<fieldset>
							{/* <legend>Budgeting</legend> */}
							<div className="bx--row">
								<div className="bx--col">
									{' '}
									<div>Username</div>
								</div>
								<div className="bx--col">
									<TextInput required {...TextInputProps} onChange={this.handleChange} />
								</div>
							</div>
							<div className="bx--row">
								<div className="bx--col">
									{' '}
									<div>Password</div>
								</div>
								<div class="bx--col">
									<TextInput
										type="password"
										required
										//   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
										{...PasswordProps}
										onChange={this.handleChange}
									/>
								</div>
							</div>
							<div className="bx--row">
								<div className="bx--col">
									{' '}
									<Checkbox {...checkboxEvents} id="xchkboxSSO" />
								</div>
								<div className="bx--col">
									{' '}
									<Checkbox {...checkboxRememberME} id="xc_remeberMe"  />{' '}
								</div>
							</div>
							<div className="bx--row">
								<Button className="bx--snippet" type="submit" {...SubmitbuttonEvents}>
									Login
								</Button>
							</div>
						</fieldset>
					</Form>
				</div>
			</div>
		);
	};
}

export default UserLogin;
