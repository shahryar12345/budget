import React from 'react';
import { shallow ,mount } from 'enzyme';
import SystemSettings from '../SystemSettings';
import rootReducer from '../../../../Core/_reducers';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { shallowToJson } from 'enzyme-to-json';



describe('<SystemSettings /> Unit Testing', () => {
    const initialSate = {}
    const mockStore = createStore(rootReducer, initialSate);
    
    const container = mount(   
    <Provider store={mockStore}>
            <SystemSettings />
    </Provider>
    );
    
    it('should match the snapshot of <SystemSettings />', () => {
        expect(shallowToJson(container)).toMatchSnapshot();
    });

    it('should have single element of <DTTable />' , ()=>
    {
        expect(container.find('DTTable').length).toEqual(1);
    });
   
});
