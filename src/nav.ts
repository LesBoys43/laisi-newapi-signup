import {CdxButton, CdxIcon, CdxToggleButton} from '@wikimedia/codex';
import {cdxIconArrowPrevious, cdxIconGlobe} from '@wikimedia/codex-icons';
import {defineComponent, PropType, h} from 'vue';
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
	},
	emits: ['go-home', 'go-admin'],
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
