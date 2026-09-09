import {CdxButton, CdxIcon, CdxToggleButton, CdxTooltip} from '@wikimedia/codex';
import {cdxIconArrowPrevious, cdxIconBell, cdxIconBellOutline, cdxIconGlobe} from '@wikimedia/codex-icons';
import {defineComponent, PropType, h, withDirectives} from 'vue';
import {Page} from './types';

export default defineComponent({
	name: 'Nav',
	props: {
		currentPage: {
			required: true,
			type: String as PropType<Page>,
		},
		title: {
			required: true,
			type: String,
		},
		haveNewAnnouncement: {
			required: true,
			type: Boolean,
		},
	},
	emits: [
		'go-home',
		'go-admin',
		'view-announcement',
	],
	render() {
		const self = this;
		return h('nav', {class: 'nav'}, [
			h(CdxButton, {
				weight: 'quiet',
				onClick() {
					self.$emit('go-home');
				},
				class: {
					'nav__go-home': true,
					'nav__go-home--hidden': self.currentPage === 'Home',
				},
			}, () => [h(CdxIcon, {icon: cdxIconArrowPrevious}), '回到首页']),
			h('h1', self.title + '注册'),
			withDirectives(h(CdxButton, {
				weight: 'quiet',
				action: self.haveNewAnnouncement ? 'progressive' : 'default',
				onClick() {
					self.$emit('view-announcement');
				},
			}, () => h(CdxIcon, {
				icon: self.haveNewAnnouncement ?
					cdxIconBell :
					cdxIconBellOutline,
			})), [[CdxTooltip, '查看公告']]),
			h(CdxToggleButton, {
				modelValue: self.currentPage === 'Admin',
				'onUpdate:modelValue'(v) {
					if (v === true) self.$emit('go-admin');
				},
				class: 'nav__go-admin',
			}, () => [h(CdxIcon, {icon: cdxIconGlobe}), '管理员']),
		]);
	},
});
