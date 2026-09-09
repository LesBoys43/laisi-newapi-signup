import {App as VueApp, createApp} from 'vue';
import App from './app';
import handleError from './Error';

let $app: VueApp | null = null;

// eslint-disable-next-line
function onerror(_a: any, _b: any, _c: any, _d: any, err: Error | string): void {
	if ($app)
		try {
			$app.unmount();
		} catch {}

	handleError(err ?? '未知错误');
}

// @ts-expect-error ...
window.onerror = onerror;

window.onunhandledrejection = function (e: PromiseRejectionEvent) {
	onerror(e, '', '', '', e.reason);
};

$app = createApp(App);

$app.mount('#app');
