import {CdxCard} from '@wikimedia/codex';
import {defineComponent, h} from 'vue';
import RegistrationDialog from './components/RegistrationDialog';
import SuccessDialog from './components/SuccessDialog';

export default defineComponent({
	name: 'HomePage',
	data() {
		return {
			dialogOpen: false,
			registering: false,
			registered: false,
			registerStatus: false,
			registerMessage: '',
			successDialogOpen: false,
			username: '',
			password: '',
		};
	},
	render() {
		const self = this;
		return [
			h(RegistrationDialog, {
				open: self.dialogOpen,
				onClose() {
					self.dialogOpen = false;
				},
				registering: self.registering,
				registered: self.registered,
				registerStatus: self.registerStatus,
				registerMessage: self.registerMessage,
				onRegister({nick: name, code}: {nick: string; code: string}) {
					self.registered = false;
					self.registering = true;
					fetch('/api.php?action=consume', {
						method: 'POST',
						body: JSON.stringify({name, code}),
					})
						.then((r) => r.json())
						.then(({data: r}:
						({data: {error: string} | {username: string; password: string}})) => {
							if (!('error' in r)) {
								self.registerStatus = true;
								self.dialogOpen = false;
								self.username = r.username;
								self.password = r.password;
								self.successDialogOpen = true;
							} else {
								self.registerStatus = false;
								self.registerMessage = r.error;
							}
							self.registered = true;
							self.registering = false;
						});
				},
			}),
			h(SuccessDialog, {
				open: self.successDialogOpen,
				username: self.username,
				password: self.password,
				onClose() {
					self.successDialogOpen = false;
				},
			}),
			h(CdxCard, {
				class: 'registration-form',
				url: 'javascript:;',
				onClick() {
					self.registered = false;
					self.dialogOpen = true;
				},
			}, {
				title() {
					return '立即注册';
				},
				description() {
					return '免费注册莱斯超级API，获得优质、高速的公益AI服务。';
				},
			}),
		];
	},
});
