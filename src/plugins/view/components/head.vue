<template>
	<div class="cl-view-head" :class="{ 'is-border': border }">
		<el-icon class="cl-view-head__back" @click="router.back()">
			<arrow-left />
		</el-icon>

		<span class="cl-view-head__title">{{ title }}</span>

		<div class="op">
			<slot name="op"></slot>
		</div>
	</div>
</template>

<script setup lang="ts" name="cl-view-head">
import { computed } from 'vue';
import { useCool } from '/@/cool';
import { ArrowLeft } from '@element-plus/icons-vue';

const props = defineProps({
	title: String,
	border: Boolean
});

const { route, router } = useCool();

// 标题
const title = computed(() => props.title || route.query.title);
</script>

<style lang="scss" scoped>
.cl-view-head {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	height: 30px;

	&__back {
		cursor: pointer;
		height: 30px;
		width: 30px;
		font-size: 16px;
		border-radius: 4px;
		margin-right: 10px;
		background-color: var(--el-fill-color-lighter);

		&:hover {
			color: var(--color-primary);
		}
	}

	&__title {
		font-size: 14px;
		line-height: 1;
		margin-right: auto;
	}

	&.is-border {
		border-bottom: 1px solid var(--el-border-color-light);
		padding-bottom: 10px;
	}
}
</style>
