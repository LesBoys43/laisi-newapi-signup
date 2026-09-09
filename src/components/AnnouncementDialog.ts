import {CdxDialog, CdxToggleSwitch} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';

export default defineComponent({
	name: 'AnnouncementDialog',
	props: {
		announcement: {
			type: String,
			required: true,
		},
		open: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {ignoreWithinDay: false};
	},
	emits: ['close'],
	render() {
		const self = this;
		return h(CdxDialog, {
			open: self.open,
			title: '站点公告',
			subtitle: '管理员发布的最新公告',
			defaultAction: {label: '关闭'},
			onDefault() {
				self.$emit('close', self.ignoreWithinDay);
			},
		}, {
			default() {
				return self.announcement;
			},
			footer() {
				return h(CdxToggleSwitch, {
					modelValue: self.ignoreWithinDay,
					'onUpdate:modelValue'(v) {
						self.ignoreWithinDay = v;
					},
				}, () => '一天内不再显示');
			},
		});
	},
});
