import {useToast, CdxToastContainer} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';
import AdminDashboard from './components/AdminDashboard';
import LoginCard from './components/LoginCard';
import {Code} from './types';

export default defineComponent({
	name: 'AdminPage',
	setup() {
		const toastMgr = useToast();
		return {toastMgr};
	},
	provide() {
		return {toastMgr: this.toastMgr};
	},
	data() {
		return {
			authorized: false,
			password: '',
			codes: {},
		} as {
			authorized: boolean;
			password: string;
			codes: Record<Code['id'], Code>;
		};
	},
	created() {
		if (localStorage.getItem('password') !== null)
			this.attemptLogin(localStorage.getItem('password')!, true);
	},
	render() {
		const self = this;
		return [
			h(CdxToastContainer,
			),
			self.authorized ?
				h(AdminDashboard, {
					data: self.codes,
					onRevoke: self.revokeCode,
					onRefresh: self.loadDashboard,
					onCreate: self.createCode,
				}) :
				h(LoginCard, {onAttempt: self.attemptLogin}),
		];
	},
	methods: {
		loadDashboard() {
			fetch('/api.php?action=query&list=all_codes&acprop=id|code|quota|usage_count&aclimit=500', {headers: {Authorization: this.password}})
				.then((r) => r.json())
				.then(({data: {list: {all_codes: codes}}}: {data: {list: {all_codes: Code[]}}}) => {
					this.codes = Object.fromEntries(codes.map((c) => [c.id, c]));
				});
		},
		revokeCode(id: Code['id']) {
			fetch('/api.php?action=revoke_code', {
				method: 'POST',
				headers: {Authorization: this.password},
				body: JSON.stringify({id}),
			})
				.then((r) => r.json())
				.then(({data}: {data: ({success: true} | {error: string})}) => {
					if (!('error' in data)) this.toastMgr.success('吊销成功', {autoDismiss: 10000});
					else this.toastMgr.success(`吊销失败: ${data.error}`, {autoDismiss: 10000});
					this.loadDashboard();
				});
		},
		createCode(quota: number) {
			const self = this;
			fetch('/api.php?action=generate_code&quota=' + quota, {headers: {Authorization: self.password}})
				.then((r) => r.json())
				.then(({data: {code}}: {data: {code: Code['code']}}) => {
					self.toastMgr.success(`成功生成了新的注册码: ${code.slice(0, 12)}...`, {
						autoDismiss: 10000,
						actionButton: {
							label: '复制',
							onClick() {
								navigator.clipboard.writeText(code);
								self.toastMgr.success('复制成功', {autoDismiss: 10000});
							},
						},
					});
					self.loadDashboard();
				});
		},
		attemptLogin(password: string, remember: boolean) {
			const self = this;
			fetch('/api.php?action=auth_check', {headers: {Authorization: password}})
				.then((r) => r.json())
				.then(({data: {success}}: {data: {success: boolean}}) => {
					if (success) {
						self.authorized = true;
						self.password = password;
						if (remember)
							localStorage.setItem('password', password);

						self.toastMgr.success('欢迎回来', {autoDismiss: 10000});
						self.loadDashboard();
					} else {
						self.toastMgr.error('密码错误', {autoDismiss: 10000});
						localStorage.removeItem('password');
					}
				});
		},
	},
});
