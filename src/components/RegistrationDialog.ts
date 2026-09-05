import {CdxDialog, CdxProgressBar, CdxField, CdxTextInput, CdxMessage} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';

export default defineComponent({
	name: 'RegistrationDialog',
	props: {
		open: {
			required: true,
			type: Boolean,
		},
		registering: {
			type: Boolean,
			default: false,
		},
		registered: {
			type: Boolean,
			default: false,
		},
		registerStatus: {
			type: Boolean,
			default: false,
		},
		registerMessage: {
			type: String,
			default: '',
		},
	},
	emits: ['register', 'close'],
	data() {
		return {nickBuf: '', codeBuf: ''};
	},
	computed: {
		nickValid() {
			return this.nickBuf.length < 12;
		},
		codeValid() {
			return this.codeBuf.length === 48;
		},
		valid() {
			return this.nickValid && this.codeValid;
		},
	},
	render() {
		const self = this;
		return h(CdxDialog, {
			open: self.open,
			title: '注册',
			subtitle: '自助创建你的账户',
			primaryAction: {
				label: '注册',
				actionType: 'progressive',
				disabled: !self.valid || self.registering,
			},
			defaultAction: {label: '取消'},
			onPrimary() {
				self.$emit('register', {nick: self.nickBuf, code: self.codeBuf});
			},
			onDefault() {
				self.$emit('close');
			},
		}, {
			header() {
				if (self.registering) return h(CdxProgressBar, {inline: true});
			},
			default() {
				return [
					h(CdxField, {
						optional: true,
						status: self.nickValid ? 'default' : 'error',
						messages: {error: '昵称太长'},
					}, {
						label() {
							return '昵称';
						},
						description() {
							return '你的昵称';
						},
						'helping-text'() {
							return '不得超过12字符';
						},
						default() {
							return h(CdxTextInput, {
								modelValue: self.nickBuf,
								'onUpdate:modelValue'(v) {
									self.nickBuf = v;
								},
							});
						},
					}),
					h(CdxField, {
						status: self.codeValid ? 'default' : 'error',
						messages: {error: '注册码不合法'},
					}, {
						label() {
							return '注册码';
						},
						description() {
							return '注册邀请码';
						},
						'helping-text'() {
							return '由管理员发放，应为48字符';
						},
						default() {
							return h(CdxTextInput, {
								modelValue: self.codeBuf,
								'onUpdate:modelValue'(v) {
									self.codeBuf = v;
								},
							});
						},
					}),
					h('hr'),
					...(self.registered ?
						[h(CdxMessage, {type: self.registerStatus ? 'success' : 'error', inline: true}, () => self.registerMessage)] :
						[]),
				];
			},
		});
	},
});
