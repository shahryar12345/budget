import React, { Component } from 'react';
import { Favorite16 } from '@carbon/icons-react';
import { Breadcrumb, BreadcrumbItem, InlineNotification } from 'carbon-components-react';

const PageHeader = ({ heading, breadCrumb, notification, icon , notificationKind }) => {
	const getNotificationTitle = () =>
	{
		if(notification === "Forecasting")
		{
			return <><span>{notification }</span> <span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span><span style={{paddingLeft:'15px'}}>{"Budget version locked."}</span></>
		}else
		{
			return notification
		}
	}
	return (
		<div className="bx--grid page-header-container">
			<Breadcrumb noTrailingSlash>
				<BreadcrumbItem key={"defaultFirst-item"}>
					<a href="/#">Home</a>
				</BreadcrumbItem>
				{breadCrumb?.map((breadCrumbItem , breadCrumbItemindex) =>
					<BreadcrumbItem key={breadCrumbItemindex+"item"}>
						<a key={breadCrumbItemindex+"ref"} href={breadCrumbItem.link}>{breadCrumbItem.text}</a>
					</BreadcrumbItem>
				)}
				{/* <BreadcrumbItem href="#">{''}</BreadcrumbItem> */}
			</Breadcrumb>
			<h4>{heading}  &nbsp; {icon}</h4>

			{notification && <InlineNotification title={getNotificationTitle()} kind={notificationKind ? notificationKind : "success"} lowContrast='true' notificationType='inline' className='add-budgetversion-notification'/>}
		</div>
	)
}

export default PageHeader;