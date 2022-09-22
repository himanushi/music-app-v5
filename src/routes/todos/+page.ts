import { error } from '@sveltejs/kit';
import { api } from './api';
import type { PageLoad } from './$types';

type Todo = {
	uid: string;
	created_at: Date;
	text: string;
	done: boolean;
	pending_delete: boolean;
};

export const load: PageLoad = async (props) => {
	// locals.userid comes from src/hooks.js

	return {
		todos: [] as Todo[]
	};
};
