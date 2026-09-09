import {CdxField, CdxTextInput, CdxButton, CdxToggleSwitch} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';

export default defineComponent({
	name: 'LoginCard',
	emits: ['attempt'],
	data() {
		return {passBuf: '', remember: false};
	},
	computed: {
		valid() {
			return this.passBuf.length > 0;
		},
	},
	render() {
		const self = this;
		return h('div', {class: 'admin-login'}, [
			h('h3', '管理员登录'),
			h(CdxField, {
				status: self.valid ? 'default' : 'error',
				messages: {error: '密码是必填项'},
			}, {
				label() {
					return '密码';
				},
				default() {
					return h(CdxTextInput, {
						modelValue: self.passBuf,
						inputType: 'password',
						'onUpdate:modelValue'(v) {
							self.passBuf = v;
						},
					});
				},
			}),
			h('div', {class: 'admin-login__footer'}, [
				h('div', {class: 'admin-login__footer__remember'}, h(CdxToggleSwitch, {
					modelValue: self.remember,
					'onUpdate:modelValue'(v: boolean) {
						self.remember = v;
					},
				}, () => '记住密码')),
				h('div', {class: 'admin-login__footer__button'}, h(CdxButton, {
					action: 'progressive',
					weight: 'primary',
					disabled: !self.valid,
					onClick() {
						self.$emit('attempt', self.passBuf, self.remember);
					},
				}, () => '登录')),
			]),
		]);
	},
});
