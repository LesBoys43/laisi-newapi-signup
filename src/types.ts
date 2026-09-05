export type Page = 'Home' | 'Admin';

export type Code = {
	id: number;
	code: string;
	quota: number | -1;
	usage_count: number;
};
