import { Mitt } from "../utils/mitt";
import { isFunction } from "lodash-es";
import { computed, getCurrentInstance, inject, reactive } from "vue";

export function useCore() {
	const crud = inject("crud") as ClCrud.Ref;
	const mitt = inject("mitt") as Mitt;

	return {
		crud,
		mitt
	};
}

export function useConfig() {
	return inject("__config__") as Config;
}

export function useBrowser() {
	return inject("__browser__") as Browser;
}

export function useRefs() {
	const refs = reactive<{ [key: string]: obj }>({});

	function setRefs(name: string) {
		return (el: any) => {
			refs[name] = el;
		};
	}

	return { refs, setRefs };
}

export function useProxy(ctx: any) {
	const { type }: any = getCurrentInstance();
	const { mitt, crud } = useCore();

	// 挂载
	crud[type.name] = ctx;

	// 事件
	mitt.on("crud.proxy", ({ name, data = [], callback }: any) => {
		if (ctx[name]) {
			let d = null;

			if (isFunction(ctx[name])) {
				d = ctx[name](...data);
			} else {
				d = ctx[name];
			}

			if (callback) {
				callback(d);
			}
		}
	});

	return ctx;
}

export function useElApi(keys: string[], el: any) {
	return keys.reduce((apis, key) => {
		apis[key] = computed(() => el.value?.[key]);
		return apis;
	}, {} as obj);
}

export * from "./crud";
