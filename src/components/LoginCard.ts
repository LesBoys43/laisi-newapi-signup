import {CdxField, CdxTextInput, CdxButton} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';

export default defineComponent({
	name: 'LoginCard',
	emits: ['attempt'],
	data() {
		return {passBuf: ''};
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
			h(CdxButton, {
				action: 'progressive',
				weight: 'primary',
				disabled: !self.valid,
				class: 'admin-login__button',
				onClick() {
					self.$emit('attempt', self.passBuf);
				},
			}, () => '登录'),
		]);
	},
});
