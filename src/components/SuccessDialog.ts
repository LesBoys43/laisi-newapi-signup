import {CdxDialog, CdxMessage, CdxField, CdxTextInput} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';

export default defineComponent({
	name: 'SuccessDialog',
	props: {
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		open: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['close'],
	render() {
		const self = this;
		return h(CdxDialog, {
			open: self.open,
			title: '注册成功',
			subtitle: '欢迎使用莱斯超级API',
			defaultAction: {label: '关闭'},
			onDefault() {
				self.$emit('close');
			},
		}, () => [
			h('span'),
			h(CdxMessage, {
				status: 'success',
				allowUserDismiss: true,
			}, () => '恭喜你，成功注册！'),
			h(CdxField, {}, {
				label() {
					return '用户名';
				},
				default() {
					return h(CdxTextInput, {modelValue: self.username, readonly: true});
				},
			}),
			h(CdxField, {
				status: 'warning',
				messages: {warning: '请迅速修改该临时密码！'},
			}, {
				label() {
					return '密码';
				},
				default() {
					return h(CdxTextInput, {modelValue: self.password, readonly: true});
				},
			}),
		]);
	},
});
