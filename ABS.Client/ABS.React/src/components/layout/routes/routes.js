import React from 'react';
import { Switch, Route } from 'react-router-dom'
import SystemSettings from '../../content-pages/SystemSettings';
import AddSystemSettings from '../../content-pages/SystemSettings/AddSystemSettings';
import Disclaimer from '../../content-pages/Disclaimer'
import BudgetVersions from '../../content-pages/BudgetVersions'
import RenameBudgetVersions from '../../content-pages/BudgetVersions/RenameBudgetVersions.js'
import BudgetVersionForm from '../../content-pages/BudgetVersions/budget-version-form.js'
import Forecast from '../../content-pages/Forecast';
import FteDivisors from '../../content-pages/FteDivisors';
import Mapping from '../../content-pages/Mapping';
import Inflation from '../../content-pages/Inflation';
import Raises from '../../content-pages/Raises/raises';
import PayTypeDistribution from '../../content-pages/PayTypeDistribution';
import PayTypeDistributionForm from '../../content-pages/PayTypeDistribution/pay-type-distribution-form';
import ManualWageRate from '../../content-pages/ManualWageRate';
import Backgroundjob  from '../../content-pages/BackgroundJob'

const routes = function () {
  return (
    <Switch>
      <Route path="/systemSettings" component={SystemSettings}></Route>
      <Route path="/AddSystemSettings" component={AddSystemSettings}></Route>
      <Route path="/Disclaimer" component={Disclaimer}></Route>
      <Route path="/BudgetVersions" component={BudgetVersions}></Route>
      <Route path="/BudgetVersion/:id" component={BudgetVersionForm}></Route>
      <Route path="/AddBudgetVersions" component={BudgetVersionForm}></Route>
      <Route path="/RenameBudgetVersions" component={RenameBudgetVersions}></Route>
      <Route path="/Forecast/:id" component={Forecast}></Route>
      <Route path="/FteDivisors" component={FteDivisors}></Route>
      <Route path="/Mapping" component={Mapping}></Route>
      <Route path="/Inflation/:id" component={Inflation}></Route>
      <Route path="/Raises/:id" component={Raises}></Route>
      <Route path="/PayTypeDistribution" component={PayTypeDistribution}></Route>
      <Route path="/AddPayTypeDistribution" component={PayTypeDistributionForm}></Route>
      <Route path="/EditPayTypeDistribution/:id" component={PayTypeDistributionForm}></Route>
      <Route path="/ManualWageRate/:id" component={ManualWageRate}></Route>
      <Route path="/Backgroundjobs" component={Backgroundjob}></Route>
     
    </Switch>)
}

export default routes