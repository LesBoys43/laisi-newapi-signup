import {defineComponent, h} from 'vue';
import AdminPage from './AdminPage';
import HomePage from './HomePage';
import {Page} from './types';
import Nav from './nav';

export default defineComponent({
	name: 'App',
	data() {
		return {
			page: 'Home',
			title: 'API',
		} as {
			page: Page;
			title: string;
		};
	},
	watch: {
		title: {
			flush: 'sync',
			handler(v) {
				document.getElementsByTagName('title')[0]!.innerText = v + '注册';
			},
		},
	},
	created() {
		fetch('/api.php?action=query&meta=site_info')
			.then((r) => r.json())
			.then(({data: {meta: {site_info: {title}}}}:
			{data: {meta: {site_info: {title: string}}}}) => {
				this.title = title;
			});
	},
	render() {
		const self = this;
		return [
			h(Nav, {
				currentPage: self.page,
				title: self.title,
				onGoHome() {
					self.page = 'Home';
				},
				onGoAdmin() {
					self.page = 'Admin';
				},
			}),
			h({Home: HomePage, Admin: AdminPage}[self.page]),
		];
	},
});
