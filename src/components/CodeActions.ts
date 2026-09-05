import {CdxButton, CdxIcon, CdxTooltip} from '@wikimedia/codex';
import {cdxIconUndo} from '@wikimedia/codex-icons';
import {defineComponent, withDirectives, h} from 'vue';
import RevokeConfirmDialog from './RevokeConfirmDialog';

export default defineComponent({
	name: 'CodeActions',
	emits: ['revoke'],
	data() {
		return {confirming: false};
	},
	render() {
		const self = this;
		return [
			withDirectives(h(CdxButton, {
				action: 'destructive',
				weight: 'quiet',
				onClick() {
					self.confirming = true;
				},
			}, () => h(CdxIcon, {icon: cdxIconUndo})), [
				[
					CdxTooltip,
					'吊销该注册码',
					'top',
				],
			]),
			h(RevokeConfirmDialog, {
				open: self.confirming,
				onConfirm() {
					self.$emit('revoke');
					self.confirming = false;
				},
				onCancel() {
					self.confirming = false;
				},
			}),
		];
	},
});
