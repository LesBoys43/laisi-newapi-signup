import {TableRowIdentifier, CdxTable, CdxButton, CdxIcon, CdxTooltip} from '@wikimedia/codex';
import {cdxIconAdd, cdxIconReload} from '@wikimedia/codex-icons';
import {defineComponent, PropType, h, withDirectives, ComponentPublicInstance} from 'vue';
import {Code} from '../types';
import CodeActions from './CodeActions';
import NewCodePopover from './NewCodePopover';
import UsageChip from './UsageChip';

export default defineComponent({
	name: 'AdminDashboard',
	props: {
		data: {
			required: true,
			type: Object as PropType<Record<Code['id'], Code>>,
		},
	},
	emits: [
		'revoke',
		'create',
		'refresh',
	],
	data() {
		return {creating: false};
	},
	computed: {
		tableData() {
			return Object.values(this.data)
				.map((e: Code) => ({[TableRowIdentifier]: e.id, id: e.id, code: e.code}));
		},
	},
	render() {
		const self = this;
		return [
			h(CdxTable, {
				caption: '仪表板',
				columns: [
					{id: 'id', label: '编号'},
					{id: 'code', label: '注册码'},
					{id: 'usage', label: '使用情况'},
					{id: 'actions', label: '动作'},
				],
				data: self.tableData,
				paginate: true,
				paginationSizeOptions: [
					{value: 10},
					{value: 50},
					{value: 100},
					{value: 500},
				],
				paginationSizeDefault: 10,
			}, {
				header() {
					return h(CdxButton, {
						action: 'progressive',
						ref: 'newCodeBtn',
						onClick() {
							self.creating = true;
						},
					}, () => [h(CdxIcon, {icon: cdxIconAdd}), '生成新注册码']);
				},
				'item-usage'({row: {[TableRowIdentifier]: id}}: {row: {[TableRowIdentifier]: Code['id']}}) {
					return h(UsageChip, {data: self.data[id]});
				},
				'item-actions'({row: {[TableRowIdentifier]: id}}: {row: {[TableRowIdentifier]: Code['id']}}) {
					return h(CodeActions, {
						onRevoke() {
							self.$emit('revoke', id);
						},
					});
				},
				footer() {
					return withDirectives(h(CdxButton, {
						weight: 'quiet',
						onClick() {
							self.$emit('refresh');
						},
					}, () => h(CdxIcon, {icon: cdxIconReload})), [
						[
							CdxTooltip,
							'刷新仪表板',
							'right',
						],
					]);
				},
			}),
			h(NewCodePopover, {
				open: self.creating,
				anchor: (self.$refs.newCodeBtn as ComponentPublicInstance|undefined)
					?.$el as HTMLButtonElement|undefined,
				onCreate(quota: number) {
					self.$emit('create', quota);
					self.creating = false;
				},
				onCancel() {
					self.creating = false;
				},
			}),
		];
	},
});
