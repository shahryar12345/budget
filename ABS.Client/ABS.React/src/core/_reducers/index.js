import BudgetVersionReducer from "./BudgetVersionsSlice";
import ItemTypesReducer from "./ItemTypesSlice";
import MasterDataReducer from "./MasterDataSlice";
import NotificationsReducer from "./NotificationsSlice";
import { combineReducers } from "redux";
import structureTableReducer from "./structureTablesSlice";
import systemSettingsReducer from "./systemSettingsSlice";
import forecastReducer from "./ForecastSlice";
import mappingReducer from "./MappingSlice";
import UserDetailsReducer from "./UserDetails";


const rootReducer = combineReducers({
  systemSettings: systemSettingsReducer,
  BudgetVersions: BudgetVersionReducer,
  StructureTables: structureTableReducer,
  ItemTypes: ItemTypesReducer,
  MasterData: MasterDataReducer,
  NotificationsReducer: NotificationsReducer,
  ForecastReducer: forecastReducer,
  Mapping : mappingReducer,
  UserDetails : UserDetailsReducer
});

export default rootReducer;
