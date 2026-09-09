import {createApp} from 'vue';
import App from './app';
import handleError from './Error';

// eslint-disable-next-line
function onerror(_a: any, _b: any, _c: any, _d: any, err: Error | string): void {
	handleError(err ?? '未知错误');
}

// @ts-expect-error ...
window.onerror = onerror;

window.onunhandledrejection = function (e: PromiseRejectionEvent) {
	onerror(e, '', '', '', e.reason);
};

createApp(App).mount('#app');
