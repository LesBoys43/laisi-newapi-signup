import {defineComponent, h} from 'vue';
import AdminPage from './AdminPage';
import HomePage from './HomePage';
import {Page} from './types';
import Nav from './nav';
import AnnouncementDialog from './components/AnnouncementDialog';

export default defineComponent({
	name: 'App',
	data() {
		return {
			page: 'Home',
			title: 'API',
			announcement: '',
			announcementClosed: parseInt(localStorage.getItem('ignored') ?? '0') === Math.floor(Date.now() / (86400 * 1000)),
			haveNewAnnouncement: false,
		} as {
			page: Page;
			title: string;
			announcement: string;
			announcementClosed: boolean;
			haveNewAnnouncement: boolean;
		};
	},
	computed: {
		announcementOpen() {
			return !this.announcementClosed && this.announcement !== '';
		},
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
			.then(({data: {meta: {site_info: {title, announcement}}}}:
			{data: {meta: {site_info: {title: string; announcement: string}}}}) => {
				this.title = title;
				this.announcement = announcement;
				this.haveNewAnnouncement = announcement !== localStorage.getItem('announcement');
				localStorage.setItem('announcement', announcement);
			});
	},
	render() {
		const self = this;
		return [
			h(Nav, {
				currentPage: self.page,
				title: self.title,
				haveNewAnnouncement: self.haveNewAnnouncement,
				onGoHome() {
					self.page = 'Home';
				},
				onGoAdmin() {
					self.page = 'Admin';
				},
				onViewAnnouncement() {
					self.announcementClosed = false;
				},
			}),
			h(AnnouncementDialog, {
				open: self.announcementOpen,
				announcement: self.announcement,
				onClose(ignoreWithinDay: boolean) {
					self.announcementClosed = true;
					self.haveNewAnnouncement = false;
					if (ignoreWithinDay) localStorage.setItem('ignored', Math.floor(Date.now() / (86400 * 1000)).toString());
				},
			}),
			h({Home: HomePage, Admin: AdminPage}[self.page]),
		];
	},
});
