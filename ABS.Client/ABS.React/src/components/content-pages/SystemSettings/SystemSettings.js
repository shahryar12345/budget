import DTTable from '../../layout/DtTable';
import React from 'react';
import ResponseData from '../../../services/api/apiCallerGet';
import getURL from '../../../services/api/apiList';

var url = getURL('SystemSettings');
console.log(ResponseData);
function SystemSettings(state, props) {
	if (state !== undefined) {
		state = {
			systemSettings: [
				{
					ItemTypeID: 1,
					ItemTypeKeyword: 'SystemSettings',
					ItemTypeName: 'DateFormat',
					ItemDataType: 'Date',
					Identifier: '111-111-001'
				},
				{
					ItemTypeID: 2,
					ItemTypeKeyword: 'SystemSettings',
					ItemTypeName: 'TimeBuy',
					ItemDataType: 'string',
					Identifier: '111-111-002'
				},
				{
					ItemTypeID: 3,
					ItemTypeKeyword: 'SystemSettings',
					ItemTypeName: 'Currency',
					ItemDataType: 'string',
					Identifier: '111-111-003'
				}
			]
		};
	}
	//PageLoad Function
	//Load All SYstem Settings Values
	// Check Change event of Combo Box
	// Bind Grid with results

	const systemSettingList = state.systemSettings.map((systemsetting) => {
		return (
			
			<div  key={systemsetting.ItemTypeID}>
				<div>{systemsetting.ItemTypeID}</div>
				<div>
					<p>
						<b>{systemsetting.ItemTypeKeyword}</b>
					</p>
				</div>
				<div>
					<p>
						<b>{systemsetting.ItemTypeName}</b>
					</p>
				</div>

				<div>{systemsetting.ItemDataType}</div>
				<div>{systemsetting.DataFormatting}</div>
				<div>{systemsetting.Identifier}</div>
			</div>
		);
	});

	return (
		// <div className="bx--grid">
		// 	<div className="bx--row">
		// 		<section className="bx--offset-lg-2">
		// 			{systemSettingList}
					<div>
						<DTTable />{' '}
					</div>
		// 		</section>
		// 	</div>
		// </div>
	);
}

export default SystemSettings;
