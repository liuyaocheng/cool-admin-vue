<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />

			<el-button
				v-permission="service.base.sys.log.permission.clear"
				type="danger"
				@click="clear"
			>
				清空
			</el-button>

			<cl-filter label="日志保存天数">
				<el-input-number
					v-model="day"
					controls-position="right"
					:max="10000"
					:min="1"
					@change="saveDay"
				/>
			</cl-filter>

			<cl-flex1 />
			<cl-search-key placeholder="搜索请求地址、用户昵称、ip" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" name="sys-log" setup>
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCool } from '/@/cool';
import { useCrud, useTable } from '@cool-vue/crud';

const { service } = useCool();

// 天数
const day = ref(1);

// cl-crud
const Crud = useCrud({ service: service.base.sys.log }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	contextMenu: ['refresh'],
	columns: [
		{
			type: 'index',
			label: '#',
			width: 60
		},
		{
			prop: 'userId',
			label: '用户ID',
			minWidth: 100
		},
		{
			prop: 'name',
			label: '用户昵称',
			minWidth: 120
		},
		{
			prop: 'action',
			label: '请求地址',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'params',
			label: '参数',
			minWidth: 200,
			component: {
				name: 'cl-code-json',
				props: {
					popover: true
				}
			}
		},
		{
			prop: 'ip',
			label: 'ip',
			minWidth: 150,
			dict: [],
			dictColor: true,
			formatter(row) {
				return row.ip.split(',');
			}
		},
		{
			prop: 'createTime',
			label: '请求时间',
			minWidth: 170,
			sortable: 'desc'
		}
	]
});

// 保存天数
function saveDay() {
	service.base.sys.log
		.setKeep({ value: day.value })
		.then(() => {
			ElMessage.success('保存成功');
		})
		.catch(err => {
			ElMessage.error(err.message);
		});
}

// 清空日志
function clear() {
	ElMessageBox.confirm('是否要清空日志？', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.base.sys.log
				.clear()
				.then(() => {
					ElMessage.success('清空成功');
					Crud.value?.refresh();
				})
				.catch(err => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

onMounted(() => {
	// 获取天数
	service.base.sys.log.getKeep().then(res => {
		day.value = Number(res);
	});
});
</script>
