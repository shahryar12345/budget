import axios from 'axios';
import { makeApiRequest } from './api';
import getURL from './api/apiList';


export const saveStatisticsToDepartmentMappings = (mappingData , entityID) => {
    let updatedData = mapStatisticsToDepartmentMappingsData(mappingData , entityID);
    return new Promise((resolve) => {
        // axios.post(getURL('STATISTICSMAPPINNGS') , updatedData).then((response) => {
        makeApiRequest('post', getURL('STATISTICSMAPPINNGS'), updatedData).then((response) => {
            resolve({
                success : response.status === 200 ? true : false
              })
        }).catch((err)=> {
            console.log('Error occured while saving forecast')
            resolve({
                success : false
            })
        });
    });
}

export const getStatisticsToDepartmentMappingsByEntity = (entityID) => {
    return new Promise((resolve) => {
        // axios.get(getURL('GETENTITYSTATISTICSMAPPINNGS') , { params : { EntityID : entityID}}).then((response) => {
        makeApiRequest('get', getURL('GETENTITYSTATISTICSMAPPINNGS'), { params: { EntityID: entityID } }).then((response) => {
            resolve({
                success: response.status === 200 ? true : false,
                data: response.data
            })
        }).catch((err) => {
            resolve({
                success: false,
            })
        });
    })
}

const mapStatisticsToDepartmentMappingsData = (mappingData , entityID) => {
    return mappingData.map((data) => {
        return {
            entityID : entityID,
            ...data
        }  
    });
}

export const deleteJobCodeToGLAccountMappings = (deletedMapping) => {
    return new Promise((resolve) => {
        //   axios.all(axios.delete(`${getURL('GLACCOUNTMAPPINGS')}/${deletedMapping}`)).then((response) => {
        makeApiRequest('delete', `${getURL('GLACCOUNTMAPPINGS')}/${deletedMapping}`).then((response) => {
            resolve({
                success: response.status === 200 ? true : false
            })
        }).catch((err) => {
            console.error('Error occured while deleting GL account mappings')
            resolve({
                success: false
            })
        });
    });
}

export const saveJobCodeToGLAccountMappings = (EntityID, DepartmentID, JobCodeID, PayTypeID, GLAccountID, Index) => {
    return new Promise((resolve) => {
        // axios.post(getURL('GLACCOUNTMAPPINGS'), null, {params: {EntityID, DepartmentID, JobCodeID, PayTypeID, GLAccountID, Index}}).then((response) => {
        let queryParams = { EntityID, DepartmentID, JobCodeID, PayTypeID, GLAccountID, Index };
        queryParams = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
        makeApiRequest('post', `${getURL('GLACCOUNTMAPPINGS')}?${queryParams}`).then((response) => {
            resolve({
                success: response.status === 200 ? true : false
            })
        }).catch((err) => {
            console.log('Error occured while saving GL account mappings')
            resolve({
                success: false
            })
        });
    });
}

export const getJobCodeToGLAccountByEntity = (entityID) => {
    return new Promise((resolve) => {
        // axios.get(`${getURL('GLACCOUNTMAPPINGS')}/GetEntityMappings`, { params : { EntityID : entityID}}).then((response) => {
        makeApiRequest('get', `${getURL('GLACCOUNTMAPPINGS')}/GetEntityMappings`, { params: { EntityID: entityID } }).then((response) => {
            resolve({
                success: response.status === 200 ? true : false,
                data: response.data
            })
        }).catch((err) => {
            resolve({
                success: false,
            })
        });
    })
}