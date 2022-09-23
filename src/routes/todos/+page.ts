import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { api } from "./api";

type Todo = {
  uid: string;
  created_at: Date;
  text: string;
  done: boolean;
  pending_delete: boolean;
};

export const load: PageLoad = async (props) => ({
  todos: [] as Todo[],
});
