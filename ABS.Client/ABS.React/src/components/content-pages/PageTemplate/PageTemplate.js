import React, { Component } from 'react';
import PageHeader from '../../ContentPages/PageHeader'
import PageFooter from '../../ContentPages/PageFooter'

export default class PageTemplate extends Component {
	render() {
		return (
			<div>
				<PageHeader />
				<PageFooter />
			</div>
		);
	}
}
