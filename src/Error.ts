import {CdxCard, CdxMessage} from '@wikimedia/codex';
import {createApp, defineComponent, h} from 'vue';

const Error = defineComponent({
	name: 'Error',
	props: {
		error: {
			type: String,
			required: true,
		},
	},
	render() {
		const self = this;
		return h(CdxCard, {class: 'error'}, {
			title() {
				return '系统错误';
			},
			description() {
				return h(CdxMessage, {type: 'error', class: 'error__message'}, () => `未处理的异常: ${self.error}`);
			},
			'supporting-text'() {
				return h('a', {
					onClick() {
						location.reload();
					},
				}, '刷新');
			},
		});
	},
});

export default function handleError(err: Error | string): void {
	createApp(Error, {error: err.toString()}).mount('#app');
}
