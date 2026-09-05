import {CdxInfoChip, CdxTooltip} from '@wikimedia/codex';
import {defineComponent, PropType, withDirectives, h} from 'vue';
import {Code} from '../types';

const USAGECHIP_LABEL_BY_TYPE = {
	success: '充裕',
	warning: '紧张',
	error: '用尽',
};

export default defineComponent({
	name: 'UsageChip',
	props: {
		data: {
			required: true,
			type: Object as PropType<Pick<Code, 'quota' | 'usage_count'>>,
		},
	},
	computed: {
		chipType() {
			const usedRate = this.data.usage_count / this.data.quota;
			if (usedRate < 0.5) return 'success';
			else if (usedRate < 1) return 'warning';
			else return 'error';
		},
		chipMsg() {
			return this.data.quota === 0 ? '吊销' : this.data.quota === -1 ? '无限' : USAGECHIP_LABEL_BY_TYPE[this.chipType];
		},
		tooltipText() {
			return this.data.quota === 0 ? '注册码已吊销' : this.data.quota === -1 ? `已用: ${this.data.usage_count}` : `${this.data.usage_count}/${this.data.quota}`;
		},
	},
	render() {
		return withDirectives(
			h(CdxInfoChip, {status: this.chipType}, () => this.chipMsg),
			[
				[
					CdxTooltip,
					this.tooltipText,
					'top',
				],
			],
		);
	},
});
