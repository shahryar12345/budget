import AppHeader from './components/layout/AppHeader/app-header.component';
import AppFooter from './components/layout/app-footer/app-footer.component';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import React from 'react';
// import Routes from './components/layout/routes';
import './app.scss';
import Routes from './routes'

function App() {
	return (
		<div>
			<Routes />
			{/* <AppHeader />
			<Content className="br--row page-content">
				<Routes />
			</Content>
			<AppFooter/> */}
		</div>
	);
};
export default App;