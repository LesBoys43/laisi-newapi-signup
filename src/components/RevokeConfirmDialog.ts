import {CdxDialog} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';

export default defineComponent({
	name: 'RevokeConfirmDialog',
	props: {
		open: {
			required: true,
			type: Boolean,
		},
	},
	emits: ['confirm', 'cancel'],
	render() {
		const self = this;
		return h(CdxDialog, {
			open: self.open,
			title: '确认吊销',
			primaryAction: {actionType: 'progressive', label: '确认'},
			defaultAction: {label: '取消'},
			onPrimary() {
				self.$emit('confirm');
			},
			onDefault() {
				self.$emit('cancel');
			},
		}, () => '是否确实要吊销该注册码，此操作不可撤销');
	},
});
