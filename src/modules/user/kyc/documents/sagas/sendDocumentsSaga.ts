// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import { alertPush } from '../../../../index';
import { sendDocumentsData, sendDocumentsError, SendDocumentsFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* sendDocumentsSaga(action: SendDocumentsFetch) {
    try {
        const response = yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/documents', action.payload);
        const defaultMessage = 'success.documents.accepted';
        const { message = defaultMessage } = response;
        yield put(sendDocumentsData({ message }));
        yield put(alertPush({ message: [defaultMessage], type: 'success'}));
    } catch (error) {
        yield put(sendDocumentsError(error));
        yield put(alertPush({ message: error.message, code: error.code, type: 'error'}));
    }
}
