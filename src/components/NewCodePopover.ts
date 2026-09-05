import {CdxPopover, CdxField, CdxLookup} from '@wikimedia/codex';
import {defineComponent, PropType, h} from 'vue';

const QUOTA_PRESETS = [
	-1,
	10,
	50,
	100,
];

export default defineComponent({
	name: 'NewCodePopover',
	props: {
		open: {
			required: true,
			type: Boolean,
		},
		anchor: {
			required: true,
			type: undefined as unknown as PropType<HTMLElement|undefined>,
		},
	},
	emits: ['create', 'cancel'],
	data() {
		return {quota: -1, quotaTemp: '无限'};
	},
	computed: {
		valid() {
			return this.quota >= -1 && this.quota < 2147483647;
		},
		quotaTempInt() {
			return parseInt(this.quotaTemp === '无限' ? '-1' : this.quotaTemp);
		},
		lookupOptions() {
			return [{value: this.quotaTempInt, label: `自定义: ${this.quotaTempInt}`}, ...QUOTA_PRESETS.map((p) => ({value: p}))]
				.map((e) => ({
					...e,
					label: e.value === -1 ?
						('label' in e) ?
							e.label.replace('-1', '无限') :
							'无限' :
					// @ts-expect-error ...
						e.label ?? e.value.toString(),
				}));
		},
		quotaForRender() {
			return this.quotaTempInt === -1 ? '无限' : this.quotaTempInt.toString();
		},
	},
	render() {
		const self = this;
		return h(CdxPopover, {
			open: self.open,
			anchor: self.anchor,
			title: '生成新注册码',
			primaryAction: {actionType: 'progressive', label: '创建', disabled: !self.valid},
			defaultAction: {label: '取消'},
			onPrimary() {
				self.$emit('create', self.quota);
			},
			onDefault() {
				self.$emit('cancel');
			},
			placement: 'left-start',
		}, () => [
			h(CdxField, {status: self.valid ? 'default' : 'error', messages: {error: '配额超出范围'}}, {
				label() {
					return '配额';
				},
				description() {
					return '指定该注册码的最多使用次数';
				},
				default() {
					return h(CdxLookup, {
						selected: self.quota,
						inputValue: self.quotaForRender,
						menuItems: self.lookupOptions,
						menuConfig: {boldLabel: true},
						'onUpdate:selected'(s: number) {
							self.quota = s;
						},
						'onUpdate:inputValue'(v: string) {
							const cleared = v.replace('自定义: ', '');
							self.quotaTemp = cleared === '无限' ? '-1' : cleared;
						},
						ref: 'lookup',
						onVnodeUpdated() {
							// @ts-expect-error ...
							const menu = self.$refs.lookup.menu.$refs.rootElement as HTMLElement;
							// @ts-expect-error ...
							const lookup = self.$refs.lookup.$el as HTMLElement;
							lookup.style.marginTop = menu.clientHeight + 'px';
						},
					});
				},
			}),
		]);
	},
});
