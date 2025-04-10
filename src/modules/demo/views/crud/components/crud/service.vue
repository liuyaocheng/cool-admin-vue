<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">service</el-tag>
			<span>Service 配置</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['crud/service.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="Service 配置" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-refresh-btn />
						<cl-add-btn />
						<cl-multi-delete-btn />

						<cl-flex1 />

						<cl-search-key />
					</cl-row>

					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>

					<!-- 新增、编辑 -->
					<cl-upsert ref="Upsert" />
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { ref } from 'vue';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';

//【很重要】service 是所有请求的集合，是一个对象（刷新页面和保存代码会自动读取后端的所有接口）
const { service, route } = useCool();
console.log('service', service);

const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		//【很重要】配置 service，如：service.base.sys.user
		// 不需要到具体的方法，如：service.base.sys.user.page，这是错误的！

		// 实际用法
		// service: service.base.sys.user,

		// 测试示例
		service: 'test'

		// 自定义配置1，添加本地 service 文件。
		// 【很重要】参考 /src/modules/demo/service/test.ts
		// 【很重要】必须放在目录 modules/*/service/ 下，才会自动注入到 service 中
		// service: service.test

		// 自定义配置2，针对一些特殊场景
		// service: {
		// 	page(params: any) {
		// 		// params 请求参数
		// 		//【很重要】必须返回一个 Promise 格式
		// 		return Promise.resolve({
		// 			list: [],
		// 			pagination: {
		// 				total: 1,
		// 				page: 1,
		// 				size: 20
		// 			}
		// 		});
		// 	}

		// 	// add、delete、update、info、list 也是如此配置
		// }
	},
	app => {
		// 首次调用刷新接口。在弹窗的情况下可以注释，用 Crud.value?.refresh() 方式手动调用
		app.refresh();

		// 带参数
		// app.refresh({
		// 	userId: route.query.id
		// });
	}
);

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ['refresh'],

	columns: [
		{
			type: 'selection'
		},
		{
			label: '姓名',
			prop: 'name',
			minWidth: 140
		},
		{
			label: '手机号',
			prop: 'phone',
			minWidth: 140
		},
		{
			label: '工作',
			prop: 'occupation',
			dict: dict.get('occupation'),
			minWidth: 140
		},
		{
			label: '创建时间',
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			buttons: ['edit', 'delete']
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	items: [
		{
			label: '姓名',
			prop: 'name',
			component: {
				name: 'el-input'
			}
		},
		{
			label: '手机号',
			prop: 'phone',
			component: {
				name: 'el-input'
			}
		},
		{
			label: '工作',
			prop: 'occupation',
			component: {
				name: 'cl-select',
				props: {
					tree: true,
					checkStrictly: true,
					options: dict.get('occupation')
				}
			}
		}
	]
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
