import { MODEL_TO_EDIT_LOADED } from './actions';
import modelToEditStore from '../modelToEditStore';

export const programModel = action$ => modelToEditStore
    // We currently only want the redux store to update then we're dealing with a program.
    .filter(model => model.modelDefinition.name === 'program')
    .map(model => ({ type: MODEL_TO_EDIT_LOADED, payload: model.clone() }));